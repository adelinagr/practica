import { MagicLinkEmail } from "@/emails/magic-link-email";
import { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

import { getUserByEmail } from "./user";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest: EmailConfig["sendVerificationRequest"] =
  async ({ identifier, url, provider }) => {
    const user = await getUserByEmail(identifier);
    if (!user || !user.name) return;

    const userVerified = user?.emailVerified ? true : false;
    const authSubject = userVerified
      ? `Sign-in link for ${siteConfig.name}`
      : "Activate your account";

    try {
      const { data, error } = await resend.emails.send({
        from: provider.from,
        to:
          (process.env.NODE_ENV as string) === "development"
            ? "delivered@resend.dev"
            : identifier,
        subject: authSubject,
        react: MagicLinkEmail({
          firstName: user?.name as string,
          actionUrl: url,
          mailType: userVerified ? "login" : "register",
          siteName: siteConfig.name,
        }),
        // Set this to prevent Gmail from threading emails.
        // More info: https://resend.com/changelog/custom-email-headers
        headers: {
          "X-Entity-Ref-ID": new Date().getTime() + "",
        },
      });

      if (error || !data) {
        throw new Error(error?.message);
      }

      // console.log(data)
    } catch (error) {
      throw new Error("Failed to send verification email.");
    }
  };

export const sendTwoFactorEmail = async (email: string, token: string) => {
  try {
    // If in development with mock API key, just log and bypass to prevent 500 errors
    if (env.RESEND_API_KEY === "dev-resend-key" || !env.RESEND_API_KEY || (process.env.NODE_ENV as string) === "development") {
      console.log(`[DEV MODE] Bypassing Resend. Mock 2FA Email sent to ${email} with token: ${token}`);
      return { id: "mock-id" };
    }

    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM || "onboarding@resend.dev",
      to: (process.env.NODE_ENV as string) === "development" ? "delivered@resend.dev" : email,
      subject: `Codul tău de verificare (2FA) - ${siteConfig.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Autentificare în doi pași</h2>
          <p>Codul tău de verificare este:</p>
          <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4f46e5;">${token}</span>
          </div>
          <p>Acest cod este valabil 5 minute. Nu-l partaja cu nimeni.</p>
        </div>
      `,
    });

    if (error) {
      console.warn("Resend email warning:", error.message);
      // We don't throw in dev to avoid blocking login, but log it
      if ((process.env.NODE_ENV as string) !== "development") {
        throw new Error(error.message);
      }
    }
    return data || { id: "mock-id" };
  } catch (error) {
    console.error("Error sending 2FA email:", error);
    // In dev, we still want to allow login even if email fails
    if ((process.env.NODE_ENV as string) === "development") return { id: "mock-id" };
    throw new Error("Failed to send 2FA email");
  }
};

