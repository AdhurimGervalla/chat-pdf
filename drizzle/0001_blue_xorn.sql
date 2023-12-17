ALTER TABLE "workspaces_users" DROP CONSTRAINT "workspaces_users_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces_users" ADD CONSTRAINT "workspaces_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "id";