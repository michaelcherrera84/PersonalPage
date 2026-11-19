import { InferSelectModel } from "drizzle-orm";
import { pgTable, serial, integer, real, text, timestamp, numeric, uuid } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
});

export type User = InferSelectModel<typeof user>;

export const shift = pgTable("papa-johns-shifts", {
    id: serial("id").primaryKey(),

    start: timestamp("start", { withTimezone: true }).notNull(),
    end: timestamp("end", { withTimezone: true }),

    storeHrs: real("store_hrs"),
    roadHrs: real("road_hrs"),
    miles: real("miles"),

    driverInStorePay: numeric("driver_in-store_pay", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),

    onRoadPay: numeric("on-road_pay", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),

    mileage: real("mileage"),

    cashTips: numeric("cash_tips", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),

    ccTips: numeric("cc_tips", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),

    mileageCost: numeric("mileage_cost", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),

    averageRating: numeric("average_rating", {
        precision: 3,
        scale: 2,
        mode: "number",
    }),
});

export type Shift = InferSelectModel<typeof shift>;

export const delivery = pgTable("papa-johns-deliveries", {
    id: serial("id").primaryKey(),

    shiftId: integer("shift_id")
        .notNull()
        .references(() => shift.id, { onDelete: "cascade" }),

    dateTime: timestamp("date_time", { withTimezone: true }).notNull(),

    cashTip: numeric("cash_tip", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),

    ccTip: numeric("cc_tip", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),

    rating: real("rating"),

    address: text("address"),

    cashPayment: numeric("cash_payment", {
        precision: 10,
        scale: 2,
        mode: "number",
    }),
});

export type Delivery = InferSelectModel<typeof delivery>;
