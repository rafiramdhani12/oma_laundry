import {
    pgTable,
    serial,
    integer,
    pgEnum,
    timestamp,
    varchar
} from "drizzle-orm/pg-core";

import { customers } from "./customers.ts";

export const enumStatus = pgEnum("order_status", [
    "diterima",
    "diproses",
    "siap",
    "diambil"
]);

export const orders = pgTable("orders", {
    id: serial().primaryKey(),

    orderNumber: varchar({ length: 30 })
        .notNull()
        .unique(),

    customerId: integer()
        .notNull()
        .references(() => customers.id),

    status: enumStatus()
        .notNull()
        .default("diterima"),

    totalPrice: integer()
        .notNull()
        .default(0),

    createdAt: timestamp()
        .notNull()
        .defaultNow(),

    updatedAt: timestamp()
        .notNull()
        .defaultNow(),
});