import { db } from "@/database/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { multiSession, openAPI } from "better-auth/plugins";
import { schema } from "@/database/schema";
import { resend } from "./resend";

export const auth = betterAuth({
  emailVerification: {
    expiresIn: 60 * 60, // 1 hour
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
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutos en segundos
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // Actualizar cada 24 horas
  },
  plugins: [openAPI(), multiSession(), nextCookies()],
});

type Session = typeof auth.$Infer.Session;
export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
