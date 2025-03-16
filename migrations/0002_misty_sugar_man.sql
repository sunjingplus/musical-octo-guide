CREATE TABLE "next_auth"."verification_tokens" (
	"identifier" text,
	"token" text PRIMARY KEY NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
