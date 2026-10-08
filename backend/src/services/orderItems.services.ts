import db from "../config/db.ts";
import { orderItems } from "../config/schema/orderItems.ts";
import { eq } from "drizzle-orm";

export const getOrderItems = async (orderId: number) => {
    return await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));
};

export const getOrderItemById = async (id: number) => {
    return await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.id, id));
};

export const deleteOrderItem = async (id: number) => {
    return await db
        .delete(orderItems)
        .where(eq(orderItems.id, id))
        .returning();
};