CREATE TYPE "payment_status" AS ENUM('paid', 'unpaid');--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "status" "payment_status" DEFAULT 'unpaid'::"payment_status" NOT NULL;