import { getAllCustomers , getCustomerById , addNewCustomer , deleteCustomerById , editCustomerById } from "../controllers/ customers.controller.ts";

import { Router } from "express";

const customerRoute = Router();

customerRoute.get("/", getAllCustomers);

customerRoute.get("/:id", getCustomerById);

customerRoute.post("/", addNewCustomer);

customerRoute.put("/:id", editCustomerById);

customerRoute.delete("/:id", deleteCustomerById);

export default customerRoute;