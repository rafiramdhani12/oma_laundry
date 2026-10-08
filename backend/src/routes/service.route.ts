import { Router } from "express";
import {getAllServices , getServiceById , addNewService , deleteServiceById , editService} from "../controllers/services.controller.ts";

const serviceRoute = Router();

serviceRoute.get("/", getAllServices);

serviceRoute.get("/:id", getServiceById);

serviceRoute.post("/", addNewService);

serviceRoute.put("/:id", editService);

serviceRoute.delete("/:id", deleteServiceById);

export default serviceRoute;