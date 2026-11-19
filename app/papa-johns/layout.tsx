import Navbar from "@/components/nav/navbar";
import { Box } from "@mui/material";

export default function PapaJohnsLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box className="h-screen">
            <Navbar title="Papa Johns" />
            <main>{children}</main>
        </Box>
    );
}
