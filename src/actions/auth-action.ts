"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { AuthCredentials } from "../../types";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

const ERROR_MESSAGES_ES: Record<string, string> = {
  "User not found": "Usuario no encontrado.",
  "User already exists": "Este correo electrónico ya está en uso.",
  "Missing required field": "Falta un campo obligatorio.",
  "Invalid email or password":
    "El correo electrónico o la contraseña no es válido.",
  "Network error": "Error de red. Intenta nuevamente.",
};

const getTranslatedError = (message: string): string => {
  return ERROR_MESSAGES_ES[message] || "Ocurrió un error inesperado.";
};

type AuthResponse = {
  success: boolean;
  error?: string;
};

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<AuthResponse> => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    redirect("/too-fast");
    // Esta línea nunca se ejecutará, pero TypeScript necesita un return explícito
    return { success: false, error: "Rate limit exceeded" };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      console.log("APIError", error.message, error.status);
      const translated = getTranslatedError(error.message);
      return { success: false, error: translated };
    }
  }

  return { success: false, error: "Unexpected error occurred." };
};

export const signUp = async (
  params: AuthCredentials,
): Promise<AuthResponse> => {
  const { name, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    redirect("/too-fast");
    // Esta línea nunca se ejecutará, pero TypeScript necesita un return explícito
    return { success: false, error: "Rate limit exceeded" };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "Este correo electrónico ya está en uso." };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        universityId,
        universityCard,
      },
      asResponse: true,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        name,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      console.log("APIError", error.message, error.status);
      const translated = getTranslatedError(error.message);
      return { success: false, error: translated };
    }
  }

  return { success: false, error: "Unexpected error occurred." };
};
