import db from "../config/db.ts";
import { users } from "../config/schema/users.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const login = async (
    name: string,
    password: string
) => {

    const result = await db
        .select()
        .from(users)
        .where(eq(users.name, name));

    if (result.length === 0) {
        throw new Error("Invalid username or password");
    }

    const user = result[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        }
    };
};