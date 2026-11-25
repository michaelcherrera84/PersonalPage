import Navbar from "@/components/nav/navbar";
import { Box } from "@mui/material";

/** Adds the Papa Johns navigation around all delivery-management pages. */
export default function PapaJohnsLayout({ children }: { children: React.ReactNode }) {
    const links = [
        {
            label: "Dashboard",
            href: "/"
        },
        {
            label: "Delivery Entry",
            href: "/papa-johns"
        },
        {
            label: "Shift Data",
            href: "papa-johns/shift-data"
        }
    ]
    return (
        <Box className="h-screen">
            <Navbar title="Papa Johns" links={links} />
            <main>{children}</main>
        </Box>
    );
}
