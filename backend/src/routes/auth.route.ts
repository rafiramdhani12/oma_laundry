import { Router } from "express";
import { loginUser , logoutUser} from "../controllers/auth.controller.ts";

const authRoute = Router();

authRoute.post("/login", loginUser);
authRoute.post("/logout", logoutUser);

export default authRoute;