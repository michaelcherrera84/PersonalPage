import { db } from "@/db";
import { delivery, Delivery } from "@/db/schema";
import { deliveryCreateSchema, deliveryUpdateSchema } from "@/lib/validators/papa-johns/delivery-validator";
import { eq } from "drizzle-orm";

/** Validates and inserts a delivery record. */
export async function createDeliveryService(data: unknown): Promise<Delivery> {
    const validated = deliveryCreateSchema.parse(data);
    const [created] = await db.insert(delivery).values(validated).returning();
    return created;
}

/** Returns every delivery associated with the given shift ID. */
export async function getDeliveriesByShiftId(shiftId: number): Promise<Delivery[]> {
    return await db.select().from(delivery).where(eq(delivery.shiftId, shiftId));
}

/** Validates and applies a partial update to an existing delivery. */
export async function updateDeliveryService(data: unknown): Promise<Delivery> {
    const validated = deliveryUpdateSchema.parse(data);
    const [updated] = await db.update(delivery).set(validated).where(eq(delivery.id, validated.id)).returning();
    return updated;
}
