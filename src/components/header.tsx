import Image from "next/image";
import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import HeaderBrowsing from "./header-browsing";

import UserProfile from "./sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <header className="my-10 flex justify-between gap-5">
        <Link href="/">
          <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        </Link>

        <nav className="flex flex-row items-center gap-8">
          <HeaderBrowsing />
          {session?.user ? (
            <UserProfile user={session.user} />
          ) : (
            <a href="/login">
              <button
                type="submit"
                className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
              >
                Login
              </button>
            </a>
          )}{" "}
        </nav>
      </header>
    </div>
  );
}
