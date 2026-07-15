import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Te rugăm să introduci o adresă de email validă."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        // Reactivate if they were unsubscribed
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return NextResponse.json(
          { message: "Abonament reactivat cu succes!" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "Ești deja abonat la newsletter-ul nostru!" },
        { status: 200 }
      );
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Te-ai abonat cu succes!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[NEWSLETTER_POST]", error);
    return NextResponse.json(
      { error: "A apărut o eroare la server. Încearcă din nou." },
      { status: 500 }
    );
  }
}
