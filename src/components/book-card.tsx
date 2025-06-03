import Image from "next/image";
import React from "react";
import BookCover from "./book-cover";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export default function BookCard({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
}: Book) {
  return (
    <li className={cn(isLoanedBook && "w-full xs:w-52")}>
      <Link
        href={`/books/${id}`}
        className={cn(isLoanedBook && "flex w-full flex-col items-center")}
      >
        <BookCover coverColor={coverColor} coverImage={coverUrl} />

        <div className={cn("mt-4", !isLoanedBook && "max-w-28 xs:max-w-40")}>
          <p className="mt-2 line-clamp-1 text-base font-semibold text-white xs:text-xl">
            {title}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground italic xs:text-base">
            {genre}
          </p>
        </div>

        {isLoanedBook && (
          <div className="mt-2 w-full">
            <div className="flex flex-row items-center gap-1 max-xs:justify-center">
              <Calendar className="h-4 w-4 text-amber-100" />
              <p className="text-sm text-amber-100">11 días para devolver</p>
            </div>

            <Button className="mt-3 w-full bg-muted font-bebas-neue text-base hover:bg-amber-200 hover:text-black">
              Descargar factura
            </Button>
          </div>
        )}
      </Link>
    </li>
  );
}
