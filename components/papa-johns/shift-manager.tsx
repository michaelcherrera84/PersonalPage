"use client";

import { shift } from "@/db/schema";
import { Button } from "@mui/material";
import { startShiftAction } from "@/lib/actions/papa-johns/shift-actions";
import { useState } from "react";
import AddDeliveryForm from "@/components/papa-johns/add-delivery-form";
import ShiftTabs from "@/components/papa-johns/shift-tabs";

type ActiveShift = typeof shift.$inferSelect;

type Props = {
    activeShift: ActiveShift | null;
};

/** Shows the shift-start control or the delivery-entry form for the active shift. */
export default function ShiftManager({ activeShift }: Props) {
    const [location, setLocation] = useState<string>("");

    /** Starts a shift and alerts the user if the request fails. */
    const handleStartShift = async () => {
        const response = await startShiftAction();

        if (!response.success) {
            alert(response.message);
        }
    };

    if (!activeShift) {
        return (
            <div className="flex flex-col mt-25 items-center h-full">
                <Button variant="contained" onClick={handleStartShift}>
                    Start Shift
                </Button>
            </div>
        );
    }

    return (
        <div className="py-10 px-4">
            <AddDeliveryForm location={location} setLocation={setLocation} />
            <ShiftTabs />
        </div>
    );
}
