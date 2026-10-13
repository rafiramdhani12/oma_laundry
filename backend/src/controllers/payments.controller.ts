import {type Request , type Response} from "express"
import { readAllPayments , readPaymentById , readPaymentByOrderId , createPayment ,deletePayment, editPaymentStatus } from "../services/payment.services.ts"

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
    const {orderId , amount , paymentMethod , status} = req.body
    const payment = await createPayment(Number(orderId) , amount , paymentMethod , status)
    res.json(payment)
}

export const updatePaymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount, paymentMethod } = req.body;
 
        const payment = await editPaymentStatus(
            Number(id),
            Number(amount),
            paymentMethod
        );
 
        res.json(payment);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Terjadi kesalahan"
        });
    }
};


export const deletePaymentById = async (req : Request , res : Response) => {
    const {id} = req.params
    const payment = await deletePayment(Number(id))
    res.json(payment)
}