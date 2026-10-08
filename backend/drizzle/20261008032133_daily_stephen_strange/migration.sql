CREATE TYPE "role" AS ENUM('admin', 'worker');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'worker'::"role" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
