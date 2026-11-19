import ShiftDeliveriesDataGrid from "@/components/papa-johns/shift-deliveries-data-grid";
import { getDeliveriesByShiftId } from "@/lib/services/papa-johns/delivery-service";
import { getActiveShiftService } from "@/lib/services/papa-johns/shift-service";
import { Box, Typography } from "@mui/material";
import { Suspense } from "react";

async function DeliveriesData() {
    const activeShift = await getActiveShiftService();
    const deliveries = await getDeliveriesByShiftId(activeShift.id);

    return <ShiftDeliveriesDataGrid rows={deliveries} />
}

export default function EditShiftDeliveriesPage() {
    return (
        <Box className="pb-8">
            <header className="flex flex-col gap-3 items-center">
                <Typography variant="h2" className="font-light text-2xl">
                    Shift Deliveries
                </Typography>
            </header>

            <Suspense fallback={<p>Loading data...</p>}>
                <DeliveriesData />
            </Suspense>
        </Box>
    )
}
