import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const appointments = sqliteTable('appointment_requests', {
  id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull(), phone: text('phone').notNull(),
  service: text('service').notNull(), date: text('preferred_date').notNull(), time: text('preferred_time').notNull(),
  notes: text('notes').notNull().default(''), status: text('status').notNull().default('pending'),
  consentVersion: text('consent_version').notNull().default('2026-10-22'), createdAt: text('created_at').notNull(),
}, (t) => [index('appointments_email_created').on(t.email,t.createdAt)]);
