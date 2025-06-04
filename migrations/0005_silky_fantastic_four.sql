ALTER TABLE "books" ALTER COLUMN "language" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "language" SET DEFAULT 'ES'::text;--> statement-breakpoint
DROP TYPE "public"."language";--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('EN', 'ES');--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "language" SET DEFAULT 'ES'::"public"."language";--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "language" SET DATA TYPE "public"."language" USING "language"::"public"."language";