import {integer, pgTable, varchar, text, boolean, date, pgEnum} from "drizzle-orm/pg-core";


export const usersTable = pgTable("holidays", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: varchar({ length: 255 }).notNull(),
    last_name: varchar({ length: 255 }).notNull(),
    password: text('password').notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    isAdmin: boolean().notNull().default(false),
});

export const statusEnum = pgEnum('status', ['approved', 'denied', 'cancelled', 'pending']);

export const holidaysTable = pgTable("holidays", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull(),
    start_date: date('start_date').notNull(),
    end_date: date('end_date').notNull(),
    days_taken: integer().notNull(),
    status: statusEnum().notNull(),
});