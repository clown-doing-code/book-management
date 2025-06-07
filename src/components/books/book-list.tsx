"use client";

import React, { useState } from "react";
import BookCard from "./book-card";
import { Book } from "types";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  books: Book[];
  containerClassName?: string;
};

export default function BookList({ title, books, containerClassName }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (books.length < 2) return;

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-amber-100">{title}</h2>

      <ul className="mt-8 flex flex-wrap gap-6 max-xs:justify-between xs:gap-8">
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            {...book}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </ul>
    </section>
  );
}
