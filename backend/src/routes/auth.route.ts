import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.ts";

const authRoute = Router();

authRoute.post("/login", loginUser);

export default authRoute;