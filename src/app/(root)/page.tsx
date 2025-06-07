import BookList from "@/components/books/book-list";
import BookOverview from "@/components/books/book-overview-hero";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { Book } from "types";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];
  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      <BookList
        title="Libros Populares"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
}
