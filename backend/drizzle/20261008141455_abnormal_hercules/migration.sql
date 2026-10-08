CREATE TYPE "status" AS ENUM('diterima', 'diproses', 'siap');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('admin', 'worker');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY,
	"customerId" integer,
	"servicesId" integer,
	"quantity" integer NOT NULL,
	"unitPrice" integer NOT NULL,
	"totalPrice" integer NOT NULL,
	"status" "status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY,
	"name" varchar(25) NOT NULL,
	"unit" varchar(25) NOT NULL,
	"price" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'worker'::"role" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_users_id_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_servicesId_services_id_fkey" FOREIGN KEY ("servicesId") REFERENCES "services"("id");