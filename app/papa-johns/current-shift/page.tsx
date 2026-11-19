import EndShiftButton from "@/components/papa-johns/end-shift-button";
import ShiftTabs from "@/components/papa-johns/shift-tabs";
import { getDeliveriesByShiftId } from "@/lib/services/papa-johns/delivery-service";
import { getActiveShiftService } from "@/lib/services/papa-johns/shift-service";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Suspense } from "react";

async function CurrentShiftContent() {
    const activeShift = await getActiveShiftService();

    if (!activeShift) {
        return <p>There is no active shift.</p>;
    }

    const deliveries = await getDeliveriesByShiftId(activeShift.id);

    const ccTips = deliveries.reduce((total, delivery) => total + (delivery.ccTip ?? 0), 0);

    const cashTips = deliveries.reduce((total, delivery) => total + (delivery.cashTip ?? 0), 0);

    const ratedDeliveries = deliveries.filter((delivery) => delivery.rating !== null);
    const averageRating = ratedDeliveries.length
        ? ratedDeliveries.reduce((total, delivery) => total + delivery.rating!, 0) / ratedDeliveries.length
        : null;

    const currency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    const cashPayments = deliveries.reduce((total, delivery) => total + (delivery.cashPayment ?? 0), 0);

    return (
        <div className="pt-8 px-4">
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Start (Hours)</TableCell>
                            <TableCell align="right">
                                {activeShift.start.toLocaleTimeString([], { timeStyle: "short" })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Deliveries</TableCell>
                            <TableCell align="right">{deliveries.length}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>CC Tips</TableCell>
                            <TableCell align="right">{currency.format(ccTips)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Cash Tips</TableCell>
                            <TableCell align="right">{currency.format(cashTips)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Average Rating</TableCell>
                            <TableCell align="right">{averageRating?.toFixed(2) || "No rated deliveries"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Cash Payments</TableCell>
                            <TableCell align="right">{currency.format(cashPayments)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Total Cash</TableCell>
                            <TableCell align="right">{currency.format(cashPayments + cashTips)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="mt-4">
                <EndShiftButton activeShift={activeShift} />
            </div>
        </div>
    );
}

export default function CurrentShiftPage() {
    return (
        <Box>
            <header className="flex flex-col gap-3 items-center">
                <Typography variant="h2" className="font-light text-2xl">
                    Current Shift
                </Typography>
            </header>

            <Suspense fallback={<p>Loading shift information...</p>}>
                <CurrentShiftContent />
                <ShiftTabs />
            </Suspense>
        </Box>
    );
}
