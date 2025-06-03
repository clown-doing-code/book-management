"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  return (
    <div>
      <header className="my-10 flex justify-between gap-5">
        <Link href="/">
          <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        </Link>

        <ul className="flex flex-row items-center gap-8">
          <li>
            <Link
              href="/library"
              className={cn(
                "cursor-pointer text-base capitalize",
                pathname === "/library" ? "text-amber-400" : "text-amber-200",
              )}
            >
              Mi Colección
            </Link>
            {/* <Button>Salir</Button> */}
          </li>
        </ul>
      </header>
    </div>
  );
}
