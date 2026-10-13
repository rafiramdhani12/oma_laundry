ALTER TABLE "payments" ALTER COLUMN "paymentMethod" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paidAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paidAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_key" UNIQUE("orderId");