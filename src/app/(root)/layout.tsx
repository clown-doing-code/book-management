import Header from "@/components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <main className="bg-pattern flex min-h-screen flex-1 flex-col bg-background bg-cover bg-top px-5 xs:px-10 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
}
