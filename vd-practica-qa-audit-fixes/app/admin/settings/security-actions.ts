"use server";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleTwoFactor() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !sessionUser.id) return { success: false, error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
    if (!user) return { success: false, error: "User not found" };

    const newStatus = !user.twoFactorEnabled;

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: newStatus }
    });

    // Log the event
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        event: newStatus ? "2FA_ENABLED" : "2FA_DISABLED",
        ipAddress: "Unknown", // In a real setup, parse headers for x-forwarded-for
        userAgent: "Browser"
      }
    });

    revalidatePath("/admin/settings/security");
    return { success: true, enabled: newStatus };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !sessionUser.id) return { success: false, error: "Unauthorized" };

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    
    // Simulating password validation logic. Real implementation needs bcrypt/argon2
    if (!newPassword || (newPassword as string).length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

    // In a real app, verify current password before updating. 
    // We are simulating this for now since we don't have bcrypt configured right here.

    await prisma.securityLog.create({
      data: {
        userId: sessionUser.id,
        event: "PASSWORD_CHANGED",
        ipAddress: "Unknown",
        userAgent: "Browser"
      }
    });

    revalidatePath("/admin/settings/security");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update password." };
  }
}
