import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert docx to HTML using mammoth
    const result = await mammoth.convertToHtml({ buffer });
    const html = result.value;

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Docx parsing error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
