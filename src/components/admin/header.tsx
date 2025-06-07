import { BookMarkedIcon, LogIn, Speech } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchInput } from "../search-input";
import { Suspense } from "react";
import { SignInButton, SignInFallback } from "../auth/sign-in-button";
import Image from "next/image";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              prefetch={false}
              className="flex items-center space-x-2 transition-opacity hover:opacity-90"
            >
              <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
              <span className="bg-gradient-to-r from-amber-50/90 to-amber-100 bg-clip-text text-xl font-bold text-transparent lg:text-2xl">
                Bookwise
              </span>
            </Link>

            <SearchInput />
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {!session?.session ? (
              <Link href="/auth/sign-in" className="flex justify-center">
                <Button>
                  <LogIn className="size-4" />

                  <span>Iniciar sesión</span>
                </Button>
              </Link>
            ) : (
              <>
                <nav className="hidden md:block">
                  <Link
                    prefetch={false}
                    href="/my-books"
                    className={buttonVariants({
                      variant: "outline",
                    })}
                  >
                    <BookMarkedIcon className="h-4 w-4" />
                    <span>Mis Libros</span>
                  </Link>
                </nav>
                <Suspense fallback={<SignInFallback />}>
                  <SignInButton session={JSON.parse(JSON.stringify(session))} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
