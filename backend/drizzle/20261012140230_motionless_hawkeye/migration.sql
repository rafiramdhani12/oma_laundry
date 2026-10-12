ALTER TABLE "orders" ADD COLUMN "estimateDoneAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "durationHours" integer DEFAULT 56 NOT NULL;