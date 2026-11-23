"use server";

import { createDeliveryService, updateDeliveryService } from "@/lib/services/papa-johns/delivery-service";
import { getActiveShiftService } from "@/lib/services/papa-johns/shift-service";
import { Delivery } from "@/db/schema";
import { ActionResponse } from "@/lib/types/Response";
import { verifySession } from "@/lib/auth/session";

const STATE_ABBREVIATIONS: Record<string, string> = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
};

const STREET_ABBREVIATIONS: Record<string, string> = {
    Avenue: "Ave",
    Boulevard: "Blvd",
    Circle: "Cir",
    Court: "Ct",
    Drive: "Dr",
    Expressway: "Expy",
    Highway: "Hwy",
    Lane: "Ln",
    Parkway: "Pkwy",
    Place: "Pl",
    Road: "Rd",
    Square: "Sq",
    Street: "St",
    Terrace: "Ter",
    Trail: "Trl",
    Way: "Way",
};

/** Formats reverse-geocoded address fields as a concise US mailing address. */
function formatUSAddress(addr: Record<string, string> = {}): string {
    // 1. Abbreviate the street suffix (e.g., "Cantal Drive" -> "Cantal Dr")
    const road = (addr.road || "").replace(
        /\b(Avenue|Boulevard|Circle|Court|Drive|Expressway|Highway|Lane|Parkway|Place|Road|Square|Street|Terrace|Trail|Way)\b/gi,
        (match) => {
            const capitalized = match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
            return STREET_ABBREVIATIONS[capitalized] || match;
        },
    );

    // 2. Combine house number + street
    const streetLine = [addr.house_number, road].filter(Boolean).join(" ");

    // 3. Resolve city (Nominatim uses different keys depending on municipality size)
    const city = addr.city || addr.town || addr.village || addr.hamlet || "";

    // 4. Abbreviate state (Nominatim also often provides "ISO3166-2-lvl4": "US-LA")
    const state = addr["ISO3166-2-lvl4"]?.replace("US-", "") || STATE_ABBREVIATIONS[addr.state] || addr.state || "";

    const stateZip = [state, addr.postcode].filter(Boolean).join(" ");

    return [streetLine, city, stateZip].filter(Boolean).join(", ");
}

/** Looks up the address at the supplied coordinates using OpenStreetMap Nominatim. */
export async function getAddress(lat: number, lon: number): Promise<ActionResponse<string>> {
    const user = await verifySession();

    if (!user) {
        return {
            success: false,
            message: "You must be logged in to perform this action.",
        };
    }

    try {
        const url = new URL("https://nominatim.openstreetmap.org/reverse");
        url.searchParams.set("lat", lat.toString());
        url.searchParams.set("lon", lon.toString());
        url.searchParams.set("format", "jsonv2");

        const response = await fetch(url, {
            headers: {
                "User-Agent": "PersonalPage/1.0 (michael.c.herrera@icloud.com)",
            },
        });

        if (!response.ok) {
            return {
                success: false,
                message: "Failed to fetch address.",
            };
        }

        const data = await response.json();
        const formattedAddress = formatUSAddress(data.address);

        return {
            success: true,
            data: formattedAddress || data.display_name,
            message: "Address fetched successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: `Reverse geocoding failed ${error instanceof Error && ":" + error.message}`,
        };
    }
}

/** Creates a delivery for the current active shift from submitted form fields. */
export async function addDeliveryAction(formData: FormData): Promise<ActionResponse<Delivery>> {
    const user = await verifySession();

    if (!user) {
        return {
            success: false,
            message: "You must be logged in to perform this action.",
        };
    }

    const data = Object.fromEntries(formData.entries());

    try {
        const delivery = {
            ...data,
            shiftId: (await getActiveShiftService()).id,
            dateTime: new Date(),
            address: data.address === "" ? null : data.address
        };

        const newDelivery = await createDeliveryService(delivery);

        return {
            success: true,
            data: newDelivery,
            message: "Delivery created successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to insert delivery ${error instanceof Error && ":" + error.message}`,
        };
    }
}

/** Updates a delivery after confirming that the request has an authenticated session. */
export async function updateDeliveryAction(data: Delivery): Promise<ActionResponse<Delivery>> {
    const user = await verifySession();

    if (!user) {
        return {
            success: false,
            message: "You must be logged in to perform this action.",
        };
    }

    try {
        const updated = await updateDeliveryService(data);

        return {
            success: true,
            data: updated,
            message: "Delivery updated successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to update delivery ${error instanceof Error && ":" + error.message}`,
        };
    }
}
