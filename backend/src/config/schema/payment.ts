import {
    pgTable,
    serial,
    integer,
    pgEnum,
    timestamp
} from "drizzle-orm/pg-core";

import { orders } from "./orders.ts";

export const paymentMethodEnum = pgEnum("payment_method", [
    "cash",
    "transfer"
]);

export const payments = pgTable("payments", {
    id: serial().primaryKey(),

    orderId: integer()
        .notNull()
        .references(() => orders.id, {
            onDelete: "cascade"
        }),

    amount: integer()
        .notNull(),

    paymentMethod: paymentMethodEnum()
        .notNull(),

    paidAt: timestamp()
        .notNull()
        .defaultNow(),
});