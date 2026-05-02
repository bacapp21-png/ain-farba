import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notableSpecialtyEnum = pgEnum("notable_specialty", [
  "scholar",
  "jurist",
  "poet",
  "writer",
  "thinker",
]);

export const notablesTable = pgTable("notables", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  specialty: notableSpecialtyEnum("specialty").notNull(),
  era: text("era"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertNotableSchema = createInsertSchema(notablesTable).omit({ id: true, createdAt: true });
export type InsertNotable = z.infer<typeof insertNotableSchema>;
export type Notable = typeof notablesTable.$inferSelect;
