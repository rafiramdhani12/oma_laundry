import db from "../config/db.ts";
import { orders } from "../config/schema/orders.ts";
import { orderItems } from "../config/schema/orderItems.ts";
import { services } from "../config/schema/services.ts";
import { customers } from "../config/schema/customers.ts";
import { payments } from "../config/schema/payment.ts";
import { and, desc, eq, gte, lt } from "drizzle-orm";

// Kolom yang dipakai buat tabel list (order + nama customer + info bayar)
const orderSummaryColumns = {
    id: orders.id,
    orderNumber: orders.orderNumber,
    status: orders.status,
    totalPrice: orders.totalPrice,
    createdAt: orders.createdAt,
    customerName: customers.name,
    paymentMethod: payments.paymentMethod, // null = belum dibayar
    paidAt: payments.paidAt,
};

export const readAllOrders = async () => {
    return await db
        .select()
        .from(orders);
};

export const readOrderById = async (id: number) => {
    return await db
        .select()
        .from(orders)
        .where(eq(orders.id, id));
};

// Buat halaman list: order + nama customer + status bayar
export const readAllOrdersWithSummary = async () => {
    return await db
        .select(orderSummaryColumns)
        .from(orders)
        .innerJoin(customers, eq(orders.customerId, customers.id))
        .leftJoin(payments, eq(payments.orderId, orders.id))
        .orderBy(desc(orders.createdAt));
};

// Order hari ini (00:00 sampai 24:00 waktu server), bentuk datanya sama dengan list
export const readOrdersToday = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfDay);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    return await db
        .select(orderSummaryColumns)
        .from(orders)
        .innerJoin(customers, eq(orders.customerId, customers.id))
        .leftJoin(payments, eq(payments.orderId, orders.id))
        .where(
            and(
                gte(orders.createdAt, startOfDay),
                lt(orders.createdAt, startOfTomorrow)
            )
        )
        .orderBy(desc(orders.createdAt));
};

// Buat halaman detail + nota: 1 request, semua data sekaligus
export const readOrderDetail = async (id: number) => {
    const [order] = await db
        .select({
            id: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            totalPrice: orders.totalPrice,
            createdAt: orders.createdAt,
            updatedAt: orders.updatedAt,
            customer: {
                id: customers.id,
                name: customers.name,
                phone: customers.phone,
            },
        })
        .from(orders)
        .innerJoin(customers, eq(orders.customerId, customers.id))
        .where(eq(orders.id, id));

    if (!order) return null;

    const [items, [payment]] = await Promise.all([
        db
            .select({
                id: orderItems.id,
                serviceId: orderItems.serviceId,
                serviceName: services.name,
                unit: services.unit,
                quantity: orderItems.quantity,
                unitPrice: orderItems.unitPrice,
                totalPrice: orderItems.totalPrice,
            })
            .from(orderItems)
            .innerJoin(services, eq(orderItems.serviceId, services.id))
            .where(eq(orderItems.orderId, id)),
        db
            .select({
                id: payments.id,
                amount: payments.amount,
                paymentMethod: payments.paymentMethod,
                paidAt: payments.paidAt,
            })
            .from(payments)
            .where(eq(payments.orderId, id)),
    ]);

    return { ...order, items, payment: payment ?? null };
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