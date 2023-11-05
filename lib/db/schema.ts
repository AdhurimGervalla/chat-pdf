import {decimal, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user', 'assistant', 'function']);

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('user_id', {length: 255}).notNull(),
    fileKey: text('file_key').notNull()
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: serial('chat_id').references(() => chats.id), // foreign key
    content: text('content').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
    pageNumbers: text('pagenumbers') // json string of page numbers
})

export type DrizzleMessage = typeof messages.$inferSelect;

export const usersSubscriptions = pgTable('users_subscriptions', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', {length: 256}).notNull().unique(),
    stripeCustomerId: varchar('stripe_customer_id', {length: 256}).notNull().unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', {length: 256}).unique(),
    stripePriceId: varchar('stripe_price_id', {length: 256}),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
});

// drizzle-orm
// drizzle-kit