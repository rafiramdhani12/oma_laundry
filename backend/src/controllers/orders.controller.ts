import {type Request , type Response} from "express"
import {createOrder , deleteOrder , readAllOrders , readOrderById , updateOrderStatus} from "../services/orders.services.ts";

export const getAllOrders = async (req : Request , res : Response) => {
    const orders = await readAllOrders()
    res.json(orders)
}

export const getOrderById = async (req : Request , res : Response) => {
    const {id} = req.params
    const order = await readOrderById(Number(id))
    res.json(order)
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