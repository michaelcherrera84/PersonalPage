import { getActiveShiftService } from "@/lib/services/papa-johns/shift-service";
import ShiftManager from "@/components/papa-johns/shift-manager";
import { Box, Typography } from "@mui/material";
import { Suspense } from "react";

async function ActiveShift() {
    const activeShift = await getActiveShiftService();

    return <ShiftManager activeShift={activeShift} />;
}

export default async function PapaJohnsPage() {
    return (
        <Box>
            <header className="flex flex-col gap-3 items-center">
                <Typography variant="h2" className="font-light text-2xl">
                    Delivery Entry
                </Typography>
            </header>
            <Suspense fallback={<p>Loading shift...</p>}>
                <ActiveShift />
            </Suspense>
        </Box>
    );
}
