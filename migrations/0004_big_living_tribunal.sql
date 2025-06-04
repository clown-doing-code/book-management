CREATE TYPE "public"."language" AS ENUM('ENGLISH', 'SPANISH');--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "language" "language" DEFAULT 'SPANISH';