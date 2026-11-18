CREATE TABLE "papa-johns-deliveries" (
	"id" serial PRIMARY KEY,
	"shift_id" integer NOT NULL,
	"date_time" timestamp with time zone NOT NULL,
	"cash_tip" numeric(10,2),
	"cc_tip" numeric(10,2),
	"rating" real,
	"address" text,
	"cash_payment" numeric(10,2)
);
--> statement-breakpoint
CREATE TABLE "papa-johns-shifts" (
	"id" serial PRIMARY KEY,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone,
	"store_hrs" real,
	"road_hrs" real,
	"miles" real,
	"driver_in-store_pay" numeric(10,2),
	"on-road_pay" numeric(10,2),
	"mileage" real,
	"cash_tips" numeric(10,2),
	"cc_tips" numeric(10,2),
	"mileage_cost" numeric(10,2)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "papa-johns-deliveries" ADD CONSTRAINT "papa-johns-deliveries_shift_id_papa-johns-shifts_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "papa-johns-shifts"("id") ON DELETE CASCADE;