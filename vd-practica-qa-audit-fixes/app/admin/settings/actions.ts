"use server";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const generalSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  company: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export async function updateGeneralSettings(data: z.infer<typeof generalSettingsSchema>) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = generalSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid data" };
    }

    await prisma.user.update({
      where: { id: sessionUser.id },
      data: parsed.data,
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/settings/general");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
