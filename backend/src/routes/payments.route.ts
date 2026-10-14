import { Router } from "express";

import {
    getAllPayments,
    getPaymentById,
    createNewPayment,
    deletePaymentById,
    getPaymentByOrderId,
    updatePaymentStatus,
} from "../controllers/payments.controller.ts";

const paymentsRoute = Router();

paymentsRoute.get("/", getAllPayments);

paymentsRoute.get("/:id", getPaymentById);
paymentsRoute.get("/order/:id", getPaymentByOrderId);

paymentsRoute.put("/:id", updatePaymentStatus);

paymentsRoute.delete("/:id", deletePaymentById);

export default paymentsRoute;