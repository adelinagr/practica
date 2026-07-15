import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { sendTwoFactorEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response("Missing email or password", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      return new Response("Invalid credentials", { status: 401 });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return new Response("Invalid credentials", { status: 401 });
    }

    // Check if 2FA is required for this user
    const requires2FA = user.twoFactorEnabled || user.role === "ADMIN";

    if (!requires2FA) {
      return NextResponse.json({ success: true, requires_2fa: false });
    }

    // Check if device is trusted
    const trustedToken = cookies().get("trusted_device_token")?.value;
    if (trustedToken) {
      const trustedDevice = await prisma.trustedDevice.findUnique({
        where: { tokenHash: trustedToken },
      });

      if (
        trustedDevice &&
        trustedDevice.expiresAt > new Date() &&
        trustedDevice.userId === user.id
      ) {
        // Device is trusted — skip 2FA
        return NextResponse.json({ success: true, requires_2fa: false });
      }
    }

    // ── Clean up any stale tokens for this user before creating new ones ──
    await prisma.verificationToken.deleteMany({
      where: {
        OR: [
          { identifier: `2fa_${user.id}` },
          // Delete stale temp_auth tokens for this user (they contain userId as token value)
          { identifier: { startsWith: "temp_auth_" }, token: user.id },
        ],
      },
    });

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP
    await prisma.verificationToken.create({
      data: {
        identifier: `2fa_${user.id}`,
        token: otpCode,
        expires: expiresAt,
      },
    });

    // Store temp auth token (links tempToken → userId)
    const tempAuthToken = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: {
        identifier: `temp_auth_${tempAuthToken}`,
        token: user.id,
        expires: expiresAt,
      },
    });

    // Log OTP in dev (email bypassed in dev mode)
    console.log(`[DEV ONLY] OTP Code for ${user.email}:`, otpCode);
    await sendTwoFactorEmail(user.email!, otpCode);

    return NextResponse.json({
      success: true,
      requires_2fa: true,
      temporary_token: tempAuthToken,
    });
  } catch (error) {
    console.error("Verify password error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
