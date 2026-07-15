import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { addMinutes, parseISO, subMinutes } from "date-fns";
import { resend } from "@/lib/email";
import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

const bookingSchema = z.object({
  adminId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  notes: z.string().max(1000, "Notes must be under 1000 characters").optional().nullable()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = bookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { date, time, name, email, phone, notes } = validation.data;
    let adminId = validation.data.adminId;

    // 1. Resolve Admin ID
    if (!adminId) {
      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      });
      if (!adminUser) {
        return NextResponse.json({ error: "No admin user found in the system" }, { status: 404 });
      }
      adminId = adminUser.id;
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // 2. Fetch Settings
    const settings = await prisma.calendarSettings.findUnique({
      where: { userId: adminId }
    }) || {
      slotDuration: 30,
      bufferTime: 15,
      noticePeriod: 12
    };

    // 3. Construct Start & End Dates
    const targetDate = parseISO(date);
    const [hours, minutes] = time.split(":").map(Number);
    const startTime = new Date(targetDate);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = addMinutes(startTime, settings.slotDuration);

    // 4. Run database transaction to check conflicts and insert booking safely (Double-booking protection)
    const newAppointment = await prisma.$transaction(async (tx) => {
      // Check if slot falls in a blocked range or if there is another booking overlapping
      // We block from (app.startTime - bufferTime) to (app.endTime + bufferTime)
      const conflicts = await tx.appointment.findMany({
        where: {
          adminId,
          status: { in: ["APPROVED", "PENDING"] },
          // Check if target interval overlaps with blocked appointment interval:
          // (startA < endB) && (endA > startB)
          // where target startA = startTime, target endA = endTime
          // and existing appointment startB = app.startTime - bufferTime, endB = app.endTime + bufferTime
          OR: [
            {
              startTime: { lte: startTime },
              endTime: { gt: startTime } // strict conflict
            },
            {
              startTime: { lt: endTime },
              endTime: { gte: endTime } // strict conflict
            }
          ]
        }
      });

      // Filter conflicts manually with buffer time to ensure clean overlap checks
      const hasOverlap = conflicts.some(app => {
        const blockedStart = subMinutes(app.startTime, settings.bufferTime);
        const blockedEnd = addMinutes(app.endTime, settings.bufferTime);
        return startTime < blockedEnd && endTime > blockedStart;
      });

      if (hasOverlap) {
        throw new Error("SLOT_ALREADY_BOOKED");
      }

      // Check if manually blocked date
      const isBlocked = await tx.blockedDate.findFirst({
        where: {
          userId: adminId,
          date: {
            gte: new Date(targetDate.setHours(0, 0, 0, 0)),
            lte: new Date(targetDate.setHours(23, 59, 59, 999))
          }
        }
      });

      if (isBlocked) {
        throw new Error("DATE_BLOCKED");
      }

      // Safe to create
      return await tx.appointment.create({
        data: {
          adminId,
          name,
          email,
          phone,
          notes,
          startTime,
          endTime,
          status: "PENDING" // Starts as pending, admin must approve
        }
      });
    });

    // 5. Send Notification Emails (Resend)
    const formattedDate = startTime.toLocaleDateString("ro-RO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const formattedTime = startTime.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const emailSubject = `Solicitare programare nouă de la ${name} - ${siteConfig.name}`;
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef0f4; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 24px;">Solicitare Programare Nouă</h2>
        <p>Salutare, <strong>${admin.name || "Admin"}</strong>,</p>
        <p>Ai primit o nouă solicitare de programare apel prin platformă.</p>
        <hr style="border: none; border-top: 1px solid #eef0f4; margin: 20px 0;" />
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>Client:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Telefon:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${phone}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Dată apel:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${formattedDate} la ora ${formattedTime}</td>
          </tr>
          ${notes ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong>Notă / Scop:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; white-space: pre-line;">${notes}</td>
          </tr>` : ""}
        </table>
        <hr style="border: none; border-top: 1px solid #eef0f4; margin: 20px 0;" />
        <p>Te rugăm să intri în panoul de administrare pentru a confirma sau modifica această programare.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${env.NEXTAUTH_URL || "http://localhost:3000"}/admin/appointments" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Vezi în Dashboard</a>
        </div>
      </div>
    `;

    // Try sending admin email (bypassing in dev)
    if (env.RESEND_API_KEY && env.RESEND_API_KEY !== "dev-resend-key" && process.env.NODE_ENV === "production") {
      try {
        await resend.emails.send({
          from: env.EMAIL_FROM || "onboarding@resend.dev",
          to: admin.email || "delivered@resend.dev",
          subject: emailSubject,
          html: emailHtml
        });

        // Send confirmation receipt email to user
        await resend.emails.send({
          from: env.EMAIL_FROM || "onboarding@resend.dev",
          to: email,
          subject: `Solicitarea ta de programare este în așteptare - ${siteConfig.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef0f4; border-radius: 8px;">
              <h2 style="color: #4f46e5; margin-bottom: 24px;">Programare în așteptare</h2>
              <p>Salut, <strong>${name}</strong>,</p>
              <p>Am primit solicitarea ta de programare pentru <strong>${formattedDate} la ora ${formattedTime}</strong>.</p>
              <p>Aceasta se află acum în curs de aprobare de către echipa noastră. Îți vom trimite un email de confirmare cu detaliile finale de conectare (link de Google Meet/Zoom) în scurt timp.</p>
              <p>Mulțumim!</p>
            </div>
          `
        });
      } catch (err) {
        console.error("Email send error:", err);
      }
    } else {
      console.log(`[DEV MODE] Bypassed Resend Emails for Booking Appointment. Check console log:`);
      console.log(`Notification to admin: ${admin.email} -> Subject: ${emailSubject}`);
      console.log(`Receipt to user: ${email} -> Solicitarea ta de programare este în așteptare`);
    }

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error: any) {
    if (error.message === "SLOT_ALREADY_BOOKED") {
      return NextResponse.json({ error: "Acest interval orar a fost rezervat între timp. Te rugăm să alegi alt interval." }, { status: 409 });
    }
    if (error.message === "DATE_BLOCKED") {
      return NextResponse.json({ error: "Această dată a fost blocată." }, { status: 409 });
    }
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Eroare internă de server. Reîncearcă mai târziu." }, { status: 500 });
  }
}
