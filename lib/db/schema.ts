import { relations } from 'drizzle-orm';
import {boolean, decimal, pgEnum, pgTable, primaryKey, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user', 'assistant', 'function']);
export const workspaceRoleEnum = pgEnum('workspace_role_enum', ['owner', 'admin', 'member']);

export const chats = pgTable('chats', {
    id: varchar('chat_id', {length: 256}).primaryKey(),
    pdfName: text('pdf_name'),
    pdfUrl: text('pdf_url'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('user_id', {length: 255}).notNull(),
    fileKey: text('file_key'),
    bookmarked: boolean('bookmarked').notNull().default(false),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: varchar('chat_id', {length: 256}).references(() => chats.id), // foreign key
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

export const workspaces = pgTable('workspaces', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 256}).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow()
});

export const users = pgTable('users', {
    userId: varchar('user_id', {length: 255}).notNull().unique(),
});

export const workspacesOnUsers = pgTable('workspaces_users', {
    id: serial('id').primaryKey(),
    workspaceId: serial('workspace_id').references(() => workspaces.id), // foreign key
    userId: varchar('user_id', {length: 255}).references(() => users.userId), // foreign key
    role: workspaceRoleEnum('role').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow()
});

export const workspacesRelations = relations(workspaces, ({many}) => ({
    workspaceUsers: many(workspacesOnUsers)
}));

export const usersRelations = relations(users, ({many}) => ({
    workspaces: many(workspacesOnUsers)
}));

export const workspacesOnUsersRelations = relations(workspacesOnUsers, ({one}) => ({
    workspace: one(workspaces, {
        fields: [
            workspacesOnUsers.workspaceId
        ],
        references: [workspaces.id]
    }),
    user: one(users, {
        fields: [
            workspacesOnUsers.userId
        ],
        references: [users.userId]
    })
}));
