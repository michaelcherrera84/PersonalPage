"use client";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import type { Shift } from "@/db/schema";
import { updateShiftAction } from "@/lib/actions/papa-johns/shift-actions";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { useState } from "react";

type EditableShift = Omit<
    Shift,
    | "storeHrs"
    | "roadHrs"
    | "miles"
    | "driverInStorePay"
    | "onRoadPay"
    | "mileage"
    | "cashTips"
    | "ccTips"
    | "mileageCost"
> & {
    storeHrs: number | string | null;
    roadHrs: number | string | null;
    miles: number | string | null;
    driverInStorePay: number | string | null;
    onRoadPay: number | string | null;
    mileage: number | string | null;
    cashTips: number | string | null;
    ccTips: number | string | null;
    mileageCost: number | string | null;
};

type DateFilter = "today" | "week" | "payPeriod" | "month";

const columns: GridColDef[] = [
    {
        field: "start",
        headerName: "Date",
        headerAlign: "center",
        valueFormatter: (value) => (value == null ? "" : dateFormatter.format(value)),
    },
    {
        field: "storeHrs",
        headerName: "Store Hours",
        headerAlign: "center",
        type: "number",
        width: 120,
        editable: true,
        align: "right",
    },
    {
        field: "roadHrs",
        headerName: "Road Hours",
        headerAlign: "center",
        type: "number",
        width: 120,
        editable: true,
        align: "right",
    },
    {
        field: "miles",
        headerName: "Miles",
        headerAlign: "center",
        type: "number",
        width: 100,
        editable: true,
        align: "right",
    },
    {
        field: "driverInStorePay",
        headerName: "In-Store Pay",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "onRoadPay",
        headerName: "On-Road Pay",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "mileage",
        headerName: "Mileage Pay",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "cashTips",
        headerName: "Cash Tips",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "ccTips",
        headerName: "CC Tips",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "mileageCost",
        headerName: "Mileage Cost",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "averageRating",
        headerName: "Average Rating",
        headerAlign: "center",
        type: "number",
        width: 130,
        align: "right",
    },
];

function getDateRange(filter: DateFilter) {
    const now = new Date();

    if (filter === "today") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        return { start, end };
    }

    if (filter === "month") {
        return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        };
    }

    if (filter === "week") {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Move back to Thursday
        start.setDate(start.getDate() - ((start.getDay() - 4 + 7) % 7));

        const end = new Date(start);
        end.setDate(end.getDate() + 7);

        return { start, end };
    }

    // Pay periods are 14 days, beginning October 1, 2026.
    const anchor = new Date(2026, 9, 1);

    // Compare calendar days rather than milliseconds to avoid DST issues.
    const calendarDay = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;

    const daysSinceAnchor = calendarDay(now) - calendarDay(anchor);
    const periodOffset = Math.floor(daysSinceAnchor / 14) * 14;

    const start = new Date(anchor);
    start.setDate(start.getDate() + periodOffset);

    const end = new Date(start);
    end.setDate(end.getDate() + 14);

    return { start, end };
}

function calculateTotals(rows: Shift[]) {
    const ratings = rows
        .map((row) => row.averageRating)
        .filter((rating): rating is number => rating !== null && rating !== undefined);

    const totals = {
        storeHrs: rows.reduce((sum, row) => sum + (row.storeHrs ?? 0), 0),
        roadHrs: rows.reduce((sum, row) => sum + (row.roadHrs ?? 0), 0),
        miles: rows.reduce((sum, row) => sum + (row.miles ?? 0), 0),
        driverInStorePay: rows.reduce((sum, row) => sum + (row.driverInStorePay ?? 0), 0),
        onRoadPay: rows.reduce((sum, row) => sum + (row.onRoadPay ?? 0), 0),
        mileage: rows.reduce((sum, row) => sum + (row.mileage ?? 0), 0),
        cashTips: rows.reduce((sum, row) => sum + (row.cashTips ?? 0), 0),
        ccTips: rows.reduce((sum, row) => sum + (row.ccTips ?? 0), 0),
        mileageCost: rows.reduce((sum, row) => sum + (row.mileageCost ?? 0), 0),
        averageRating: ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null,
    };

    const totalHours = totals.storeHrs + totals.roadHrs;
    const grossPay = totals.driverInStorePay + totals.onRoadPay;
    const totalTips = totals.cashTips + totals.ccTips;
    const netEarnings = grossPay + totalTips + totals.mileage - totals.mileageCost;

    return {
        ...totals,
        totalHours,
        grossPay,
        totalTips,
        netEarnings,
        earningsPerHour: totalHours > 0 ? netEarnings / totalHours : 0,
    };
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
});

export default function ShiftDataGrid({ rows }: { rows: Shift[] }) {
    const [activeFilter, setActiveFilter] = useState<DateFilter>("week");

    const [allRows, setAllRows] = useState(rows);

    const { start, end } = getDateRange(activeFilter);

    const filteredRows = allRows.filter((row) => row.start >= start && row.start < end);

    const totals = calculateTotals(filteredRows);

    function toNumberOrNull(value: unknown): number | null {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : null;
    }

    async function processShiftRowUpdate(updatedRow: EditableShift) {
        const parsedRow: Shift = {
            ...updatedRow,
            storeHrs: toNumberOrNull(updatedRow.storeHrs),
            roadHrs: toNumberOrNull(updatedRow.roadHrs),
            miles: toNumberOrNull(updatedRow.miles),
            driverInStorePay: toNumberOrNull(updatedRow.driverInStorePay),
            onRoadPay: toNumberOrNull(updatedRow.onRoadPay),
            mileage: toNumberOrNull(updatedRow.mileage),
            cashTips: toNumberOrNull(updatedRow.cashTips),
            ccTips: toNumberOrNull(updatedRow.ccTips),
            mileageCost: toNumberOrNull(updatedRow.mileageCost),
        };

        const response = await updateShiftAction(parsedRow);

        if (!response.success) {
            throw new Error(response.message);
        }

        setAllRows((currentRows) => currentRows.map((row) => (row.id === parsedRow.id ? parsedRow : row)));

        return parsedRow;
    }

    function handleProcessRowUpdateError(error: Error) {
        console.error("Failed to update shift:", error);
        alert(error.message);
    }

    return (
        <div className="mt-8">
            <div className="hidden sm:block">
                <ButtonGroup variant="outlined" className="m-0 md:ml-8">
                    <Button
                        variant={activeFilter === "today" ? "contained" : "outlined"}
                        onClick={() => setActiveFilter("today")}
                    >
                        Today
                    </Button>

                    <Button
                        variant={activeFilter === "week" ? "contained" : "outlined"}
                        onClick={() => setActiveFilter("week")}
                    >
                        This Week
                    </Button>

                    <Button
                        variant={activeFilter === "payPeriod" ? "contained" : "outlined"}
                        onClick={() => setActiveFilter("payPeriod")}
                    >
                        This Pay Period
                    </Button>

                    <Button
                        variant={activeFilter === "month" ? "contained" : "outlined"}
                        onClick={() => setActiveFilter("month")}
                    >
                        This Month
                    </Button>
                </ButtonGroup>
            </div>
            <div className="sm:hidden m-4 flex justify-between gap-2 flex-wrap">
                <Typography
                    onClick={() => setActiveFilter("today")}
                    className="cursor-pointer hover:underline text-nowrap"
                    sx={{ color: activeFilter == "today" ? "primary" : "primary.main" }}
                >
                    Today
                </Typography>
                <Typography
                    onClick={() => setActiveFilter("week")}
                    className="cursor-pointer hover:underline text-nowrap"
                    sx={{ color: activeFilter == "week" ? "primary" : "primary.main" }}
                >
                    This Week
                </Typography>
                <Typography
                    onClick={() => setActiveFilter("payPeriod")}
                    className="cursor-pointer hover:underline text-nowrap"
                    sx={{ color: activeFilter == "payPeriod" ? "primary" : "primary.main" }}
                >
                    This Pay Period
                </Typography>
                <Typography
                    onClick={() => setActiveFilter("month")}
                    className="cursor-pointer hover:underline text-nowrap"
                    sx={{ color: activeFilter == "month" ? "primary" : "primary.main" }}
                >
                    This Month
                </Typography>
            </div>
            <Paper className="m-2 md:m-8">
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    editMode="row"
                    processRowUpdate={processShiftRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "start", sort: "asc" }],
                        },
                    }}
                />
            </Paper>

            <Paper className="m-2 md:m-8 p-4 border border-gray-300 shadow shadow-gray-300 dark:border-white/30 dark:shadow-none">
                <div className="font-bold mb-3">Totals</div>

                <div className="flex flex-wrap gap-6">
                    <div>
                        <div className="text-sm text-gray-500">Store Hours</div>
                        <div>{totals.storeHrs.toFixed(2)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Road Hours</div>
                        <div>{totals.roadHrs.toFixed(2)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Miles</div>
                        <div>{totals.miles.toFixed(1)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">In-Store Pay</div>
                        <div>{currencyFormatter.format(totals.driverInStorePay)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">On-Road Pay</div>
                        <div>{currencyFormatter.format(totals.onRoadPay)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Mileage Pay</div>
                        <div>{currencyFormatter.format(totals.mileage)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Cash Tips</div>
                        <div>{currencyFormatter.format(totals.cashTips)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">CC Tips</div>
                        <div>{currencyFormatter.format(totals.ccTips)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Total Hours</div>
                        <div>{totals.totalHours.toFixed(2)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Gross Pay</div>
                        <div>{currencyFormatter.format(totals.grossPay)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Total Tips</div>
                        <div>{currencyFormatter.format(totals.totalTips)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Mileage Cost</div>
                        <div>{currencyFormatter.format(totals.mileageCost)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Net Earnings</div>
                        <div>{currencyFormatter.format(totals.netEarnings)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Earnings/Hour</div>
                        <div>{currencyFormatter.format(totals.earningsPerHour)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Average Rating</div>
                        <div>{totals.averageRating}</div>
                    </div>

                    {activeFilter === "today" && (
                        <div>
                            <div className="text-sm text-gray-500">Instant Pay</div>
                            <div>{currencyFormatter.format(totals.ccTips + totals.mileage)}</div>
                        </div>
                    )}
                </div>
            </Paper>
        </div>
    );
}
