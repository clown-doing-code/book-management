import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(3, { message: "El nombre es requerido" }),
    email: z.string().email({ message: "El correo electrónico no es válido" }),
    credentialId: z
      .string()
      .transform((val) => val.replace(/\s/g, ""))
      .refine((val) => /^\d+$/.test(val), {
        message: "La credencial debe contener solo números",
      })
      .refine((val) => val.length >= 8, {
        message: "La credencial debe tener al menos 8 dígitos",
      })
      .refine((val) => val.length <= 15, {
        message: "La credencial no puede exceder 15 dígitos",
      }),
    credentialCard: z
      .string()
      .nonempty({ message: "La credencial es requerida" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(1, { message: "La confirmación de contraseña es requerida" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // Esto hará que el error aparezca en el campo confirmPassword
  });

export const signInSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.coerce.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl: z.string().nonempty(),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i),
  videoUrl: z.string().nonempty(),
  summary: z.string().trim().min(10),
});
