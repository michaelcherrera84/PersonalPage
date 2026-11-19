"use client";

import { Shift } from "@/db/schema";
import { endShiftAction } from "@/lib/actions/papa-johns/shift-actions";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EndShiftButton({ activeShift }: { activeShift: Shift }) {
    const [openDialog, setOpenDialog] = useState(false);
    const router = useRouter();

    const handleEndShift = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const response = await endShiftAction(activeShift, formData);

        if (!response.success) {
            alert(response.message);
        }

        router.replace("/papa-johns/shift-data");
    };

    return (
        <>
            <Button variant="outlined" onClick={() => setOpenDialog(true)}>
                End Shift
            </Button>
            
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Shift Data</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEndShift} id="shift-data-form" className="flex flex-col gap-2">
                        <TextField name="storeHrs" label="Store Hours" type="number" />
                        <TextField name="roadHrs" label="Road Hours" type="number" />
                        <TextField name="miles" label="Miles" type="number" />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" form="shift-data-form">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
