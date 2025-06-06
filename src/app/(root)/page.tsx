import BookList from "@/components/book-list";
import BookOverview from "@/components/book-overview";
import { sampleBooks } from "@/constants";
import { Language } from "types";

export default function Home() {
  return (
    <>
      <BookOverview
        {...{
          ...sampleBooks[0],
          language: sampleBooks[0].language as Language,
        }}
      />

      <BookList
        title="Libros Populares"
        books={sampleBooks.map((book) => ({
          ...book,
          language: book.language as Language,
        }))}
        containerClassName="mt-28"
      />
    </>
  );
}
