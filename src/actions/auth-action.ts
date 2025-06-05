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

//TODO: Update status messages

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
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
      headers: await headers(),
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      error: "Ocurrió un error inesperado, por favor intenta de nuevo",
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return {
            success: false,
            error: "El correo electrónico o la contraseña no es válido.",
          };
        case "BAD_REQUEST":
          return {
            success: false,
            error: "Usuario no encontrado",
          };
        default:
          return {
            success: false,
            error: "Ocurrió un error inesperado.",
          };
      }
    }
    return {
      success: false,
      error: "Ocurrió un error inesperado, por favor intenta de nuevo",
    };
  }
};

export const signUp = async (params: AuthCredentials) => {
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
      headers: await headers(),
      body: {
        name,
        email,
        password,
        universityId,
        universityCard,
      },
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        name,
      },
    });

    return {
      success: true,
      error: "Ocurrió un error inesperado, por favor intenta de nuevo",
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { success: false, error: "El usuario ya existe." };
        case "BAD_REQUEST":
          return {
            success: false,
            error: "El correo electrónico o la contraseña no es válido.",
          };
        default:
          return { success: false, error: "Ocurrió un error inesperado." };
      }
    }
    return {
      success: false,
      error: "Ocurrió un error inesperado, por favor intenta de nuevo",
    };
  }
};
