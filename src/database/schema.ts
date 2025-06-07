import {
  varchar,
  uuid,
  integer,
  text,
  pgTable,
  date,
  pgEnum,
  timestamp,
  boolean,
  index,
  real,
} from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
export const BORROW_STATUS_ENUM = pgEnum("borrow_status", [
  "BORROWED",
  "RETURNED",
]);
export const LANGUAGE_ENUM = pgEnum("language", [
  "es",
  "en",
  "fr",
  "de",
  "it",
  "pt",
]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
      .$defaultFn(() => false)
      .notNull(),
    image: text("image"),
    credentialId: text("credential_id").notNull().unique(),
    credentialCard: text("credential_card").notNull(),
    status: STATUS_ENUM("status").default("PENDING"),
    role: ROLE_ENUM("role").default("USER"),
    lastActivityDate: date("last_activity_date").defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Índice recomendado por Better Auth para el campo email
    index("users_email_idx").on(table.email),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    // Índices recomendados por Better Auth para userId y token
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_token_idx").on(table.token),
    // Índice compuesto para consultas que usen ambos campos
    index("sessions_user_id_token_idx").on(table.userId, table.token),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    // Índice recomendado por Better Auth para userId
    index("accounts_user_id_idx").on(table.userId),
  ],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
  },
  (table) => [
    // Índice recomendado por Better Auth para identifier
    index("verifications_identifier_idx").on(table.identifier),
  ],
);

export const books = pgTable(
  "books",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    genre: text("genre").notNull(),
    rating: real("rating").notNull(),
    coverUrl: text("cover_url").notNull(),
    coverColor: varchar("cover_color", { length: 7 }).notNull(),
    description: text("description").notNull(),
    totalCopies: integer("total_copies").notNull().default(1),
    availableCopies: integer("available_copies").notNull().default(0),
    videoUrl: text("video_url").notNull(),
    summary: varchar("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    language: LANGUAGE_ENUM("language").default("es"),
  },
  (table) => [
    // Índices adicionales para optimizar búsquedas comunes en tu app
    index("books_title_idx").on(table.title),
    index("books_author_idx").on(table.author),
    index("books_genre_idx").on(table.genre),
  ],
);

export const borrowRecords = pgTable(
  "borrow_records",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    userId: text("user_id") // Cambiar de uuid a text
      .references(() => users.id)
      .notNull(),
    bookId: uuid("book_id")
      .references(() => books.id)
      .notNull(),
    borrowDate: timestamp("borrow_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    dueDate: date("due_date").notNull(),
    returnDate: date("return_date"),
    status: BORROW_STATUS_ENUM("status").default("BORROWED").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    // Índices para optimizar consultas de préstamos
    index("borrow_records_user_id_idx").on(table.userId),
    index("borrow_records_book_id_idx").on(table.bookId),
    index("borrow_records_status_idx").on(table.status),
    // Índice compuesto para consultas que busquen préstamos de un usuario específico
    index("borrow_records_user_id_status_idx").on(table.userId, table.status),
  ],
);

export const schema = {
  users,
  sessions,
  accounts,
  verifications,
  books,
  borrowRecords,
  STATUS_ENUM,
  ROLE_ENUM,
  BORROW_STATUS_ENUM,
  LANGUAGE_ENUM,
};
