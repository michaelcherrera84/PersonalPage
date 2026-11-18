import { getActiveShiftService } from "@/lib/services/papa-johns/shift-service";
import ShiftManager from "@/components/papa-johns/shift-manager";
import { Typography } from "@mui/material";
import { Suspense } from "react";

async function ActiveShift() {
    const activeShift = await getActiveShiftService();

    return <ShiftManager activeShift={activeShift} />;
}

export default async function PapaJohnsPage() {
    return (
        <main className="h-[calc(100vh-72px)]">
            <header className="flex flex-col gap-3 items-center">
                <Typography variant="h3">Papa Johns</Typography>
                <Typography variant="h5" className="pt-4">Delivery Entry</Typography>
            </header>
            <Suspense fallback={<p>Loading shift...</p>}>
                <ActiveShift />
            </Suspense>
        </main>
    );
}
