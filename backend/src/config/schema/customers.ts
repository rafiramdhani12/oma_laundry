import {serial , pgTable , varchar , timestamp} from "drizzle-orm/pg-core"

export const customers = pgTable("customers" , {
    id: serial().primaryKey(),
    name: varchar({length: 50}).notNull(),
    phone: varchar({length: 15}).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow()
})