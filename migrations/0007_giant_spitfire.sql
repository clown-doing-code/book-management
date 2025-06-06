ALTER TABLE "users" RENAME COLUMN "university_id" TO "credential_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "university_card" TO "credential_card";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_university_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_credential_id_unique" UNIQUE("credential_id");