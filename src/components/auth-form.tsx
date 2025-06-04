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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = isSignIn ? 1 : 2;

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
    mode: "onChange", // Solo validar cuando se envíe el formulario
  });

  // Definir campos para cada paso
  const step1Fields = ["name", "email", "password"];
  const step2Fields = ["universityCard", "universityId"];

  const getCurrentStepFields = () => {
    if (isSignIn) return Object.keys(defaultValues);
    return currentStep === 1 ? step1Fields : step2Fields;
  };

  const validateCurrentStep = async () => {
    const fieldsToValidate = getCurrentStepFields();
    const result = await form.trigger(fieldsToValidate as Path<T>[]);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit: SubmitHandler<T> = async (data) => {
    // Solo procesar el envío final cuando sea sign-in o en el último paso del sign-up
    const result = await onSubmit(data);
    if (result.success) {
      toast.success("¡Bienvenido a BookWise!", {
        description: isSignIn ? "Inicio de sesión exitoso" : "Registro exitoso",
      });
      router.push("/");
    } else {
      toast.error(`Error al ${isSignIn ? "iniciar sesión" : "registrarse"}`, {
        description:
          result.error ??
          "Ocurrió un error inesperado, por favor intenta de nuevo",
      });
    }
  };

  const getStepTitle = () => {
    if (isSignIn) return "Bienvenido de nuevo a BookWise";
    return currentStep === 1
      ? "Crea tu cuenta de biblioteca"
      : "Completa tu registro";
  };

  const getStepDescription = () => {
    if (isSignIn)
      return "Accede a la vasta colección de recursos y mantente actualizado";
    return currentStep === 1
      ? "Completa la información básica para comenzar"
      : "Sube tu identificación universitaria para verificar tu cuenta";
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold text-white">
                    {getStepTitle()}
                  </h1>
                  <p className="text-sm font-normal text-white">
                    {getStepDescription()}
                  </p>
                </div>

                {/* Progress indicator for multi-step */}
                {!isSignIn && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-8 rounded-full ${
                          currentStep >= 1 ? "bg-amber-200" : "bg-gray-600"
                        }`}
                      />
                      <div
                        className={`h-2 w-8 rounded-full ${
                          currentStep >= 2 ? "bg-amber-200" : "bg-gray-600"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm text-white">
                      Paso {currentStep} de {totalSteps}
                    </span>
                  </div>
                )}

                {/* Form fields */}
                {getCurrentStepFields().map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as Path<T>}
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-2">
                          <FormLabel className="text-white capitalize">
                            {
                              FIELD_NAMES[
                                field.name as keyof typeof FIELD_NAMES
                              ]
                            }
                          </FormLabel>
                          <FormControl>
                            {field.name === "universityCard" ? (
                              <FileUpload
                                type="image"
                                accept="image/*"
                                placeholder="Subir imagen"
                                folder="ids"
                                variant="dark"
                                onFileChange={field.onChange}
                              />
                            ) : (
                              <Input
                                type={
                                  FIELD_TYPES[
                                    field.name as keyof typeof FIELD_TYPES
                                  ]
                                }
                                {...field}
                                className="placeholder:text-muted-100 min-h-14 w-full text-base font-bold text-white placeholder:font-normal"
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                ))}

                {/* Navigation buttons */}
                <div className="flex gap-4">
                  {/* Back button */}
                  {!isSignIn && currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={handleBack}
                      variant="outline"
                      className="inline-flex min-h-14 flex-1 cursor-pointer items-center justify-center rounded-md border-amber-200 px-6 py-2 text-base font-bold text-amber-200 hover:bg-amber-200/10"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                  )}

                  {/* Next/Submit button */}
                  <Button
                    type="button" // Siempre tipo button para manejar manualmente
                    onClick={
                      isSignIn || currentStep === totalSteps
                        ? () => form.handleSubmit(handleFormSubmit)()
                        : handleNext
                    }
                    className={`inline-flex min-h-14 cursor-pointer items-center justify-center rounded-md bg-amber-200 px-6 py-2 text-base font-bold text-black hover:bg-amber-200/80 ${
                      !isSignIn && currentStep > 1 ? "flex-1" : "w-full"
                    }`}
                  >
                    {isSignIn ? (
                      "Iniciar Sesión"
                    ) : currentStep < totalSteps ? (
                      <>
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border" />

                <p className="text-center text-base">
                  {isSignIn
                    ? "¿Nuevo en BookWise? "
                    : "¿Ya tienes una cuenta? "}

                  <Link
                    href={isSignIn ? "/sign-up" : "/sign-in"}
                    className="font-bold text-amber-200 hover:underline"
                  >
                    {isSignIn ? "Crear una cuenta" : "Iniciar sesión"}
                  </Link>
                </p>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/images/auth-illustration.png"
                alt="auth illustration"
                fill
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
              />
            </div>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-amber-200">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a href="#">Términos de servicio</a> y nuestra{" "}
        <a href="#">Política de privacidad</a>.
      </div>
    </div>
  );
}
