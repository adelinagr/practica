import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAvailableSlots } from "@/lib/booking/slot-generator";
import { parseISO, startOfDay, endOfDay, getDay } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date"); // YYYY-MM-DD
    let adminId = searchParams.get("adminId");

    if (!dateStr) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const targetDate = parseISO(dateStr);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // 1. Resolve Admin ID (default to first admin in system if not specified)
    if (!adminId) {
      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      });
      if (!adminUser) {
        return NextResponse.json({ error: "No admin user found in the system" }, { status: 404 });
      }
      adminId = adminUser.id;
    }

    // 2. Fetch Calendar Settings (with fallback defaults)
    const settings = await prisma.calendarSettings.findUnique({
      where: { userId: adminId }
    }) || {
      slotDuration: 30,
      bufferTime: 15,
      noticePeriod: 12,
      maxDaysAhead: 60
    };

    // 3. Check Blocked Dates
    const isBlocked = await prisma.blockedDate.findFirst({
      where: {
        userId: adminId,
        date: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate)
        }
      }
    });

    if (isBlocked) {
      return NextResponse.json({ slots: [] });
    }

    // 4. Fetch Availabilities for target day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = getDay(targetDate);
    const availabilities = await prisma.availability.findMany({
      where: {
        userId: adminId,
        dayOfWeek,
        isActive: true
      }
    });

    // If no availability records exist, define default working hours for Monday-Friday (1-5)
    let formattedAvailabilities = availabilities.map(av => ({
      startTime: av.startTime,
      endTime: av.endTime
    }));

    if (availabilities.length === 0) {
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        formattedAvailabilities = [{ startTime: "09:00", endTime: "17:00" }];
      } else {
        return NextResponse.json({ slots: [] }); // Closed on weekends by default
      }
    }

    // 5. Fetch Existing Appointments for target day
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        adminId,
        status: { in: ["APPROVED", "PENDING"] },
        startTime: {
          gte: startOfDay(targetDate)
        },
        endTime: {
          lte: endOfDay(targetDate)
        }
      },
      select: {
        startTime: true,
        endTime: true
      }
    });

    // 6. Generate Slots
    const slots = generateAvailableSlots({
      date: targetDate,
      availabilities: formattedAvailabilities,
      existingAppointments,
      slotDuration: settings.slotDuration,
      bufferTime: settings.bufferTime,
      noticePeriodHours: settings.noticePeriod
    });

    return NextResponse.json({ slots });
  } catch (error: any) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
