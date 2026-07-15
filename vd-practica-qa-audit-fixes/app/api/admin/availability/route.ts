import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { parseISO, startOfDay } from "date-fns";

// GET /api/admin/availability
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN" || !user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 1. Fetch or create default settings
    let settings = await prisma.calendarSettings.findUnique({
      where: { userId: user.id }
    });

    if (!settings) {
      settings = await prisma.calendarSettings.create({
        data: {
          userId: user.id,
          slotDuration: 30,
          bufferTime: 15,
          noticePeriod: 12,
          maxDaysAhead: 60
        }
      });
    }

    // 2. Fetch Availabilities
    const availabilities = await prisma.availability.findMany({
      where: { userId: user.id },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
    });

    // 3. Fetch Blocked Dates
    const blockedDates = await prisma.blockedDate.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" }
    });

    return NextResponse.json({
      settings,
      availabilities,
      blockedDates
    });
  } catch (error) {
    console.error("Error fetching availability settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/admin/availability
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN" || !user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { settings, availabilities, blockedDates } = body;

    // Transactionally update configurations
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Calendar Settings
      let updatedSettings: any = null;
      if (settings) {
        updatedSettings = await tx.calendarSettings.upsert({
          where: { userId: user.id! },
          create: {
            userId: user.id!,
            slotDuration: settings.slotDuration ?? 30,
            bufferTime: settings.bufferTime ?? 15,
            noticePeriod: settings.noticePeriod ?? 12,
            maxDaysAhead: settings.maxDaysAhead ?? 60
          },
          update: {
            slotDuration: settings.slotDuration,
            bufferTime: settings.bufferTime,
            noticePeriod: settings.noticePeriod,
            maxDaysAhead: settings.maxDaysAhead
          }
        });
      }

      // 2. Update weekly working hours (recreate)
      if (availabilities && Array.isArray(availabilities)) {
        // Delete all old
        await tx.availability.deleteMany({
          where: { userId: user.id! }
        });

        // Insert new
        if (availabilities.length > 0) {
          await tx.availability.createMany({
            data: availabilities.map((av: any) => ({
              userId: user.id!,
              dayOfWeek: Number(av.dayOfWeek),
              startTime: av.startTime,
              endTime: av.endTime,
              isActive: av.isActive ?? true
            }))
          });
        }
      }

      // 3. Update Blocked Dates (recreate)
      if (blockedDates && Array.isArray(blockedDates)) {
        // Delete all old
        await tx.blockedDate.deleteMany({
          where: { userId: user.id! }
        });

        // Insert new
        if (blockedDates.length > 0) {
          await tx.blockedDate.createMany({
            data: blockedDates.map((d: any) => ({
              userId: user.id!,
              date: new Date(String(d.date).split('T')[0] + "T00:00:00.000Z"),
              reason: d.reason || null
            }))
          });
        }
      }

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving availability settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
