import { pgTable, text } from 'drizzle-orm/pg-core';

export const settings = pgTable('Setting', {
  key: text('key').primaryKey().notNull(),
  value: text('value').notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
