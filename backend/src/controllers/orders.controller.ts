import {type Request , type Response} from "express"
import {createOrder , deleteOrder , readAllOrders , readAllOrdersWithSummary, readOrderById , readOrdersToday, updateOrderStatus , readOrderDetail} from "../services/orders.services.ts";

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
    const orders = await readOrdersToday()
    res.json(orders)
}

export const deleteOrderById = async (req : Request , res : Response) => {
    const {id} = req.params
    const order = await deleteOrder(Number(id))
    res.json(order)
}

export const updateOrderStatusById = async (req : Request , res : Response) => {
    const {id} = req.params
    const {status} = req.body
    const order = await updateOrderStatus(Number(id) , status)
    res.json(order)
}

export const createNewOrder = async (req : Request , res : Response) => {
    const {customerId , items} = req.body
    const order = await createOrder(Number(customerId) , items)
    res.json(order)
}