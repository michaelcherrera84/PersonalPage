"use client";

import { shift } from "@/db/schema";
import { Button, Typography } from "@mui/material";
import { endShiftAction, startShiftAction } from "@/lib/actions/papa-johns/shift-actions";
import { useState } from "react";
import AddDeliveryForm from "@/components/papa-johns/add-delivery-form";
import ShiftTabs from "@/components/papa-johns/shift-tabs";

type ActiveShift = typeof shift.$inferSelect;

type Props = {
    activeShift: ActiveShift | null;
};

export default function ShiftManager({ activeShift }: Props) {
    const [location, setLocation] = useState<string>("");

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

    const handleEndShift = async () => {
        const response = await endShiftAction(activeShift);

        if (!response.success) {
            alert(response.message);
        }
    };

    return (
        <div className="py-10 px-4">
            <div className="flex justify-end">
                <Button variant="outlined" onClick={handleEndShift}>
                    End Shift
                </Button>
            </div>

            <AddDeliveryForm location={location} setLocation={setLocation} />
            <ShiftTabs />
        </div>
    );
}
