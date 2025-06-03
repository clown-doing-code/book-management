import React from "react";
import BookCard from "./book-card";

type Props = {
  title: string;
  books: Book[];
  containerClassName?: string;
};
export default function BookList({ title, books, containerClassName }: Props) {
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-amber-100">
        Libros Populares
      </h2>

      <ul className="mt-8 flex flex-wrap gap-5 max-xs:justify-between xs:gap-10">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </ul>
    </section>
  );
}
