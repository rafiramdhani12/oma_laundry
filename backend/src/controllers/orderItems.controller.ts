import { getOrdersItems , getOrderItemById , deleteOrderItem } from "../services/orderItems.services.ts";
import { type Request, type Response } from "express";

export const getAllOrderItems = async (req : Request , res : Response) => {
    const {orderId} = req.params
    const orderItems = await getOrdersItems(Number(orderId))
    res.json(orderItems) // mendapatkan semua orderItems
}

export const getLocalOrderItemById = async (req : Request , res : Response) => {
    const {id} = req.params
    const orderItem = await getOrderItemById(Number(id))
    res.json(orderItem)
}

export const deleteOrderItemById = async (req : Request , res : Response) => {
    const {id} = req.params
    const orderItem = await deleteOrderItem(Number(id))
    res.json(orderItem)
}