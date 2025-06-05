import { db } from "@/database/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";
import { schema } from "@/database/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
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
  plugins: [nextCookies(), openAPI()], // make sure this is the last plugin in the array
});
