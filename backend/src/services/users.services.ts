import db from "../config/db.ts"
import {users} from "../config/schema/users.ts"
import {eq} from "drizzle-orm"
import bcrypt from "bcrypt"

const saltArounds = 10

const hashPassword = (password : string) => {
    return bcrypt.hash(password , saltArounds)
}

export const getAllUsers = async () => {
    return await db.select({id: users.id , name: users.name , role: users.role}).from(users)
}

export const getUserById = async (id : number) => {
    return await db.select({id: users.id , name: users.name , role: users.role}).from(users).where(eq(users.id , id))
}

export const createUser = async (name : string , password : string , role : "worker") => {
    const hashedPassword = await hashPassword(password)
    return await db.insert(users).values({name , password : hashedPassword , role})
}

export const updateUser = async (
    id: number,
    name: string,
    password: string,
    role: "worker"
) => {

    const hashedPassword = await hashPassword(password)

    return await db
        .update(users)
        .set({
            name,
            password: hashedPassword,
            role
        })
        .where(eq(users.id, id))
}

export const deleteUser = async (id : number) => {
    return await db.delete(users).where(eq(users.id , id))
}