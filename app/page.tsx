import Navbar from "@/components/nav/navbar";
import { PapaJohnsDashboardCards } from "@/components/papa-johns/dashboard";
import { Box } from "@mui/material";
import { Suspense } from "react";

/** Renders the dashboard entry point for the Papa Johns delivery tools. */
export default function Home() {
    const navLinks = [
        {
            label: "Papa Johns",
            href: "/papa-johns"
        }
    ]

    return (
        <Box>
            <Navbar title="Personal Page" links={navLinks}/>
            <div className="flex justify-center p-4">
                <Suspense fallback={<p>Loading...</p>}>
                    <PapaJohnsDashboardCards />
                </Suspense>
            </div>
        </Box>
    );
}
