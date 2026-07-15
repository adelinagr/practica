import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { resend } from "@/lib/email";
import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

// PATCH /api/admin/appointments/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN" || !user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, startTime, endTime, googleMeetLink, zoomLink, aiPreparation, aiSummary } = body;

    // Fetch existing appointment to verify ownership and state
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { admin: true }
    });

    if (!appointment || appointment.adminId !== user.id) {
      return NextResponse.json({ error: "Appointment not found or unauthorized" }, { status: 404 });
    }

    // Prepare update data payload
    const updateData: any = {};

    if (status !== undefined) updateData.status = status;
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (endTime !== undefined) updateData.endTime = new Date(endTime);
    if (googleMeetLink !== undefined) updateData.googleMeetLink = googleMeetLink;
    if (zoomLink !== undefined) updateData.zoomLink = zoomLink;
    if (aiPreparation !== undefined) updateData.aiPreparation = aiPreparation;
    if (aiSummary !== undefined) updateData.aiSummary = aiSummary;

    // Auto-generate mock Meet link on approval if not provided
    if (status === "APPROVED" && !appointment.googleMeetLink && !googleMeetLink) {
      const code = Math.random().toString(36).substring(2, 5) + "-" + 
                   Math.random().toString(36).substring(2, 6) + "-" + 
                   Math.random().toString(36).substring(2, 5);
      updateData.googleMeetLink = `https://meet.google.com/${code}`;
    }

    // Save changes
    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData
    });

    // Send emails on status change
    const isStatusChanged = status !== undefined && status !== appointment.status;
    const isRescheduled = startTime !== undefined && new Date(startTime).getTime() !== appointment.startTime.getTime();

    if ((isStatusChanged || isRescheduled) && env.RESEND_API_KEY && env.RESEND_API_KEY !== "dev-resend-key" && process.env.NODE_ENV === "production") {
      try {
        const formattedDate = (updateData.startTime || appointment.startTime).toLocaleDateString("ro-RO", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const formattedTime = (updateData.startTime || appointment.startTime).toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit"
        });

        let emailSubject = "";
        let emailHtml = "";

        if (status === "APPROVED") {
          const meetUrl = updateData.googleMeetLink || appointment.googleMeetLink || "https://meet.google.com";
          emailSubject = `Programare Confirmată - ${siteConfig.name}`;
          emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef0f4; border-radius: 8px;">
              <h2 style="color: #10b981; margin-bottom: 24px;">Programare Confirmată!</h2>
              <p>Salut, <strong>${appointment.name}</strong>,</p>
              <p>Programarea ta a fost confirmată de către echipa noastră.</p>
              <hr style="border: none; border-top: 1px solid #eef0f4; margin: 20px 0;" />
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>Dată apel:</strong></td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${formattedDate} la ora ${formattedTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Conectare:</strong></td>
                  <td style="padding: 6px 0; color: #0f172a;"><a href="${meetUrl}" style="color: #4f46e5; text-decoration: underline; font-weight: bold;">Google Meet Link</a></td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eef0f4; margin: 20px 0;" />
              <p>Te rugăm să te conectezi la ora stabilită folosind linkul de mai sus. În caz că dorești anularea sau reprogramarea, te rugăm să ne anunți în avans.</p>
              <p>Mulțumim!</p>
            </div>
          `;
        } else if (status === "REJECTED" || status === "CANCELLED") {
          emailSubject = `Actualizare status programare - ${siteConfig.name}`;
          emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef0f4; border-radius: 8px;">
              <h2 style="color: #ef4444; margin-bottom: 24px;">Programare Anulată</h2>
              <p>Salut, <strong>${appointment.name}</strong>,</p>
              <p>Te informăm că programarea ta din data de <strong>${formattedDate} la ora ${formattedTime}</strong> a fost anulată sau respinsă.</p>
              <p>Dacă dorești să programezi alt apel, te rugăm să vizitezi din nou pagina noastră de contact.</p>
              <p>O zi bună!</p>
            </div>
          `;
        } else if (isRescheduled) {
          emailSubject = `Programare Reprogramată - ${siteConfig.name}`;
          emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef0f4; border-radius: 8px;">
              <h2 style="color: #f59e0b; margin-bottom: 24px;">Programare Reprogramată</h2>
              <p>Salut, <strong>${appointment.name}</strong>,</p>
              <p>Echipa noastră a propus o nouă oră de desfășurare pentru apelul tău.</p>
              <hr style="border: none; border-top: 1px solid #eef0f4; margin: 20px 0;" />
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>Noua dată:</strong></td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${formattedDate} la ora ${formattedTime}</td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eef0f4; margin: 20px 0;" />
              <p>Dacă noua oră nu este potrivită pentru tine, te rugăm să ne răspunzi direct la acest email.</p>
              <p>Mulțumim!</p>
            </div>
          `;
        }

        if (emailSubject && emailHtml) {
          await resend.emails.send({
            from: env.EMAIL_FROM || "onboarding@resend.dev",
            to: appointment.email,
            subject: emailSubject,
            html: emailHtml
          });
        }
      } catch (err) {
        console.error("Resend notify error:", err);
      }
    } else if (isStatusChanged || isRescheduled) {
      console.log(`[DEV MODE] Bypassed Resend Notification on update: ID=${id}, status=${status}, isRescheduled=${isRescheduled}`);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
