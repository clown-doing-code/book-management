"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { Key, Loader2, Siren } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

// Zod validation schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Por favor, confirma tu contraseña"),
    signOutDevices: z.boolean().default(false).optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      signOutDevices: false,
    },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = form;
  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      const res = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: data.signOutDevices,
      });

      if (res.error) {
        toast.error(
          res.error.message ||
            "¡No se pudo cambiar la contraseña! Asegúrate de que sea correcta",
        );
      } else {
        setOpen(false);
        toast.success("Contraseña actualizada con éxito");
        reset(); // Reset form to default values
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(); // Reset form when dialog closes
    }
  };

  const getPasswordStrength = (password: string) => {
    const checks = [
      { regex: /.{8,}/, label: "Al menos 8 caracteres" },
      { regex: /[A-Z]/, label: "Una letra mayúscula" },
      { regex: /[a-z]/, label: "Una letra minúscula" },
      { regex: /[0-9]/, label: "Un número" },
    ];

    return checks.map((check) => ({
      ...check,
      met: check.regex.test(password),
    }));
  };

  const passwordChecks = getPasswordStrength(newPassword || "");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 sm:w-auto">
          <Key className="h-4 w-4" />
          Cambiar contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[425px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Cambiar contraseña
          </DialogTitle>
          <DialogDescription>
            Actualiza tu contraseña para mantener segura tu cuenta
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña actual</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Ingresa la contraseña actual"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Ingresa la nueva contraseña"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {newPassword && (
                    <Alert>
                      <Siren />
                      <AlertTitle>Requisitos de la contraseña:</AlertTitle>
                      <AlertDescription>
                        <div className="space-y-2">
                          <ul className="space-y-0.5">
                            {passwordChecks.map((check, index) => (
                              <li
                                key={index}
                                className={`flex items-center gap-1 text-xs ${
                                  check.met ? "text-green-600" : "text-gray-500"
                                }`}
                              >
                                <span className="text-xs">
                                  {check.met ? "✓" : "○"}
                                </span>
                                {check.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirma la nueva contraseña"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signOutDevices"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm leading-relaxed font-normal">
                      Cerrar sesión en todos los demás dispositivos después de
                      cambiar la contraseña
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Actualizar contraseña"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
