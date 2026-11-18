"use client";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Drawer,
    IconButton,
    Link,
    Typography,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "@/lib/actions/auth-actions";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box role="presentation" className="flex flex-col w-62.5 h-full">
            <Typography variant="h5" className="p-4">Personal Page</Typography>
            <Accordion disableGutters>
                <AccordionSummary LinkComponent={Link} href="/">
                    <Typography className="hover:underline">Dashboard</Typography>
                </AccordionSummary>
            </Accordion>
            <Accordion disableGutters>
                <AccordionSummary>
                    <Typography>Papa Johns</Typography>
                </AccordionSummary>
                <AccordionDetails className="pl-10">
                    <Typography component={Link} href="/papa-johns" className="text-inherit">
                        Delivery Entry
                    </Typography>
                </AccordionDetails>
                <AccordionDetails className="pl-10">
                    <Typography component={Link} href="/papa-johns/shift-data" className="text-inherit">
                        Shift Data
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <div className="flex-1" />
            <Accordion disableGutters>
                <AccordionSummary onClick={logout}>
                    <Typography className="hover:underline">Sign Out</Typography>
                </AccordionSummary>
            </Accordion>
            <Accordion disableGutters className="h-20">
                <AccordionSummary />
            </Accordion>
        </Box>
    );

    return (
        <nav className="p-2">
            <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </nav>
    );
}
