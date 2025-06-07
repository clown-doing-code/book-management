import { LANGUAGES } from "@/constants";
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
  title: z
    .string({
      required_error: "El título es requerido",
      invalid_type_error: "El título debe ser un texto",
    })
    .trim()
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),

  description: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser un texto",
    })
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(1000, "La descripción no puede exceder los 1000 caracteres"),

  author: z
    .string({
      required_error: "El autor es requerido",
      invalid_type_error: "El autor debe ser un texto",
    })
    .trim()
    .min(2, "El nombre del autor debe tener al menos 2 caracteres")
    .max(100, "El nombre del autor no puede exceder los 100 caracteres"),

  genre: z
    .string({
      required_error: "El género es requerido",
      invalid_type_error: "El género debe ser un texto",
    })
    .trim()
    .min(2, "El género debe tener al menos 2 caracteres")
    .max(50, "El género no puede exceder los 50 caracteres"),

  rating: z.coerce
    .number({
      required_error: "La calificación es requerida",
      invalid_type_error: "La calificación debe ser un número",
    })
    .min(1, "La calificación debe ser al menos 1 estrella")
    .max(5, "La calificación no puede ser mayor a 5 estrellas")
    .refine((val) => Number.isFinite(val) && val >= 1 && val <= 5, {
      message: "La calificación debe ser un número válido entre 1 y 5",
    }),

  totalCopies: z.coerce
    .number({
      required_error: "El total de copias es requerido",
      invalid_type_error: "El total de copias debe ser un número",
    })
    .int("El total de copias debe ser un número entero")
    .positive("El total de copias debe ser mayor a 0")
    .lte(10000, "El total de copias no puede exceder las 10,000 unidades"),

  coverUrl: z
    .string({
      required_error: "La portada es requerida",
    })
    .nonempty("El campo no puede estar vacía"),

  coverColor: z.string({
    required_error: "El color de la portada es requerido",
    invalid_type_error: "El color de la portada debe ser un texto",
  }),

  videoUrl: z
    .string({
      required_error: "El video es requerido",
    })
    .nonempty("El campo no puede estar vacía"),

  summary: z
    .string({
      required_error: "El resumen es requerido",
      invalid_type_error: "El resumen debe ser un texto",
    })
    .trim()
    .min(10, "El resumen debe tener al menos 10 caracteres")
    .max(500, "El resumen no puede exceder los 500 caracteres"),

  language: z.enum(LANGUAGES, {
    required_error: "El idioma es requerido",
    invalid_type_error: "Debe seleccionar un idioma válido",
  }),
});
