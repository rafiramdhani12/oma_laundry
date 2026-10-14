import db from "../config/db.ts";
import { payments } from "../config/schema/payment.ts";
import { orders } from "../config/schema/orders.ts";
import { and, eq } from "drizzle-orm";

export const readAllPayments = async () => {
    return await db
        .select()
        .from(payments);
};

export const readPaymentById = async (id: number) => {
    return await db
        .select()
        .from(payments)
        .where(eq(payments.id, id));
};

export const readPaymentByOrderId = async (orderId: number) => {
    return await db
        .select()
        .from(payments)
        .where(eq(payments.orderId, orderId));
};

export const createPayment = async (
orderId: number,
amount: number,
paymentMethod: "cash" | "transfer",
status: "unpaid"
) => {
return await db.transaction(async (tx) => {
const order = await tx
.select()
.from(orders)
.where(eq(orders.id, orderId))
.for("update");


    if (order.length === 0) {
        throw new Error("Order not found");
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Payment amount must be a positive integer");
    }

    const existingPayments = await tx
        .select()
        .from(payments)
        .where(eq(payments.orderId, orderId));

    const paidAmount = existingPayments.reduce(
        (total, payment) => total + payment.amount,
        0
    );

    const remainingAmount = order[0].totalPrice - paidAmount;

    if (remainingAmount <= 0) {
        throw new Error("Order has already been fully paid");
    }

    if (amount > remainingAmount) {
        throw new Error("Payment exceeds remaining balance");
    }

    return await tx
        .insert(payments)
        .values({
            orderId,
            amount,
            paymentMethod,
            status
        })
        .returning();
});

};

 
export const editPaymentStatus = async (
    id: number,
    amount: number,
    paymentMethod: "cash" | "transfer"
) => {
    if (paymentMethod !== "cash" && paymentMethod !== "transfer") {
        throw new Error("Metode pembayaran tidak valid");
    }
 
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Nominal pembayaran harus bilangan bulat positif");
    }
 
    const [row] = await db
        .select({ status: payments.status, totalPrice: orders.totalPrice })
        .from(payments)
        .innerJoin(orders, eq(payments.orderId, orders.id))
        .where(eq(payments.id, id));
 
    // Tiga pesan terpisah supaya jelas masalahnya apa
    if (!row) throw new Error("Pembayaran tidak ditemukan");
    if (row.status === "paid") throw new Error("Pembayaran ini sudah lunas");
    if (amount < row.totalPrice) throw new Error("Nominal kurang dari total tagihan");
 
    // WHERE status = 'unpaid' => dua klik bersamaan tidak bisa membayar dua kali
    const [updated] = await db
        .update(payments)
        .set({ status: "paid", amount, paymentMethod, paidAt: new Date() })
        .where(and(eq(payments.id, id), eq(payments.status, "unpaid")))
        .returning();
 
    if (!updated) throw new Error("Pembayaran ini sudah lunas");
 
    return { ...updated, change: updated.amount - row.totalPrice };
};



export const deletePayment = async (id: number) => {
    return await db
        .delete(payments)
        .where(eq(payments.id, id))
        .returning();
};