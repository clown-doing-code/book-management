import BookList from "@/components/book-list";
import BookOverview from "@/components/book-overview";
import { sampleBooks } from "@/constants";

export default function Home() {
  return (
    <>
      <BookOverview {...sampleBooks[0]} />

      <BookList
        title="Libros Populares"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
}
