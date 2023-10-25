import {pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user']);

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('user_id', {length: 255}).notNull(),
    fileKey: text('file_key').notNull()
})

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: serial('chat_id').references(() => chats.id), // foreign key
    content: text('content').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    role: userSystemEnum('role').notNull()
})

// drizzle-orm
// drizzle-kit