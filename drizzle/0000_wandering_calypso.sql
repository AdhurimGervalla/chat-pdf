DO $$ BEGIN
 CREATE TYPE "user_system_enum" AS ENUM('system', 'user', 'assistant', 'function');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "workspace_role_enum" AS ENUM('owner', 'admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats" (
	"chat_id" varchar(256) PRIMARY KEY NOT NULL,
	"workspace_id" integer DEFAULT 0,
	"pdf_name" text,
	"pdf_url" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"file_key" text,
	"bookmarked" boolean DEFAULT false NOT NULL,
	"title" varchar(256) DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer DEFAULT 0,
	"name" varchar(256) NOT NULL,
	"key" varchar(256) NOT NULL,
	"url" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"chat_id" varchar(256),
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"role" "user_system_enum" NOT NULL,
	"origin_id" varchar(256),
	"pagenumbers" text,
	"related_chat_ids" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_id" integer,
	"message_id" varchar(256),
	"pagenumbers" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"api_key" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"stripe_customer_id" varchar(256) NOT NULL,
	"stripe_subscription_id" varchar(256),
	"stripe_price_id" varchar(256),
	"stripe_current_period_end" timestamp,
	CONSTRAINT "users_subscriptions_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_subscriptions_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "users_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"identifier" varchar(256) NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"owner" varchar(256) NOT NULL,
	CONSTRAINT "workspaces_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces_users" (
	"workspace_id" serial NOT NULL,
	"user_id" varchar(255),
	"role" "workspace_role_enum" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT workspaces_users_workspace_id_user_id PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "chats"("chat_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages_files" ADD CONSTRAINT "messages_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages_files" ADD CONSTRAINT "messages_files_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces_users" ADD CONSTRAINT "workspaces_users_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces_users" ADD CONSTRAINT "workspaces_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
