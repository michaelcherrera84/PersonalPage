import { db } from "@/db";
import { shift, Shift } from "@/db/schema";
import { getDateRange } from "@/lib/utils/date-utils";
import { shiftCreateSchema, shiftUpdateSchema } from "@/lib/validators/papa-johns/shift-validator";
import { eq, isNull } from "drizzle-orm";

type ShiftSummary = {
    hours: number;
    earnings: number;
    shiftCount: number;
};

/** Summarize shifts by hours, earnings, and shift count in a date range */
function summarizeShifts(shifts: Shift[], start: Date, end: Date): ShiftSummary {
    const filtered = shifts.filter((shift) => shift.start >= start && shift.start < end);

    return {
        hours: filtered.reduce((sum, shift) => sum + (shift.storeHrs ?? 0) + (shift.roadHrs ?? 0), 0),
        earnings: filtered.reduce(
            (sum, shift) =>
                sum +
                (shift.driverInStorePay ?? 0) +
                (shift.onRoadPay ?? 0) +
                (shift.cashTips ?? 0) +
                (shift.ccTips ?? 0) +
                (shift.mileage ?? 0) -
                (shift.mileageCost ?? 0),
            0,
        ),
        shiftCount: filtered.length,
    };
}

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

/** Returns shift summaries for the current week and current pay period */
export async function getDashboardSummaryService() {
    const shifts = await getAllShiftsService();
    const now = new Date();

    const week = getDateRange("week", now);
    const payPeriod = getDateRange("payPeriod", now);

    return {
        week: summarizeShifts(shifts, week.start, week.end),
        payPeriod: summarizeShifts(shifts, payPeriod.start, payPeriod.end),
    };
}
