CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "books_title_idx" ON "books" USING btree ("title");--> statement-breakpoint
CREATE INDEX "books_author_idx" ON "books" USING btree ("author");--> statement-breakpoint
CREATE INDEX "books_genre_idx" ON "books" USING btree ("genre");--> statement-breakpoint
CREATE INDEX "borrow_records_user_id_idx" ON "borrow_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "borrow_records_book_id_idx" ON "borrow_records" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "borrow_records_status_idx" ON "borrow_records" USING btree ("status");--> statement-breakpoint
CREATE INDEX "borrow_records_user_id_status_idx" ON "borrow_records" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_token_idx" ON "sessions" USING btree ("user_id","token");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");