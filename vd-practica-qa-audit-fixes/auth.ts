import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { verifyPassword } from "@/lib/auth-utils";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        tempToken: {},
        code: {},
        trustDevice: {},
      },
      async authorize(credentials) {
        if (credentials?.tempToken && credentials?.code) {
          console.log("2FA verify attempt. tempToken:", credentials.tempToken, "code:", credentials.code);
          const tempTokenRecord = await prisma.verificationToken.findFirst({
            where: {
              identifier: `temp_auth_${credentials.tempToken}`,
              expires: { gt: new Date() },
            },
          });

          if (!tempTokenRecord) {
            console.log("Failed: tempTokenRecord not found or expired for identifier:", `temp_auth_${credentials.tempToken}`);
            return null;
          }

          const userId = tempTokenRecord.token;
          console.log("Found userId:", userId);

          const otpRecord = await prisma.verificationToken.findFirst({
            where: {
              identifier: `2fa_${userId}`,
              token: credentials.code as string,
              expires: { gt: new Date() },
            },
          });

          if (!otpRecord) {
            console.log("Failed: otpRecord not found or expired for identifier:", `2fa_${userId}`, "and code:", credentials.code);
            return null; // Invalid or expired OTP
          }

          console.log("OTP is valid. Cleaning up tokens.");
          // OTP is valid. Clean up tokens.
          await prisma.verificationToken.deleteMany({
            where: {
              OR: [
                { identifier: `temp_auth_${credentials.tempToken}` },
                { identifier: `2fa_${userId}` },
              ]
            }
          });

          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (!user) return null;

          // Handle "Trust this device" logic
          if (credentials.trustDevice === "true") {
            const { cookies } = await import("next/headers");
            const token = crypto.randomUUID() + crypto.randomUUID(); // Simple 64-char token
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            await prisma.trustedDevice.create({
              data: {
                userId: user.id,
                tokenHash: token,
                expiresAt,
              },
            });

            cookies().set("trusted_device_token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: expiresAt,
              path: "/",
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        }

        // Scenario 2: Standard password verification (fallback or direct)
        console.log("Scenario 2 checking. Credentials:", credentials?.email, "Password provided:", !!credentials?.password);
        if (!credentials?.email || !credentials?.password) {
          console.log("Failed: missing email or password");
          return null;
        }

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          console.log("Failed: user not found or no password. User:", !!user);
          return null;
        }

        const isValid = verifyPassword(password, user.password);

        if (!isValid) {
          console.log("Failed: verifyPassword returned false");
          return null;
        }

        console.log("Scenario 2 success! Returning user:", user.email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      console.log("[AUTH CALLBACK] session() called with token:", token, "and session:", session);
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
      }

      console.log("[AUTH CALLBACK] session() returning:", session);
      return session;
    },

    async jwt({ token, user }) {
      console.log("[AUTH CALLBACK] jwt() called with token:", token, "and user:", user);
      
      if (user && user.role) {
        // This only happens on the initial sign in
        token.role = user.role;
      }
      
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) {
        console.log("[AUTH CALLBACK] dbUser not found for sub:", token.sub);
        return token;
      }

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;

      console.log("[AUTH CALLBACK] jwt() returning:", token);
      return token;
    },
  },
});
