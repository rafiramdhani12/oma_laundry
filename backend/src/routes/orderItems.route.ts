import { Router } from "express";

import {
    getAllOrderItems,
    getLocalOrderItemById,
    deleteOrderItemById,
} from "../controllers/orderItems.controller.ts";

const orderItemsRoute = Router();

orderItemsRoute.get("/", getAllOrderItems);

orderItemsRoute.get("/:id", getLocalOrderItemById);

orderItemsRoute.delete("/:id", deleteOrderItemById);

export default orderItemsRoute;