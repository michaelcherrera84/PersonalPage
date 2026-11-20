"use client";

import { Button, Rating, TextField, Typography } from "@mui/material";
import AddAddressButton from "@/components/papa-johns/add-address-button";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { addDeliveryAction } from "@/lib/actions/papa-johns/delivery-actions";

type Props = {
    location: string;
    setLocation: Dispatch<SetStateAction<string>>;
};

/** Renders the form for recording delivery tips, rating, address, and cash payment. */
export default function AddDeliveryForm({ location, setLocation }: Props) {
    const [rating, setRating] = useState<number | null>(null);
    const [cashTip, setCashTip] = useState("");
    const [ccTip, setCcTip] = useState("");
    const [cashPayment, setCashPayment] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    const isFormEmpty = !cashTip.trim() && !ccTip.trim() && rating === null && !location.trim() && !cashPayment.trim();

    /** Submits non-empty delivery details and clears the form after a successful save. */
    const handleAddDelivery = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isFormEmpty) return;

        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.append("rating", rating?.toString() ?? "");
        formData.append("address", location ?? "");

        const response = await addDeliveryAction(formData);

        if (response.success) {
            setCashTip("");
            setCcTip("");
            setCashPayment("");
            setRating(null);
            setLocation("");
        } else {
            alert(response.message);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleAddDelivery}>
            <fieldset className="flex flex-col gap-4">
                <legend className="py-4">
                    <Typography variant="h5">Add Delivery</Typography>
                </legend>
                <div className="flex gap-2">
                    <TextField
                        id="cash-tip"
                        name="cashTip"
                        label="Cash Tip"
                        type="number"
                        inputMode="decimal"
                        value={cashTip}
                        onChange={(e) => setCashTip(e.target.value)}
                    />

                    <TextField
                        id="cc-tip"
                        name="ccTip"
                        label="CC Tip"
                        type="number"
                        inputMode="decimal"
                        value={ccTip}
                        onChange={(e) => setCcTip(e.target.value)}
                    />
                </div>
                <div className="flex border items-center border-white/30 px-3 py-4 rounded justify-between">
                    <Typography>Rate this delivery</Typography>
                    <Rating precision={0.5} value={rating} size="large" onChange={(_, value) => setRating(value)} />
                </div>
                {location ? (
                    <TextField
                        id="address"
                        name="address"
                        value={location ?? ""}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                ) : (
                    <AddAddressButton setLocation={setLocation} />
                )}
                <TextField
                    id="cash-payment"
                    name="cashPayment"
                    label="Cash Payment"
                    type="number"
                    inputMode="decimal"
                    value={cashPayment}
                    onChange={(e) => setCashPayment(e.target.value)}
                />
                <Button type="submit" variant="contained" className="mt-6 mb-12" disabled={isFormEmpty}>
                    Submit
                </Button>
            </fieldset>
        </form>
    );
}
