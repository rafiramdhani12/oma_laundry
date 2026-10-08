import db from "../config/db.ts"
import {users} from "../config/schema/users.ts"
import {eq} from "drizzle-orm"

export const getAllUsers = async () => {
    return await db.select().from(users)
}

export const getUserById = async (id : number) => {
    return await db.select().from(users).where(eq(users.id , id))
}

export const createUser = async (name : string , password : string , role : "worker") => {
    return await db.insert(users).values({name , password , role})
}

export const updateUser = async (id : number , name : string , password : string , role : "worker") => {
    return await db.update(users).set({name , password , role}).where(eq(users.id , id))
}

export const deleteUser = async (id : number) => {
    return await db.delete(users).where(eq(users.id , id))
}