"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, User, MessageSquare, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

interface BookReviewsProps {
  bookId: string;
}

export default function BookReviews({ bookId }: BookReviewsProps) {
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      userName: "María González",
      rating: 5,
      comment:
        "Excelente libro, muy recomendado. La narrativa es cautivadora y los personajes están muy bien desarrollados.",
      date: "2024-01-15",
      likes: 12,
    },
    {
      id: "2",
      userName: "Carlos Rodríguez",
      rating: 4,
      comment:
        "Buen libro, aunque el final me pareció un poco apresurado. En general, una lectura entretenida.",
      date: "2024-01-10",
      likes: 8,
    },
  ]);

  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  const handleSubmitReview = () => {
    if (!newReview.trim() || newRating === 0) {
      toast.error("Por favor completa la reseña y calificación");
      return;
    }

    toast.success("Reseña enviada exitosamente");
    setNewReview("");
    setNewRating(0);
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void,
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-amber-400 text-amber-400" : "text-gray-400"
        } ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <MessageSquare className="h-6 w-6 text-amber-400" />
            Reseñas de Lectores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">4.5</div>
              <div className="mt-1 flex justify-center gap-1">
                {renderStars(4.5)}
              </div>
              <div className="mt-1 text-sm text-gray-400">
                {reviews.length} reseñas
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-8 text-sm text-gray-400">{stars}★</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-amber-400"
                      style={{
                        width: `${stars === 5 ? 60 : stars === 4 ? 40 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-400">
                    {stars === 5 ? "60%" : stars === 4 ? "40%" : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Review */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            Escribe tu Reseña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Calificación
            </label>
            <div className="flex gap-1">
              {renderStars(newRating, true, setNewRating)}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Comentario
            </label>
            <Textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Comparte tu opinión sobre este libro..."
              className="border-gray-600 bg-gray-700 text-white"
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            className="bg-amber-600 text-black hover:bg-amber-700"
          >
            Publicar Reseña
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600">
                    <User className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {review.userName}
                    </div>
                    <div className="text-sm text-gray-400">{review.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                  <Badge
                    variant="secondary"
                    className="bg-amber-200/20 text-amber-200"
                  >
                    {review.rating}/5
                  </Badge>
                </div>
              </div>

              <p className="mb-4 leading-relaxed text-gray-100">
                {review.comment}
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-amber-400"
                >
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {review.likes}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
