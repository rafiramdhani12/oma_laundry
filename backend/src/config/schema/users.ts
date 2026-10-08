import {timestamp , serial , pgTable , varchar , pgEnum} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("role" , ["admin" , "worker"])

export const users = pgTable("users" , {
    id: serial().primaryKey(),
    name: varchar({length: 50}).notNull(),
    password: varchar({length: 255}).notNull(), // karena passwordnya di enkripsi
    role: roleEnum().notNull().default("worker"),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow()
})