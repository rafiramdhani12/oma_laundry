import {serial ,pgTable , varchar , integer} from "drizzle-orm/pg-core"

export const services = pgTable('services' , {
    id : serial().primaryKey(),
    name : varchar({length:25}).notNull(),
    unit : varchar({length : 25}).notNull(),
    price : varchar({length:10}).notNull(),
})