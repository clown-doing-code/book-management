import Link from "next/link";
import { Button } from "./ui/button";
import { headers } from "next/headers";
import { LogIn, User } from "lucide-react";
import { Session } from "@/lib/auth-types";

export function SignInButton(props: { session: Session | null }) {
  const session = props.session;

  return (
    <Link
      href={session?.session ? "/my-profile" : "/auth/sign-in"}
      className="flex justify-center"
    >
      <Button className="justify-between max-md:w-full">
        {!session?.session ? (
          <LogIn className="size-4" />
        ) : (
          <User className="size-4" />
        )}
        <span>{session?.session ? "Mi Cuenta" : "Iniciar Sesión"}</span>
      </Button>
    </Link>
  );
}

function checkOptimisticSession(headers: Headers) {
  const guessIsSignIn =
    headers.get("cookie")?.includes("better-auth.session") ||
    headers.get("cookie")?.includes("__Secure-better-auth.session-token");
  return !!guessIsSignIn;
}

export async function SignInFallback() {
  //to avoid flash of unauthenticated state
  const guessIsSignIn = checkOptimisticSession(await headers());
  return (
    <Link
      href={guessIsSignIn ? "/my-profile" : "/auth/sign-in"}
      className="flex justify-center"
    >
      <Button className="justify-between max-md:w-full">
        {!guessIsSignIn ? (
          <LogIn className="size-4" />
        ) : (
          <User className="size-4" />
        )}
        <span>{guessIsSignIn ? "Mi Cuenta" : "Iniciar Sesión"}</span>
      </Button>
    </Link>
  );
}
