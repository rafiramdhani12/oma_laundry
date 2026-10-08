import {serial ,pgTable , varchar , integer, pgEnum} from "drizzle-orm/pg-core"
import { users } from "./users.ts"
import { services } from "./services.ts"

export const enumStatus = pgEnum("status" , ["diterima" , "diproses" , "siap"])

export const orders = pgTable("users" , {
    id:serial().primaryKey(),
    customerId : integer().references(() => users.id),
    servicesId : integer().references(() => services.id),
    quantity : integer().notNull(),
    unitPrice: integer().notNull(),
    totalPrice : integer().notNull(),
    status : enumStatus().notNull()
})