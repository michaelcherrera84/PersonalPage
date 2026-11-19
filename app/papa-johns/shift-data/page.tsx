import ShiftDataGrid from "@/components/papa-johns/shift-data-grid";
import { getAllShiftsService } from "@/lib/services/papa-johns/shift-service";
import { Box, Typography } from "@mui/material";
import { Suspense } from "react";

async function ShiftData() {
    const shifts = await getAllShiftsService();

    return <ShiftDataGrid rows={shifts} />;
}

export default function ShiftDataPage() {
    return (
        <Box>
            <header className="flex flex-col gap-3 items-center">
                <Typography variant="h2" className="font-light text-2xl">
                    Shift Data
                </Typography>
            </header>

            <Suspense fallback={<p>Loading data...</p>}>
                <ShiftData />
            </Suspense>
        </Box>
    );
}
