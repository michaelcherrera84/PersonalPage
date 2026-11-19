"use client";

import { Delivery } from "@/db/schema";
import { updateDeliveryAction } from "@/lib/actions/papa-johns/delivery-actions";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

type EditableDelivery = Omit<Delivery, "cashTip" | "ccTip" | "rating" | "address" | "cashPayment"> & {
    cashTip: number | string | null;
    ccTip: number | string | null;
    rating: number | string | null;
    address: string | null;
    cashPayment: number | string | null;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Chicago",
});

const columns: GridColDef[] = [
    {
        field: "time",
        headerName: "Time",
        headerAlign: "center",
        valueFormatter: (value) => timeFormatter.format(value),
    },
    {
        field: "cashTip",
        headerName: "Cash Tip",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "ccTip",
        headerName: "CC Tip",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
    {
        field: "rating",
        headerName: "Rating",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
    },
    {
        field: "address",
        headerName: "Address",
        headerAlign: "center",
        type: "string",
        width: 250,
        editable: true,
        align: "left",
    },
    {
        field: "cashPayment",
        headerName: "Cash Payment",
        headerAlign: "center",
        type: "number",
        width: 130,
        editable: true,
        align: "right",
        valueFormatter: (value) => (value == null ? "" : currencyFormatter.format(value)),
    },
];

export default function ShiftDeliveriesDataGrid({ rows }: { rows: Delivery[] }) {
    const [allRows, setAllRows] = useState(rows);

    function toNumberOrNull(value: unknown): number | null {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : null;
    }

    async function processDeliveryUpdate(updatedRow: EditableDelivery) {
        const parsedRow: Delivery = {
            ...updatedRow,
            cashTip: toNumberOrNull(updatedRow.cashTip),
            ccTip: toNumberOrNull(updatedRow.ccTip),
            rating: toNumberOrNull(updatedRow.rating),
            address: updatedRow.address,
            cashPayment: toNumberOrNull(updatedRow.cashPayment),
        };

        const response = await updateDeliveryAction(parsedRow);

        if (!response.success) {
            throw new Error(response.message);
        }

        setAllRows((currentRows) => currentRows.map((row) => (row.id === parsedRow.id ? parsedRow : row)));

        return parsedRow;
    }

    function handleProcessRowUpdateError(error: Error) {
        console.error("Failed to update delivery:", error);
        alert(error.message);
    }

    return (
        <div className="mt-8">
            <Paper className="m-2 md:m-8">
                <DataGrid
                    rows={allRows}
                    columns={columns}
                    editMode="row"
                    processRowUpdate={processDeliveryUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "time", sort: "asc" }],
                        },
                    }}
                />
            </Paper>
        </div>
    );
}
