import { addMinutes, format, isAfter, isBefore, startOfDay, subMinutes } from "date-fns";

interface TimeRange {
  startTime: string; // "HH:MM" format
  endTime: string;   // "HH:MM" format
}

interface GenerateSlotsParams {
  date: Date;                  // The date to generate slots for
  availabilities: TimeRange[]; // List of active working hours for this day of the week
  existingAppointments: { startTime: Date; endTime: Date }[];
  slotDuration: number;        // in minutes (e.g. 30)
  bufferTime: number;          // in minutes (e.g. 15)
  noticePeriodHours: number;   // minimum notice hours in advance
}

/**
 * Generates available time slots for a given date.
 * Incorporates duration, buffer time, notice period, and buffers around existing bookings.
 */
export function generateAvailableSlots({
  date,
  availabilities,
  existingAppointments,
  slotDuration,
  bufferTime,
  noticePeriodHours
}: GenerateSlotsParams): string[] {
  const slots: string[] = [];
  const now = new Date();
  
  // Notice period limit: slots must be after (now + noticePeriodHours)
  const minBookingTime = addMinutes(now, noticePeriodHours * 60);

  // For each working hour window on this day
  for (const period of availabilities) {
    const [startHour, startMin] = period.startTime.split(":").map(Number);
    const [endHour, endMin] = period.endTime.split(":").map(Number);

    // Construct slot boundaries on the target date in local/target timezone
    const workStart = new Date(date);
    workStart.setHours(startHour, startMin, 0, 0);

    const workEnd = new Date(date);
    workEnd.setHours(endHour, endMin, 0, 0);

    let currentSlotStart = new Date(workStart);

    // Loop through the work window creating slots
    while (true) {
      const currentSlotEnd = addMinutes(currentSlotStart, slotDuration);

      // If the slot extends beyond the end of the working window, stop
      if (currentSlotEnd > workEnd) {
        break;
      }

      // Check 1: Notice period rule (must be in the future beyond notice duration)
      const isPastNotice = isAfter(currentSlotStart, minBookingTime);

      // Check 2: Overlap check with existing appointments, including buffers
      const hasConflict = existingAppointments.some((app) => {
        // The appointment blocks from (app.startTime - bufferTime) to (app.endTime + bufferTime)
        const blockedStart = subMinutes(app.startTime, bufferTime);
        const blockedEnd = addMinutes(app.endTime, bufferTime);
        
        return currentSlotStart < blockedEnd && currentSlotEnd > blockedStart;
      });

      if (isPastNotice && !hasConflict) {
        slots.push(format(currentSlotStart, "HH:mm"));
      }

      // Move to the start of the next slot (slot duration + buffer time)
      currentSlotStart = addMinutes(currentSlotStart, slotDuration + bufferTime);
    }
  }

  return slots;
}
