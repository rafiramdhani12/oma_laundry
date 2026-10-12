import {type Request , type Response} from "express"
import {createOrder , deleteOrder , readAllOrders , readAllOrdersWithSummary, readOrderById , readOrdersToday, updateOrderStatus , readOrderDetail, readRecentOrders, readOrderStats} from "../services/orders.services.ts";

export const getAllOrders = async (req : Request , res : Response) => {
    const orders = await readAllOrders()
    res.json(orders)
}

export const getOrderById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid order ID",
        });
    }

    const order = await readOrderById(id);

    return res.json(order);
};

export const getAllOrdersWithSummary = async (req : Request , res : Response) => {
    const orders = await readAllOrdersWithSummary()
    res.json(orders)
}

export const getOrdersByDetail = async (req : Request , res : Response) => {
    const {id} = req.params
    const orders = await readOrderDetail(Number(id))
    res.json(orders)
}

export const getOrderToday = async (req : Request , res : Response) => {
    const orders = await readOrdersToday()
    res.json(orders)
}

export const getRecentOrders = async (req : Request , res : Response) => {
    const orders = await readRecentOrders()
    res.json(orders)
}

export const getOrderStats = async (req : Request , res : Response) => {
    const orders = await readOrderStats()
    res.json(orders)
}

export const deleteOrderById = async (req : Request , res : Response) => {
    const {id} = req.params
    const order = await deleteOrder(Number(id))
    res.json(order)
}

const STATUS_FLOW = [
  "diterima",
  "diproses",
  "siap",
  "diambil",
] as const;

type OrderStatus = (typeof STATUS_FLOW)[number];

export const updateOrderStatusById = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);
  const status: unknown = req.body.status;

  if (
    typeof status !== "string" ||
    !STATUS_FLOW.some((validStatus) => validStatus === status)
  ) {
    res.status(400).json({ message: "Status tidak valid" });
    return;
  }

  try {
    const order = await updateOrderStatus(id, status as OrderStatus);
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status order",
    });
  }
};
export const createNewOrder = async (req : Request , res : Response) => {
    const {customerId , estimateDays ,items} = req.body
    const order = await createOrder(Number(customerId) , Number(estimateDays) , items)
    res.json(order)
}