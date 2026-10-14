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

export const createService = async (name : string , unit : string , price : number , durationHours : number) => {
    if (!Number.isInteger(durationHours) || durationHours <= 0) {
        throw new Error('durationHours harus diisi dengan bilangan bulat dan positif');
    }

    if(!Number.isFinite(price) || price < 0) {
        throw new Error('price harus diisi dengan bilangan bulat dan positif');
    }
    
    const [service] = await db.insert(services).values({name , unit , price , durationHours}).returning()
    return service

}

export const updateService = async (id : number , name : string , unit : string , price : number , durationHours : number) => {
    if (!Number.isInteger(durationHours) || durationHours <= 0) {
    throw new Error("Durasi harus berupa bilangan bulat lebih dari 0 jam");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Harga harus lebih dari 0");
  }


    const [service] = await db.update(services).set({name , unit , price , durationHours}).where(eq(services.id , id)).returning()
    return service
}

export const deleteService = async (id : number) => {
    return await db.delete(services).where(eq(services.id , id))
}