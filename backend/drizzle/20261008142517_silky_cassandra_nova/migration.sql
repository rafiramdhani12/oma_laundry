CREATE TYPE "order_status" AS ENUM('diterima', 'diproses', 'siap', 'diambil');--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_servicesId_services_id_fkey";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "orderNumber" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "servicesId";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "unitPrice";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "customerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "totalPrice" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "order_status" USING "status"::text::"order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'diterima'::"order_status";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_orderNumber_key" UNIQUE("orderNumber");--> statement-breakpoint
DROP TYPE "status";