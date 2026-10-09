import { Router } from "express"; 

import {getAllOrders , getOrderById , createNewOrder , updateOrderStatusById , deleteOrderById  } from "../controllers/orders.controller.ts";

const ordersRoute = Router();

ordersRoute.get("/", getAllOrders);

ordersRoute.get("/:id", getOrderById);

ordersRoute.post("/", createNewOrder);

ordersRoute.put("/:id", updateOrderStatusById);

ordersRoute.delete("/:id", deleteOrderById);

export default ordersRoute;