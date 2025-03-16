CREATE TABLE "next_auth"."sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" uuid,
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
ALTER TABLE "next_auth"."sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE cascade ON UPDATE no action;