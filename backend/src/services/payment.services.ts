import db from "../config/db.ts";
import { payments } from "../config/schema/payment.ts";
import { orders } from "../config/schema/orders.ts";
import { eq } from "drizzle-orm";

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
    paymentMethod: "cash" | "transfer"
) => {

    const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

    if (order.length === 0) {
        throw new Error("Order not found");
    }

    if (amount !== order[0].totalPrice) {
        throw new Error("Payment amount does not match order total");
    }

    return await db
        .insert(payments)
        .values({
            orderId,
            amount,
            paymentMethod
        })
        .returning();
};

export const deletePayment = async (id: number) => {
    return await db
        .delete(payments)
        .where(eq(payments.id, id))
        .returning();
};