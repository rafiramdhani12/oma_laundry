import type { Request, Response } from "express";
import { login, logout } from "../services/auth.services.ts";

export const loginUser = async (
    req: Request,
    res: Response
) => {

    try {

        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                message: "Name and password are required"
            });
        }

        const result = await login(name, password);

        return res.json(result);

    } catch (error) {

        return res.status(401).json({
            message: "Invalid username or password"
        });

    }
};

export const logoutUser = async (req : Request , res : Response) => {
    const result = await logout()
    res.json(result)
}