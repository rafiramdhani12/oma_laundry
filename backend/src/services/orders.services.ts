import db from "../config/db.ts";
import { orders } from "../config/schema/orders.ts";
import { orderItems } from "../config/schema/orderItems.ts";
import { services } from "../config/schema/services.ts";
import { eq } from "drizzle-orm";

export const getAllOrders = async () => {
    return await db
        .select()
        .from(orders);
};

export const getOrderById = async (id: number) => {
    return await db
        .select()
        .from(orders)
        .where(eq(orders.id, id));
};

export const createOrder = async (
    customerId: number,
    items: {
        serviceId: number;
        quantity: number;
    }[]
) => {

    let totalPrice = 0;

    const orderItemsData = [];

    for (const item of items) {

        const service = await db
            .select()
            .from(services)
            .where(eq(services.id, item.serviceId));

        if (service.length === 0) {
            throw new Error(`Service ${item.serviceId} not found`);
        }

        const unitPrice = service[0].price;
        const itemTotal = unitPrice * item.quantity;

        totalPrice += itemTotal;

        orderItemsData.push({
            serviceId: item.serviceId,
            quantity: item.quantity,
            unitPrice,
            totalPrice: itemTotal
        });
    }

    const orderNumber = `ORD-${Date.now()}`;

    const [order] = await db
        .insert(orders)
        .values({
            orderNumber,
            customerId,
            totalPrice
        })
        .returning();

    await db
        .insert(orderItems)
        .values(
            orderItemsData.map((item) => ({
                orderId: order.id,
                ...item
            }))
        );

    return order;
};

export const updateOrderStatus = async (
    id: number,
    status: "diterima" | "diproses" | "siap" | "diambil"
) => {

    return await db
        .update(orders)
        .set({
            status,
            updatedAt: new Date()
        })
        .where(eq(orders.id, id))
        .returning();
};

export const deleteOrder = async (id: number) => {

    return await db
        .delete(orders)
        .where(eq(orders.id, id))
        .returning();
};