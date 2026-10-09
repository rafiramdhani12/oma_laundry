import { Router } from "express"; 

import {getAllOrders , getOrderById , createNewOrder , updateOrderStatusById , deleteOrderById, getOrderToday, getAllOrdersWithSummary, getOrdersByDetail  } from "../controllers/orders.controller.ts";

const ordersRoute = Router();

// get
ordersRoute.get("/", getAllOrders);
ordersRoute.get("/today", getOrderToday);
ordersRoute.get("/summary", getAllOrdersWithSummary);
ordersRoute.get("/detail/:id", getOrdersByDetail);
ordersRoute.get("/:id", getOrderById);

// post
ordersRoute.post("/", createNewOrder);

// put
ordersRoute.put("/:id", updateOrderStatusById);

// delete
ordersRoute.delete("/:id", deleteOrderById);

export default ordersRoute;