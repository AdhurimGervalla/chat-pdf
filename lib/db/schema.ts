import { relations } from 'drizzle-orm';
import {boolean, decimal, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user', 'assistant', 'function']);
export enum workspaceRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}
export const workspaceRoleEnum = pgEnum('workspace_role_enum', [workspaceRole.OWNER, workspaceRole.ADMIN, workspaceRole.MEMBER]);

export const chats = pgTable('chats', {
    id: varchar('chat_id', {length: 256}).primaryKey(),
    workspaceId: integer('workspace_id').default(0), // foreign key
    pdfName: text('pdf_name'),
    pdfUrl: text('pdf_url'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('user_id', {length: 255}).notNull(),
    fileKey: text('file_key'),
    bookmarked: boolean('bookmarked').notNull().default(false),
    title: varchar('title', {length: 256}).default(""),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: varchar('id', {length: 256}).primaryKey(),
    chatId: varchar('chat_id', {length: 256}).references(() => chats.id, {onDelete: 'cascade'} ), // foreign key
    content: text('content').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
    originId: varchar('origin_id', {length: 256}),
    pageNumbers: text('pagenumbers'), // json string of page numbers
    relatedChatIds: text('related_chat_ids'), // json string of related chat ids
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
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    identifier: varchar('identifier', {length: 256}).notNull().unique(),
    isPublic: boolean('is_public').notNull().default(false),
    owner: varchar('owner', {length: 256}).notNull(),
});

export type DrizzleWorkspace = typeof workspaces.$inferSelect;

export const users = pgTable('users', {
    userId: varchar('user_id', { length: 255 }).notNull().unique().primaryKey(),
    email: varchar('email', { length: 255 }),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    apiKey: varchar('api_key', { length: 255 }),
});

export const files = pgTable('files', {
    id: serial('id').primaryKey(),
    workspaceId: integer('workspace_id').default(0), // foreign key
    name: varchar('name', {length: 256}).notNull(),
    key: varchar('key', {length: 256}).notNull(),
    url: varchar('url', {length: 256}).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('user_id', {length: 255}).notNull(),
});

export type DrizzleFile = typeof files.$inferSelect;


export const messagesRelations = relations(messages, ({many}) => ({
    files: many(messagesToFiles)
}));

export const filesRelations = relations(files, ({many}) => ({
    messages: many(messagesToFiles)
}));

export const messagesToFiles = pgTable('messages_files', {
    id: serial('id').primaryKey(),
    fileId: integer('file_id').references(() => files.id, { onDelete: 'cascade' }), // foreign key
    messageId: varchar('message_id', {length: 256}).references(() => messages.id, { onDelete: 'cascade' }), // foreign key
    pageNumbers: text('pagenumbers'), // json string of page numbers
});

export const messagesToFilesRelations = relations(messagesToFiles, ({ one }) => ({
    message: one(messages, {
      fields: [messagesToFiles.messageId],
      references: [messages.id],
    }),
    file: one(files, {
      fields: [messagesToFiles.fileId],
      references: [files.id],
    }),
}));

export const workspacesRelations = relations(workspaces, ({many}) => ({
    users: many(workspacesToUsers)
}));

export const usersRelations = relations(users, ({many}) => ({
    workspaces: many(workspacesToUsers)
}));

export const workspacesToUsers = pgTable('workspaces_users', {
    workspaceId: serial('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }), // foreign key
    userId: varchar('user_id', {length: 255}).references(() => users.userId, { onDelete: 'cascade' }), // foreign key
    role: workspaceRoleEnum('role').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow()
}, (t) => ({
    pk: primaryKey(t.workspaceId, t.userId),
  }),
);

export type DrizzleWorkspaceToUser = typeof workspacesToUsers.$inferSelect;

export const workspacesToUsersRelations = relations(workspacesToUsers, ({one}) => ({
    workspace: one(workspaces, {
        fields: [
            workspacesToUsers.workspaceId
        ],
        references: [workspaces.id]
    }),
    user: one(users, {
        fields: [
            workspacesToUsers.userId
        ],
        references: [users.userId]
    })
}));
