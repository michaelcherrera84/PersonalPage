"use server";

import { revalidatePath } from "next/cache";
import { createShiftService, getActiveShiftService, updateShiftService } from "@/lib/services/papa-johns/shift-service";
import { Shift } from "@/db/schema";
import { ActionResponse } from "@/lib/types/Response";
import { getDeliveriesByShiftId } from "@/lib/services/papa-johns/delivery-service";
import { verifySession } from "@/lib/auth/session";

/** Reads an optional numeric form field, treating blank or invalid values as null. */
function getOptionalNumber(formData: FormData, key: string): number | null {
    const value = formData.get(key);

    if (typeof value !== "string" || value.trim() === "") {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
}

/** Starts a shift if the user is authenticated and no shift is already active. */
export async function startShiftAction(): Promise<ActionResponse<Shift>> {
    const user = await verifySession();

    if (!user) {
        return {
            success: false,
            message: "You must be logged in to perform this action.",
        };
    }

    const existingShift = await getActiveShiftService();
    if (existingShift) {
        return {
            success: false,
            message: "A shift is already in progress.",
        };
    }

    const shift = { start: new Date() };

    try {
        const newShift = await createShiftService(shift);

        revalidatePath("/papa-johns");

        return {
            success: true,
            data: newShift,
            message: "Shift started successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to start shift ${error instanceof Error && ":" + error.message}`,
        };
    }
}

/** Persists editable shift data after confirming that the user is authenticated. */
export async function updateShiftAction(data: Shift): Promise<ActionResponse<Shift>> {
    const user = await verifySession();

    if (!user) {
        return {
            success: false,
            message: "You must be logged in to perform this action.",
        };
    }

    try {
        const updated = await updateShiftService(data);

        return {
            success: true,
            data: updated,
            message: "Shift updated successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to update shift ${error instanceof Error && ":" + error.message}`,
        };
    }
}

/**
 * Closes a shift, records its hours and mileage, and derives tips, rating, and pay totals.
 * The hourly and mileage rates are the fixed values currently used by this app.
 */
export async function endShiftAction(
    data: Shift,
    formData: FormData
): Promise<ActionResponse<Shift>> {

    const user = await verifySession();

    if (!user) {
        return {
            success: false,
            message: "You must be logged in to perform this action.",
        };
    }

    try {
        const deliveries = await getDeliveriesByShiftId(data.id);

        // Additional shift information
        const storeHrs = getOptionalNumber(formData, "storeHrs");
        const roadHrs = getOptionalNumber(formData, "roadHrs");
        const miles = getOptionalNumber(formData, "miles");

        // Tips
        const cashTipsEntered = deliveries
            .map(delivery => delivery.cashTip)
            .filter((tip): tip is number => tip !== null && tip !== undefined);

        const ccTipsEntered = deliveries
            .map(delivery => delivery.ccTip)
            .filter((tip): tip is number => tip !== null && tip !== undefined);

        const cashTips = cashTipsEntered.length
            ? cashTipsEntered.reduce((sum, tip) => sum + tip, 0)
            : null;

        const ccTips = ccTipsEntered.length
            ? ccTipsEntered.reduce((sum, tip) => sum + tip, 0)
            : null;

        // Average rating
        const ratedDeliveries = deliveries.filter(
            (delivery) => delivery.rating !== null && delivery.rating !== undefined
        );

        const averageRating = ratedDeliveries.length
            ? ratedDeliveries.reduce(
                (total, delivery) => total + delivery.rating!,
                0
            ) / ratedDeliveries.length
            : null;

        // Calculations
        // Todo: replace hardcoded values with a settings table.
        const driverInStorePay = storeHrs === null ? null : storeHrs * 8;
        const onRoadPay = roadHrs === null ? null : roadHrs * 5.50;
        const mileage = miles === null ? null : miles * 0.45;
        const mileageCost = miles === null ? null : miles * 0.76;

        // Update shift
        data.end = new Date();
        data.storeHrs = storeHrs;
        data.roadHrs = roadHrs;
        data.miles = miles;
        data.cashTips = cashTips;
        data.ccTips = ccTips;
        data.averageRating = averageRating;
        data.driverInStorePay = driverInStorePay;
        data.onRoadPay = onRoadPay;
        data.mileage = mileage;
        data.mileageCost = mileageCost;

        const shift = await updateShiftService(data);

        revalidatePath("/papa-johns");

        return {
            success: true,
            data: shift,
            message: "Shift updated successfully.",
        };

    } catch (error) {
        return {
            success: false,
            message: `Failed to end shift${error instanceof Error ? `: ${error.message}` : ""}`,
        };
    }
}
