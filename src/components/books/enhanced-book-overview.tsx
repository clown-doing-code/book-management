"use client";

import {
  Book,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Book as BookType } from "../../../types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import BookCover from "./book-cover";

interface Props extends BookType {
  userId: string;
  onBorrow?: () => Promise<void>;
  isLoading?: boolean;
}

export default function EnhancedBookOverview({
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
  userId,
  onBorrow,
  isLoading = false,
}: Props) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const availabilityPercentage = (availableCopies / totalCopies) * 100;
  const isAvailable = availableCopies > 0;

  // Generate star rating display
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-5 w-5 text-gray-400" />
            <Star className="clip-path-half absolute inset-0 h-5 w-5 fill-amber-400 text-amber-400" />
          </div>,
        );
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-400" />);
      }
    }
    return stars;
  };

  const truncatedDescription =
    description.length > 200
      ? description.substring(0, 200) + "..."
      : description;

  return (
    <section className="flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
      <div className="flex flex-1 flex-col gap-6">
        {/* Title with gradient effect */}
        <div className="space-y-2">
          <h1 className="bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-5xl leading-tight font-bold text-transparent md:text-7xl">
            {title}
          </h1>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
        </div>

        {/* Author and Genre with enhanced styling */}
        <div className="flex flex-wrap gap-4 text-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-amber-400" />
            <span className="text-gray-300">Por</span>
            <Badge
              variant="secondary"
              className="border-amber-400/30 bg-amber-200/20 text-amber-200"
            >
              {author}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-amber-400" />
            <span className="text-gray-300">Categoría:</span>
            <Badge
              variant="outline"
              className="border-amber-400/50 text-amber-300"
            >
              {genre}
            </Badge>
          </div>
        </div>

        {/* Enhanced rating and language */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">{renderStars()}</div>
            <span className="text-lg font-semibold text-white">
              {rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-amber-400" />
            <span>Idioma:</span>
            <Badge variant="outline">{language}</Badge>
          </div>
        </div>

        {/* Availability with progress bar */}
        <Card className="">
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="font-medium text-white">Disponibilidad</span>
                </div>
                <span
                  className={`font-semibold ${isAvailable ? "text-green-400" : "text-red-400"}`}
                >
                  {availableCopies} / {totalCopies} disponibles
                </span>
              </div>

              <Progress value={availabilityPercentage} className="h-2" />

              <div className="flex justify-between text-sm text-gray-400">
                <span>
                  {isAvailable ? "Disponible ahora" : "No disponible"}
                </span>
                <span>{Math.round(availabilityPercentage)}% en stock</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced description with toggle */}
        <div className="space-y-3">
          <p className="text-justify text-lg leading-relaxed text-gray-100">
            {showFullDescription ? description : truncatedDescription}
          </p>

          {description.length > 200 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? (
                <>
                  <ChevronUp className="mr-1 h-4 w-4" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-4 w-4" />
                  Leer más
                </>
              )}
            </Button>
          )}
        </div>

        {/* Enhanced borrow button */}
        <Button
          className="mt-4 min-h-14 w-fit cursor-pointer text-xl font-bold max-md:w-full"
          disabled={!isAvailable || isLoading}
          onClick={onBorrow}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
              <span>Procesando...</span>
            </div>
          ) : (
            <>
              <Image src="/icons/book.svg" alt="book" width={20} height={20} />
              <span className="font-bebas-neue">
                {isAvailable ? "Pedir Prestado" : "No Disponible"}
              </span>
            </>
          )}
        </Button>

        {!isAvailable && (
          <p className="mt-2 text-sm text-red-400">
            Este libro no está disponible en este momento. Intenta más tarde.
          </p>
        )}
      </div>

      {/* Enhanced book cover section */}
      <div className="relative flex flex-1 justify-center">
        <div
          className="relative transition-transform duration-300 hover:scale-105"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main book cover with enhanced shadow */}
          <div className="relative z-10 drop-shadow-2xl">
            <BookCover
              variant="wide"
              className="transition-all duration-300"
              coverColor={coverColor}
              coverImage={coverUrl}
            />

            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-amber-400/20 to-transparent blur-xl" />
          </div>

          <div className="absolute top-16 left-8 rotate-6 opacity-20 transition-all duration-300 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>

          {/* Floating rating badge */}
          <div className="absolute -top-4 -right-4 z-20">
            <div className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-black shadow-lg">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-bold">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
