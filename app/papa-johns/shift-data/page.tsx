import ShiftDataGrid from "@/components/papa-johns/shift-data-grid";
import { getAllShiftsService } from "@/lib/services/papa-johns/shift-service";
import { Box, Typography } from "@mui/material";
import { Suspense } from "react";

/** Loads all shifts and supplies them to the historical data grid. */
async function ShiftData() {
    const shifts = await getAllShiftsService();

    return <ShiftDataGrid rows={shifts} />;
}

/** Renders the shift-history page and its loading state. */
export default function ShiftDataPage() {
    return (
        <Box className="pb-8">
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
