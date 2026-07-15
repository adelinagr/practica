import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminAppointmentsClient } from "@/components/admin/admin-appointments-client";

export const metadata = { title: "Programări – VreauDigitalizare Admin" };

export default async function AdminAppointmentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN" || !user.id) redirect("/login");

  const appointments = await prisma.appointment.findMany({
    where: { adminId: user.id },
    orderBy: { startTime: "asc" }
  });

  const availabilities = await prisma.availability.findMany({
    where: { userId: user.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
  });

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

  const blockedDates = await prisma.blockedDate.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" }
  });

  return (
    <AdminAppointmentsClient
      initialAppointments={appointments}
      initialAvailabilities={availabilities}
      initialSettings={settings}
      initialBlockedDates={blockedDates}
    />
  );
}
