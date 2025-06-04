"use server";

import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true, // returns a response object instead of data
    });
    if (!result?.ok) {
      const errorData = await result.json();
      return { success: false, error: errorData.message };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Error al iniciar sesión");
    return { success: false, error: "Error al iniciar sesión" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { name, email, universityId, password, universityCard } = params;

  try {
    // Si signUpEmail devuelve el usuario creado
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        universityId,
        universityCard,
      },
    });

    // // Y si signUpResult contiene el user.id
    // if (signUpResult?.user?.id) {
    //   await db
    //     .update(users)
    //     .set({ universityId, universityCard })
    //     .where(eq(users.id, signUpResult.user.id));
    // }

    return { success: true };
  } catch (error) {
    console.log(error, "Error al registrar");
    return { success: false, error: "Error al registrar" };
  }
};
