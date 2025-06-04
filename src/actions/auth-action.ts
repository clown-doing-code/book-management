"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

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

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
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
};

export const signUp = async (params: AuthCredentials) => {
  const { name, email, universityId, password, universityCard } = params;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        universityId,
        universityCard,
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
};
