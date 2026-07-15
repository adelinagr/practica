import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response("Missing email or password", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    const hashedPassword = hashPassword(password);

    if (existingUser) {
      if (existingUser.status === "PENDING") {
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            status: "ACTIVE",
            name: existingUser.name || email.split("@")[0],
          },
        });
        return NextResponse.json({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role });
      }
      return new Response("User already exists", { status: 400 });
    }

    // Check if this is the first user in the system to grant ADMIN role automatically
    const isFirstUser = (await prisma.user.count()) === 0;
    const role = isFirstUser ? "ADMIN" : "VIEWER";

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role as any,
        name: email.split("@")[0], // default name
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
