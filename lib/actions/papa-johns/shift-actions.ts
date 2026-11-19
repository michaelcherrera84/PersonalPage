"use server";

import { revalidatePath } from "next/cache";
import { createShiftService, getActiveShiftService, updateShiftService } from "@/lib/services/papa-johns/shift-service";
import { Shift } from "@/db/schema";
import { ActionResponse } from "@/lib/types/Response";
import { getDeliveriesByShiftId } from "@/lib/services/papa-johns/delivery-service";
import { verifySession } from "@/lib/auth/session";

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

export async function endShiftAction(data: Shift): Promise<ActionResponse<Shift>> {
    const user = await verifySession();

    if (!user) {
        return {
            success: false,
            message: "You must be logged in to perform this action.",
        };
    }

    data.end = new Date();

    try {
        const deliveries = await getDeliveriesByShiftId(data.id);

        let cashTips = 0;
        let ccTips = 0;
        deliveries.map((delivery) => {
            cashTips += delivery.cashTip || 0;
            ccTips += delivery.ccTip || 0;
        });

        const ratedDeliveries = deliveries.filter((delivery) => delivery.rating !== null);
        const averageRating = ratedDeliveries.length
            ? ratedDeliveries.reduce((total, delivery) => total + delivery.rating!, 0) / ratedDeliveries.length
            : null;

        data.cashTips = cashTips === 0 ? null : cashTips;
        data.ccTips = ccTips === 0 ? null : ccTips;
        data.averageRating = averageRating;

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
            message: `Failed to end shift ${error instanceof Error && ":" + error.message}`,
        };
    }
}
