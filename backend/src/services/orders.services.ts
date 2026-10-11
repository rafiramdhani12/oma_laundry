import db from "../config/db.ts";
import { orders } from "../config/schema/orders.ts";
import { orderItems } from "../config/schema/orderItems.ts";
import { services } from "../config/schema/services.ts";
import { customers } from "../config/schema/customers.ts";
import { payments } from "../config/schema/payment.ts";
import { and, count, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";

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

// fungsi agregat

export const readRecentOrders = async (limit = 5) => {
    // 1) Ambil N order terbaru DULU (1 baris = 1 order)
    const recent = await db
        .select({
            id: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            totalPrice: orders.totalPrice,
            createdAt: orders.createdAt,
            customerName: customers.name,
        })
        .from(orders)
        .innerJoin(customers, eq(orders.customerId, customers.id))
        .orderBy(desc(orders.createdAt))
        .limit(limit);
 
    if (recent.length === 0) return [];
 
    // 2) Ambil item punya order-order itu saja, lalu kelompokkan per order
    const items = await db
        .select({
            orderId: orderItems.orderId,
            serviceName: services.name,
            unit: services.unit,
            quantity: orderItems.quantity,
        })
        .from(orderItems)
        .innerJoin(services, eq(orderItems.serviceId, services.id))
        .where(inArray(orderItems.orderId, recent.map((o) => o.id)));
 
    return recent.map((order) => ({
        ...order,
        items: items
            .filter((item) => item.orderId === order.id)
            .map(({ orderId, ...rest }) => rest),
    }));
};

export const readOrderStats = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
 
    const startOfTomorrow = new Date(startOfDay);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
 
    const [byStatus, [today]] = await Promise.all([
        db
            .select({ status: orders.status, total: count() })
            .from(orders)
            .groupBy(orders.status),
        db
            .select({
                orders: count(),
                revenue: sql<string>`coalesce(sum(${orders.totalPrice}), 0)`,
            })
            .from(orders)
            .where(
                and(
                    gte(orders.createdAt, startOfDay),
                    lt(orders.createdAt, startOfTomorrow)
                )
            ),
    ]);
 
    // Pastikan semua status ada walau belum ada order di status itu
    const statusCount = { diterima: 0, diproses: 0, siap: 0, diambil: 0 };
    for (const row of byStatus) {
        statusCount[row.status] = row.total;
    }
 
    return {
        todayOrders: today.orders,
        todayRevenue: Number(today.revenue), // sum() dari pg balik sebagai string
        statusCount,
    };
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

const STATUS_FLOW = ["diterima", "diproses", "siap", "diambil"] as const;
type OrderStatus = (typeof STATUS_FLOW)[number];
 
export const updateOrderStatus = async (id: number, status: OrderStatus) => {
    const [current] = await db
        .select({ status: orders.status })
        .from(orders)
        .where(eq(orders.id, id));
 
    if (!current) {
        throw new Error("Order not found");
    }
 
    // Hanya boleh maju tepat satu langkah
    const from = STATUS_FLOW.indexOf(current.status);
    const to = STATUS_FLOW.indexOf(status);
 
    if (to !== from + 1) {
        throw new Error(
            `Status tidak bisa diubah dari "${current.status}" ke "${status}"`
        );
    }
 
    // Update bersyarat: kalau status sudah keburu berubah (double klik / dua kasir),
    // baris tidak cocok dan hasilnya kosong -> ditolak, bukan ditimpa.
    const updated = await db
        .update(orders)
        .set({ status, updatedAt: new Date() })
        .where(and(eq(orders.id, id), eq(orders.status, current.status)))
        .returning();
 
    if (updated.length === 0) {
        throw new Error("Status order sudah berubah, muat ulang halaman");
    }
 
    return updated;
};


export const deleteOrder = async (id: number) => {

    return await db
        .delete(orders)
        .where(eq(orders.id, id))
        .returning();
};