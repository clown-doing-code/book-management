import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/lib/auth";
import { eq, ne } from "drizzle-orm";
import { headers } from "next/headers";
import BookPageSkeleton from "@/components/books/book-page-skeleton";
import EnhancedBookContent from "@/components/books/enhanced-book-content";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const id = (await params).id;

  try {
    const [bookDetails] = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (!bookDetails) {
      return {
        title: "Libro no encontrado",
        description: "El libro que buscas no existe.",
      };
    }

    return {
      title: `${bookDetails.title} - ${bookDetails.author}`,
      description: bookDetails.description,
      openGraph: {
        title: bookDetails.title,
        description: bookDetails.description,
        images: bookDetails.coverUrl ? [bookDetails.coverUrl] : [],
        type: "book",
      },
      twitter: {
        card: "summary_large_image",
        title: bookDetails.title,
        description: bookDetails.description,
        images: bookDetails.coverUrl ? [bookDetails.coverUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Error",
      description: "Error al cargar el libro",
    };
  }
}

export default async function BookPage({ params }: BookPageProps) {
  return (
    <Suspense fallback={<BookPageSkeleton />}>
      <BookPageContent params={params} />
    </Suspense>
  );
}

async function BookPageContent({ params }: BookPageProps) {
  const id = (await params).id;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Get book details and similar books in parallel
    const [bookDetailsResult, similarBooksResult] = await Promise.all([
      db.select().from(books).where(eq(books.id, id)).limit(1),
      db.select().from(books).where(ne(books.id, id)).limit(6),
    ]);

    const [bookDetails] = bookDetailsResult;

    if (!bookDetails) {
      notFound();
    }

    // Filter similar books by genre
    const similarBooks = similarBooksResult
      .filter(
        (book) =>
          book.genre === bookDetails.genre ||
          book.author === bookDetails.author,
      )
      .slice(0, 4);

    return (
      <EnhancedBookContent
        bookDetails={bookDetails}
        similarBooks={similarBooks}
        userId={session?.user?.id}
      />
    );
  } catch (error) {
    console.error("Error loading book page:", error);
    notFound();
  }
}
