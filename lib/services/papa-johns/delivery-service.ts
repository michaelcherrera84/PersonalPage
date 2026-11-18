import { db } from "@/db";
import { delivery, Delivery } from "@/db/schema";
import { deliveryCreateSchema } from "@/lib/validators/papa-johns/delivery-validator";
import { eq } from "drizzle-orm";

export async function createDeliveryService(data: unknown): Promise<Delivery> {
    const validated = deliveryCreateSchema.parse(data);
    const [created] = await db.insert(delivery).values(validated).returning();
    return created
}

export async function getDeliveriesByShiftId(shiftId: number): Promise<Delivery[]> {
    return await db.select().from(delivery).where(eq(delivery.shiftId, shiftId));
}