import { db } from "@/database/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { multiSession, openAPI } from "better-auth/plugins";
import { schema } from "@/database/schema";
import { resend } from "./resend";
import { reactResetPasswordEmail } from "@/components/email/reset-password";

export const auth = betterAuth({
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const res = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    usePlural: true,
  }),
  user: {
    additionalFields: {
      universityId: {
        type: "number",
        required: false,
      },
      universityCard: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  plugins: [openAPI(), multiSession(), nextCookies()],
});

type Session = typeof auth.$Infer.Session;
export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
