// schema/payment.ts
// Aturan: 1 order = 1 payment. Dibuat otomatis saat order dibuat (unpaid),
// lalu diubah jadi paid saat pelanggan membayar.
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

export const paymentStatus = pgEnum("payment_status", ["paid", "unpaid"]);

export const payments = pgTable("payments", {
    id: serial().primaryKey(),

    orderId: integer()
        .notNull()
        .unique() // 1 order = 1 payment
        .references(() => orders.id, {
            onDelete: "cascade"
        }),

    amount: integer()
        .notNull(),

    status: paymentStatus()
        .notNull()
        .default("unpaid"),

    // Belum diketahui saat order dibuat, jadi boleh kosong sampai dibayar
    paymentMethod: paymentMethodEnum(),

    // Kosong sampai dibayar (sebelumnya defaultNow, itu salah untuk yang belum bayar)
    paidAt: timestamp(),
});