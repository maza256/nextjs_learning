CREATE TYPE "public"."status" AS ENUM('approved', 'denied', 'cancelled', 'pending');--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "holidays_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "holidays_email_unique" UNIQUE("email")
);
