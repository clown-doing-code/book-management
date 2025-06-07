"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import BookCover from "./book-cover";
import type { Book } from "../../../types";

interface SimilarBooksProps {
  books: Book[];
  currentBookId: string;
}

export default function SimilarBooks({
  books,
  currentBookId,
}: SimilarBooksProps) {
  const router = useRouter();

  if (books.length === 0) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="p-8 text-center">
          <p className="text-lg text-gray-400">
            No se encontraron libros similares.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Libros Similares</h3>
        <Badge variant="secondary" className="bg-amber-200/20 text-amber-200">
          {books.length} encontrados
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {books.map((book) => (
          <Card
            key={book.id}
            className="group cursor-pointer transition-all duration-300"
            onClick={() => router.push(`/books/${book.id}`)}
          >
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Book Cover */}
                <div className="relative mx-auto h-48 w-32">
                  <BookCover
                    coverColor={book.coverColor}
                    coverImage={book.coverUrl}
                    className="h-full w-full"
                  />

                  {/* Hover overlay */}
                </div>

                {/* Book Info */}
                <div className="space-y-2 text-center">
                  <h4 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-amber-400">
                    {book.title}
                  </h4>

                  <p className="text-xs text-gray-400">por {book.author}</p>

                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-300">
                        {book.rating}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-gray-600 text-xs text-gray-400"
                    >
                      {book.genre}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-400">
                    {book.availableCopies > 0 ? (
                      <span className="text-green-400">Disponible</span>
                    ) : (
                      <span className="text-red-400">No disponible</span>
                    )}
                  </div>
                </div>

                {/* Quick action button */}
                <Button
                  size="sm"
                  className="w-full bg-amber-600 font-medium text-black hover:bg-amber-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/books/${book.id}`);
                  }}
                >
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
