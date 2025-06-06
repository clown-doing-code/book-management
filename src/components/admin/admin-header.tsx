import { Session } from "@/lib/auth-types";
import React from "react";

export default function AdminHeader({
  session,
}: Readonly<{ session: Session }>) {
  return (
    <header className="mt-4 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Bienvenido, {session?.user?.name}
        </h2>
        <p className="text-base text-muted-foreground">
          Monitorea todos tus usuarios y libros aqui
        </p>
      </div>
    </header>
  );
}
