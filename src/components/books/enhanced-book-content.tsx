"use client";

import BookVideo from "@/components/books/book-video";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Clock, Heart, Share2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Book } from "../../../types";
import BookReviews from "./book-review";
import EnhancedBookOverview from "./enhanced-book-overview";
import ShareDialog from "./share-dialog";
import SimilarBooks from "./similar-books";

interface EnhancedBookContentProps {
  bookDetails: Book;
  similarBooks: Book[];
  userId?: string;
}

export default function EnhancedBookContent({
  bookDetails,
  similarBooks,
  userId,
}: EnhancedBookContentProps) {
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleBorrow = async () => {
    try {
      // Simulate borrow API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("¡Libro prestado exitosamente!");
    } catch (error) {
      toast.error("Error al prestar el libro");
    }
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? "Removido de favoritos" : "Agregado a favoritos",
    );
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              size="sm"
              onClick={handleFavorite}
              className={`${isFavorited ? "text-red-400" : "text-gray-400"} hover:text-red-400`}
            >
              <Heart
                className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
              />
            </Button>

            <Button
              variant="link"
              size="sm"
              onClick={handleShare}
              className="text-gray-400 hover:text-amber-400"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Book Overview Section */}
        <section className="mb-12">
          <EnhancedBookOverview
            {...bookDetails}
            userId={userId || ""}
            onBorrow={handleBorrow}
          />
        </section>

        <Separator className="my-6" />

        {/* Content Tabs */}
        <section className="mb-12">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-amber-600"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Resumen
              </TabsTrigger>
              <TabsTrigger
                value="video"
                className="data-[state=active]:bg-amber-600"
              >
                <Clock className="mr-2 h-4 w-4" />
                Video
              </TabsTrigger>
              <TabsTrigger
                value="similar"
                className="data-[state=active]:bg-amber-600"
              >
                <Users className="mr-2 h-4 w-4" />
                Similares
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="overview" className="space-y-6">
                <Card className="">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl text-white">
                      Resumen del Libro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-lg leading-relaxed text-gray-100">
                      {bookDetails.summary
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="text-justify">
                            {paragraph}
                          </p>
                        ))}
                    </div>

                    {/* Book Stats */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video">
                <Card className="">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl text-white">
                      Video Promocional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BookVideo videoUrl={bookDetails.videoUrl} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <BookReviews bookId={bookDetails.id} />
              </TabsContent>

              <TabsContent value="similar">
                <SimilarBooks
                  books={similarBooks}
                  currentBookId={bookDetails.id}
                />
              </TabsContent>
            </div>
          </Tabs>
        </section>
      </main>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        bookTitle={bookDetails.title}
        bookAuthor={bookDetails.author}
      />
    </div>
  );
}
