CREATE TABLE "customers" (
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
