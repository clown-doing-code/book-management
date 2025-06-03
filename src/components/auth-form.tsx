"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "./file-upload";

type Props<T extends FieldValues> = {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
};

export default function AuthForm<T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) {
  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn
          ? "Bienvenido de nuevo a BookWise"
          : "Crea tu cuenta de biblioteca"}
      </h1>
      <p className="text-sm font-normal text-white">
        {isSignIn
          ? "Accede a la vasta colección de recursos y mantente actualizado"
          : "Por favor, completa todos los campos y sube una identificación universitaria válida para obtener acceso a la biblioteca"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="te capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Sube imagen"
                        folder="ids"
                        variant="dark"
                        onFileChange={field.onChange}
                      />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="placeholder:text-amber-100-100 min-h-14 w-full text-base font-bold text-white placeholder:font-normal"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-md bg-amber-100 px-6 py-2 text-base font-bold text-black hover:bg-amber-400/90"
          >
            {isSignIn ? "Iniciar Sesión" : "Registrarse"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "¿Nuevo en BookWise? " : "¿Ya tienes una cuenta? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-white hover:underline"
        >
          {isSignIn ? "Crear una cuenta" : "Iniciar sesión"}
        </Link>
      </p>
    </div>
  );
}
