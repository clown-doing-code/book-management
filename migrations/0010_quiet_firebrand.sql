ALTER TABLE "books" ALTER COLUMN "language" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "language" SET DEFAULT 'es'::text;--> statement-breakpoint
DROP TYPE "public"."language";--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('es', 'en', 'fr', 'de', 'it', 'pt');--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "language" SET DEFAULT 'es'::"public"."language";--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "language" SET DATA TYPE "public"."language" USING "language"::"public"."language";--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "rating" SET DATA TYPE real;