import { db } from "@/db";
import { shift, Shift } from "@/db/schema";
import { shiftCreateSchema, shiftUpdateSchema } from "@/lib/validators/papa-johns/shift-validator";
import { eq, isNull } from "drizzle-orm";

/**
 * Creates a new shift in the Papa Johns shift table.
 * @param data the user submitted data
 * @returns the inserted record
 */
export async function createShiftService(data: unknown): Promise<Shift> {
    const validated = shiftCreateSchema.parse(data);
    const [newShift] = await db.insert(shift).values(validated).returning();
    return newShift;
}

export async function updateShiftService(data: unknown): Promise<Shift> {
    const validated = shiftUpdateSchema.parse(data);
    const [updated] = await db.update(shift).set(validated).where(eq(shift.id, validated.id)).returning();
    return updated;
}

export async function getActiveShiftService() {
    const [activeShift] = await db.select().from(shift).where(isNull(shift.end)).limit(1);
    return activeShift ?? null;
}

export async function getAllShiftsService() {
    return await db.select().from(shift);
}
