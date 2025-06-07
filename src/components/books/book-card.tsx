import BookCover from "./book-cover";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Book } from "types";

interface BookCardProps extends Book {
  index?: number;
  hovered?: number | null;
  setHovered?: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function BookCard({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
  index,
  hovered,
  setHovered,
}: BookCardProps) {
  const hasFocusEffect =
    index !== undefined && hovered !== undefined && setHovered !== undefined;

  return (
    <li
      className={cn(
        isLoanedBook && "w-full xs:w-52",
        hasFocusEffect && "transition-all duration-300 ease-out",
        hasFocusEffect &&
          hovered !== null &&
          hovered !== index &&
          "scale-[0.98] opacity-70 blur-sm",
      )}
      onMouseEnter={() => hasFocusEffect && setHovered(index)}
      onMouseLeave={() => hasFocusEffect && setHovered(null)}
    >
      <Link
        href={`/books/${id}`}
        className={cn(
          "block",
          isLoanedBook && "flex w-full flex-col items-center",
        )}
      >
        <div className="relative">
          <BookCover coverColor={coverColor} coverImage={coverUrl} />

          {/* Hover overlay for focus effect */}
          {hasFocusEffect && !isLoanedBook && (
            <div
              className={cn(
                "absolute inset-0 z-20 flex items-end bg-black/40 px-3 py-4 transition-opacity duration-300",
                hovered === index ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="text-white">
                <p className="line-clamp-2 text-base font-semibold xs:text-lg">
                  {title}
                </p>
                <p className="mt-1 text-xs text-gray-200 italic xs:text-sm">
                  {genre}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className={cn("mt-4", !isLoanedBook && "hidden max-w-28 xs:max-w-40")}
        >
          <p
            className={cn(
              "mt-2 line-clamp-1 text-base font-semibold text-white transition-opacity duration-300 xs:text-xl",
              hasFocusEffect &&
                !isLoanedBook &&
                hovered === index &&
                "opacity-0",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "mt-1 line-clamp-1 text-xs text-muted-foreground italic transition-opacity duration-300 xs:text-base",
              hasFocusEffect &&
                !isLoanedBook &&
                hovered === index &&
                "opacity-0",
            )}
          >
            {genre}
          </p>
        </div>

        {isLoanedBook && (
          <div className="mt-2 w-full">
            <div className="flex flex-row items-center gap-1 max-xs:justify-center">
              <Calendar className="h-4 w-4 text-amber-100" />
              <p className="text-sm text-amber-100">11 días para devolver</p>
            </div>

            <Button
              variant="outline"
              className="mt-3 w-full font-bebas-neue text-base"
            >
              Descargar factura
            </Button>
          </div>
        )}
      </Link>
    </li>
  );
}
