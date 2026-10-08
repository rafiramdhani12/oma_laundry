import db from "../config/db.ts";
import { services } from "../config/schema/services.ts";
import { eq } from "drizzle-orm";

export const readAllServices = async () => {
    return await db
        .select()
        .from(services);
};

export const readServiceById = async (id: number) => {
    return await db
        .select()
        .from(services)
        .where(eq(services.id, id));
};

export const createService = async (name : string , unit : string , price : number) => {
    return await db.insert(services).values({name , unit , price})
}

export const updateService = async (id : number , name : string , unit : string , price : number) => {
    return await db.update(services).set({name , unit , price}).where(eq(services.id , id))
}

export const deleteService = async (id : number) => {
    return await db.delete(services).where(eq(services.id , id))
}