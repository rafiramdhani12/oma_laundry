import db from  "../config/db.ts"
import {customers} from "../config/schema/customers.ts"
import {eq} from "drizzle-orm"

export const readAllCustomers = async () => {
    return await db.select().from(customers)
}

export const readById = async (id : number) => {
    return await db.select().from(customers).where(eq(customers.id , id))
}

export const createCustomer = async (name : string , phone : string) => {
    return await db.insert(customers).values({name , phone}).returning()
}

export const updateCustomer = async (id : number , name : string , phone : string) => {
    return await db.update(customers).set({name}).where(eq(customers.id , id))
}

export const deleteCustomer = async (id : number) => {
    return await db.delete(customers).where(eq(customers.id , id))
}