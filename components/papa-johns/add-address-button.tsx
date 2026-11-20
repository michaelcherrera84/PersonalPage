"use client";

import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { getAddress } from "@/lib/actions/papa-johns/delivery-actions";

type Props = {
    setLocation: Dispatch<SetStateAction<string>>;
};

/** Renders a button that fills the address field with the device's current location. */
export default function AddAddressButton({ setLocation }: Props) {
    const [loading, setLoading] = useState(false);

    /** Requests browser geolocation, reverse-geocodes it, and updates the address field. */
    const handleGetAddress = () => {
    if (!("geolocation" in navigator)) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;

                const response = await getAddress(latitude, longitude);

                if (!response.success || !response.data) {
                    throw new Error("Failed to fetch address.");
                }

                setLocation(response.data);
            } catch (error) {
                setLocation("");
                alert(
                    `Something went wrong: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`
                );
            } finally {
                setLoading(false);
            }
        },
        (geoError) => {
            alert(`Location access denied: ${geoError.message}`);
            setLoading(false);
        }
    );
};

    return (
        <Button type="button" variant="contained" onClick={handleGetAddress} disabled={loading} >
            {loading ? "Getting Address" : "Add Address"}
        </Button>
    );
}
