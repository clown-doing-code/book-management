import { Star } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import BookCover from "./book-cover";
import { Book } from "../../types";

export default function BookOverview({
  id,
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  videoUrl,
  summary,
  language,
}: Book) {
  return (
    <section className="flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-5xl font-semibold text-white md:text-7xl">
          {title}
        </h1>

        <div className="mt-7 flex flex-row flex-wrap gap-4 text-xl">
          <p>
            Por <span className="font-semibold text-amber-200">{author}</span>
          </p>

          <p>
            Categoría:{" "}
            <span className="font-semibold text-amber-200">{genre}</span>
          </p>

          <div className="flex flex-row items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <p>{rating}</p>
          </div>
        </div>

        <div className="mt-1 flex flex-row flex-wrap gap-4">
          <p className="text-xl text-white">
            Copias disponibles:{" "}
            <span className="ml-2 font-semibold text-amber-200">
              {availableCopies} / {totalCopies}
            </span>
          </p>
          <p className="text-xl text-white">
            Idioma:
            <span className="ml-2 font-semibold text-amber-200">
              {language}
            </span>
          </p>
        </div>
        <p className="mt-2 text-justify text-xl">{description}</p>

        <Button className="mt-4 min-h-14 w-fit cursor-pointer max-md:w-full">
          <Image src="/icons/book.svg" alt="book" width={20} height={20} />
          <p className="font-bebas-neue text-xl text-black">Pedir Prestado</p>
        </Button>
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute top-10 left-16 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
