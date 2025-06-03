import Header from "@/components/header";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background bg-cover bg-top px-5 xs:px-10 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
}
