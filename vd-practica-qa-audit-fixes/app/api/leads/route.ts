import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, source, companyName, industry, message } = body;

        if (!name || !email) {
            return new Response("Numele și emailul sunt obligatorii.", { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response("Adresa de email nu este validă.", { status: 400 });
        }

        // Save Lead
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone: phone || null,
                source: source || "general_contact_form",
                companyName: companyName || null,
                industry: industry || null,
                timeline: message ? [{ event: "Mesaj inițial", description: message, date: new Date().toISOString() }] : [],
            },
        });

        return NextResponse.json({
            success: true,
            leadId: lead.id,
        });
    } catch (error) {
        console.error("[LEADS_POST_ERROR]", error);
        return new Response("A apărut o eroare la salvarea lead-ului.", { status: 500 });
    }
}
