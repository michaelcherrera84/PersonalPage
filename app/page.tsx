import DashboardCard from "@/components/papa-johns/dashboard-card";
import { Delivery, Shift } from "@/db/schema";
import { getDeliveriesByShiftId } from "@/lib/services/papa-johns/delivery-service";
import { getActiveShiftService, getDashboardSummaryService } from "@/lib/services/papa-johns/shift-service";
import { currencyFormatter } from "@/lib/utils/currency-utils";
import { Box, CardContent, Typography } from "@mui/material";
import { Suspense } from "react";

/** Renders the dashboard cards for the Papa Johns delivery tools. */
async function DashboardCards() {
    const [summary, currentShift] = await Promise.all([getDashboardSummaryService(), getActiveShiftService()]);

    const deliveries = currentShift ? await getDeliveriesByShiftId(currentShift.id) : [];

    /** Calculates the current shift's hours and tips. */
    function calculateCurrentShiftData(currentShift: Shift | null, deliveries: Delivery[]) {
        if (!currentShift) {
            return {
                hours: "0.0",
                tips: currencyFormatter.format(0),
            };
        }

        return {
            hours: ((new Date().getTime() - currentShift.start.getTime()) / (1000 * 60 * 60)).toFixed(1),
            tips: currencyFormatter.format(
                deliveries.reduce((sum, delivery) => sum + (delivery.ccTip ?? 0) + (delivery.cashTip ?? 0), 0),
            ),
        };
    }

    const currentShiftData = calculateCurrentShiftData(currentShift, deliveries);

    return (
        <div className="flex gap-4 flex-wrap justify-center">
            {currentShift ? (
                <DashboardCard title="Current Shift" isLink={true} href="/papa-johns">
                    <div className="flex flex-col h-full justify-around">
                        <div className="flex justify-between">
                            <Typography className="font-light">Hours</Typography>
                            <Typography className="font-bold">{currentShiftData.hours}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography className="font-light">Tips</Typography>
                            <Typography className="font-bold">{currentShiftData.tips}</Typography>
                        </div>
                    </div>
                </DashboardCard>
            ) : (
                <DashboardCard isLink={true} href="/papa-johns">
                    <CardContent className="flex h-full items-center justify-center">
                        <Typography sx={{ color: "primary.main" }}>Start Shift</Typography>
                    </CardContent>
                </DashboardCard>
            )}

            <DashboardCard title="Hours" isLink={true} href="/papa-johns/shift-data">
                <div className="flex flex-col h-full justify-around">
                    <div className="flex justify-between">
                        <Typography className="font-light">Week</Typography>
                        <Typography className="font-bold">
                            {summary.week.hours > 0 ? summary.week.hours.toFixed(2) : 0}
                        </Typography>
                    </div>
                    <div className="flex justify-between">
                        <Typography className="font-light">Pay Period</Typography>
                        <Typography className="font-bold">
                            {summary.payPeriod.hours > 0 ? summary.payPeriod.hours.toFixed(2) : 0}
                        </Typography>
                    </div>
                </div>
            </DashboardCard>

            <DashboardCard title="Net Earnings" isLink={true} href="/papa-johns/shift-data">
                <div className="flex flex-col h-full justify-around">
                    <div className="flex justify-between">
                        <Typography className="font-light">Week</Typography>
                        <Typography className="font-bold">
                            {summary.week.hours > 0
                                ? currencyFormatter.format(summary.week.earnings)
                                : currencyFormatter.format(0)}
                        </Typography>
                    </div>
                    <div className="flex justify-between">
                        <Typography className="font-light">Pay Period</Typography>
                        <Typography className="font-bold">
                            {summary.payPeriod.hours > 0
                                ? currencyFormatter.format(summary.payPeriod.earnings)
                                : currencyFormatter.format(0)}
                        </Typography>
                    </div>
                </div>
            </DashboardCard>

            <DashboardCard title="Net Hourly" isLink={true} href="/papa-johns/shift-data">
                <div className="flex flex-col h-full justify-around">
                    <div className="flex justify-between">
                        <Typography className="font-light">Week</Typography>
                        <Typography className="font-bold">
                            {summary.week.hours > 0
                                ? currencyFormatter.format(summary.week.earnings / summary.week.hours)
                                : currencyFormatter.format(0)}
                        </Typography>
                    </div>
                    <div className="flex justify-between">
                        <Typography className="font-light">Pay Period</Typography>
                        <Typography className="font-bold">
                            {summary.payPeriod.hours > 0
                                ? currencyFormatter.format(summary.payPeriod.earnings / summary.payPeriod.hours)
                                : currencyFormatter.format(0)}
                        </Typography>
                    </div>
                </div>
            </DashboardCard>
        </div>
    );
}

/** Renders the dashboard entry point for the Papa Johns delivery tools. */
export default function Home() {
    return (
        <Box className="px-2 py-4 flex flex-col gap-8">
            <Typography variant="h1" className="text-4xl text-center">
                Papa Johns Dashboard
            </Typography>
            <Suspense fallback={<p>Loading...</p>}>
                <DashboardCards />
            </Suspense>
        </Box>
    );
}
