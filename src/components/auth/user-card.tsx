"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Session } from "@/lib/auth-types";
import {
  Laptop,
  Loader2,
  LogOut,
  Smartphone,
  Shield,
  Mail,
  CircleAlert,
  BadgeCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { UAParser } from "ua-parser-js";
import ChangePassword from "./change-password-form";
import EditUserDialog from "./edit-user-dialog";
import { getInitials } from "@/lib/utils";

//TODO: Arreglar diseño

export default function UserCard(props: {
  session: Session | null;
  activeSessions: Session["session"][];
}) {
  const router = useRouter();
  const { data } = useSession();
  const session = data || props.session;
  const [isTerminating, setIsTerminating] = useState<string>();
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  const [emailVerificationPending, setEmailVerificationPending] =
    useState<boolean>(false);
  const [activeSessions, setActiveSessions] = useState(props.activeSessions);
  const removeActiveSession = (id: string) =>
    setActiveSessions(activeSessions.filter((session) => session.id !== id));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Tarjeta de perfil */}
      <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-sm dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader className="pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="mx-auto h-20 w-20 ring-2 ring-gray-100 sm:mx-0 sm:h-16 sm:w-16 dark:ring-gray-800">
                <AvatarImage
                  src={session?.user.image || undefined}
                  alt="Perfil"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white sm:text-lg">
                  {getInitials(session?.user.name || "IN")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-white">
                  {session?.user.name}
                </h2>
                <p className="flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start dark:text-gray-400">
                  <Mail className="h-3 w-3" />
                  {session?.user.email}
                </p>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  {session?.user.emailVerified ? (
                    <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-sm text-green-400 dark:bg-green-700 dark:text-white">
                      <BadgeCheck className="h-3 w-3" />
                      Cuenta verificada
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm text-amber-400 dark:bg-amber-700 dark:text-white">
                      <CircleAlert className="h-3 w-3" />
                      Verificación pendiente
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end">
              <EditUserDialog />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerta de verificación de email */}
      {!session?.user.emailVerified && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <Mail className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Verificación de correo requerida
          </AlertTitle>
          <AlertDescription className="mt-2 text-amber-700 dark:text-amber-300">
            Por favor verifica tu dirección de correo para asegurar tu cuenta.
            Revisa tu bandeja de entrada.
          </AlertDescription>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 w-fit border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
            onClick={async () => {
              await authClient.sendVerificationEmail(
                {
                  email: session?.user.email || "",
                },
                {
                  onRequest(context) {
                    setEmailVerificationPending(true);
                  },
                  onError(context) {
                    toast.error(context.error.message);
                    setEmailVerificationPending(false);
                  },
                  onSuccess() {
                    toast.success("Correo de verificación enviado");
                    setEmailVerificationPending(false);
                  },
                },
              );
            }}
            disabled={emailVerificationPending}
          >
            {emailVerificationPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Reenviar verificación"
            )}
          </Button>
        </Alert>
      )}

      {/* Sesiones activas */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
                <Shield className="h-4 w-4" />
                Sesiones activas
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Administra tus sesiones activas en distintos dispositivos
              </p>
            </div>
            <div className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {activeSessions.filter((session) => session.userAgent).length}{" "}
              activas
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSessions
            .filter((session) => session.userAgent)
            .map((session) => {
              const parser = new UAParser(session.userAgent || "");
              const device = parser.getDevice();
              const os = parser.getOS();
              const browser = parser.getBrowser();
              const isCurrentSession = session.id === props.session?.session.id;

              return (
                <div
                  key={session.id}
                  className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isCurrentSession
                      ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 rounded-full p-2 ${
                        isCurrentSession
                          ? "bg-blue-100 dark:bg-blue-900/40"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      {device.type === "mobile" ? (
                        <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Laptop className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {os.name} • {browser.name}
                      </p>
                      {isCurrentSession && (
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          Sesión actual
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    onClick={async () => {
                      setIsTerminating(session.id);
                      const res = await authClient.revokeSession({
                        token: session.token,
                      });

                      if (res.error) {
                        toast.error(res.error.message);
                      } else {
                        toast.success("Sesión terminada con éxito");
                        removeActiveSession(session.id);
                      }
                      if (session.id === props.session?.session.id)
                        router.refresh();
                      setIsTerminating(undefined);
                    }}
                    disabled={isTerminating === session.id}
                  >
                    {isTerminating === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrentSession ? (
                      "Cerrar sesión"
                    ) : (
                      "Terminar"
                    )}
                  </Button>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card className="shadow-sm">
        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ChangePassword />
          <Button
            variant="outline"
            className="w-full gap-2 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 sm:w-auto dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={async () => {
              setIsSignOut(true);
              await signOut({
                fetchOptions: {
                  onSuccess() {
                    router.push("/auth/sign-in");
                  },
                },
              });
              setIsSignOut(false);
            }}
            disabled={isSignOut}
          >
            {isSignOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
