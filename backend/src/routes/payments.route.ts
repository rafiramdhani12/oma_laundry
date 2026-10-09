import { Router } from "express";

import {
    getAllPayments,
    getPaymentById,
    createNewPayment,
    deletePaymentById,
    getPaymentByOrderId,
} from "../controllers/payments.controller.ts";

const paymentsRoute = Router();

paymentsRoute.get("/", getAllPayments);

paymentsRoute.get("/:id", getPaymentById);
paymentsRoute.get("/order/:id", getPaymentByOrderId);

paymentsRoute.post("/", createNewPayment);

paymentsRoute.delete("/:id", deletePaymentById);

export default paymentsRoute;