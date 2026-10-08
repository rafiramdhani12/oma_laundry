CREATE TYPE "payment_method" AS ENUM('cash', 'transfer');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY,
	"orderId" integer NOT NULL,
	"serviceId" integer NOT NULL,
	"quantity" numeric(10,2) NOT NULL,
	"unitPrice" integer NOT NULL,
	"totalPrice" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY,
	"orderId" integer NOT NULL UNIQUE,
	"amount" integer NOT NULL,
	"paymentMethod" "payment_method" NOT NULL,
	"paidAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "price" SET DATA TYPE integer USING "price"::integer;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;