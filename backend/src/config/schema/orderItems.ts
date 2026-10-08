import {
    pgTable,
    serial,
    integer,
    real,
    timestamp
} from "drizzle-orm/pg-core";

import { orders } from "./orders.ts";
import { services } from "./services.ts";

export const orderItems = pgTable("order_items", {
    id: serial().primaryKey(),

    orderId: integer()
        .notNull()
        .references(() => orders.id, {
            onDelete: "cascade"
        }),

    serviceId: integer()
        .notNull()
        .references(() => services.id),

    quantity: real().notNull(),

    unitPrice: integer()
        .notNull(),

    totalPrice: integer()
        .notNull(),

    createdAt: timestamp()
        .notNull()
        .defaultNow(),
});