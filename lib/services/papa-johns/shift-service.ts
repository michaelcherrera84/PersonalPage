import { db } from "@/db";
import { shift, Shift } from "@/db/schema";
import { shiftCreateSchema, shiftUpdateSchema } from "@/lib/validators/papa-johns/shift-validator";
import { eq, isNull } from "drizzle-orm";

/** Validates and inserts a shift record, returning the created shift. */
export async function createShiftService(data: unknown): Promise<Shift> {
    const validated = shiftCreateSchema.parse(data);
    const [newShift] = await db.insert(shift).values(validated).returning();
    return newShift;
}

/** Validates and applies a partial update to an existing shift. */
export async function updateShiftService(data: unknown): Promise<Shift> {
    const validated = shiftUpdateSchema.parse(data);
    const [updated] = await db.update(shift).set(validated).where(eq(shift.id, validated.id)).returning();
    return updated;
}

/** Returns the first shift without an end time, or null when none is active. */
export async function getActiveShiftService() {
    const [activeShift] = await db.select().from(shift).where(isNull(shift.end)).limit(1);
    return activeShift ?? null;
}

/** Returns all recorded shifts. */
export async function getAllShiftsService() {
    return await db.select().from(shift);
}
