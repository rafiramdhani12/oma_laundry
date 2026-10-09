import {type Request , type Response} from "express"
import { readAllPayments , readPaymentById , readPaymentByOrderId , createPayment ,deletePayment } from "../services/payment.services.ts"

export const getAllPayments = async (req : Request , res : Response) => {
    const payments = await readAllPayments()
    res.json(payments)
}

export const getPaymentById = async (req : Request , res : Response) => {
    const {id} = req.params
    const payment = await readPaymentById(Number(id))
    res.json(payment)
}

export const getPaymentByOrderId = async (req : Request , res : Response) => {
    const {id} = req.params
    const payment = await readPaymentByOrderId(Number(id))
    res.json(payment)
}

export const createNewPayment = async (req : Request , res : Response) => {
    const {orderId , amount , paymentMethod} = req.body
    const payment = await createPayment(Number(orderId) , amount , paymentMethod)
    res.json(payment)
}

export const deletePaymentById = async (req : Request , res : Response) => {
    const {id} = req.params
    const payment = await deletePayment(Number(id))
    res.json(payment)
}