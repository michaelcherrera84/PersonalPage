import ShiftDataGrid from "@/components/papa-johns/shift-data-grid";
import { getAllShiftsService } from "@/lib/services/papa-johns/shift-service";
import { Typography } from "@mui/material";
import { Suspense } from "react";

async function ShiftData() {
    const shifts = await getAllShiftsService();

    return <ShiftDataGrid rows={shifts} />;
}

export default function ShiftDataPage() {
    return (
        <main className="p-4">
            <header className="flex flex-col gap-3 items-center mb-8">
                <Typography variant="h3">Papa Johns</Typography>
                <Typography variant="h5">Shift Data</Typography>
            </header>

            <Suspense fallback={<p>Loading data...</p>}>
                <ShiftData />
            </Suspense>
        </main>
    );
}
