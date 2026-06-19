import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";

export const problemProgress = pgTable("problem_progress", {
  slug: text("slug").primaryKey(),
  status: text("status").notNull().default("not_started"), // 'not_started' | 'attempted' | 'solved'
  starred: boolean("starred").notNull().default(false),
  attempts: integer("attempts").notNull().default(0),
  solvedAt: timestamp("solved_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const codeDrafts = pgTable(
  "code_drafts",
  {
    slug: text("slug").notNull(),
    language: text("language").notNull(), // 'python' | 'javascript'
    code: text("code").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.slug, t.language] })],
);

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  language: text("language").notNull(),
  passed: boolean("passed").notNull(),
  passedCases: integer("passed_cases").notNull(),
  totalCases: integer("total_cases").notNull(),
  runtimeMs: integer("runtime_ms"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProblemProgress = typeof problemProgress.$inferSelect;
export type CodeDraft = typeof codeDrafts.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
