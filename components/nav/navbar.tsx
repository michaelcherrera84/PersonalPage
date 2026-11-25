"use client";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Drawer,
    IconButton,
    Link,
    Paper,
    Typography,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "@/lib/actions/auth-actions";

interface NavLink {
    label: string;
    href: string;
}

type Props = {
    title: string;
    links: NavLink[];
};

/** Renders responsive app navigation with links to the dashboard and shift tools. */
export default function Navbar({ title, links }: Props) {
    const [open, setOpen] = useState(false);

    /** Creates a drawer event handler that sets the drawer's open state. */
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box role="presentation" className="flex flex-col w-62.5 h-full">
            <Typography variant="h5" className="p-4">
                Personal Page
            </Typography>
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
        <nav className="sticky top-0 bg-background z-50">
            <div className="p-4 flex justify-between align-middle sm:hidden">
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h1" className="text-4xl font-medium">
                    {title}
                </Typography>
                <IconButton className="opacity-0">
                    <MenuIcon />
                </IconButton>
            </div>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

            <Paper className="hidden sm:flex justify-between items-center py-4 px-8 mb-8">
                <Typography variant="h1" className="text-3xl font-medium">
                    {title}
                </Typography>
                <div className="flex gap-8 items-center">
                    {links.map((link) => (
                        <Link key={link.label} href={link.href}>
                            {link.label}
                        </Link>
                    ))}
                    
                    <Button variant="outlined" onClick={logout}>
                        Sign Out
                    </Button>
                </div>
            </Paper>
        </nav>
    );
}
