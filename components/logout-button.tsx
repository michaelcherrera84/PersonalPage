"use client";

import { Button } from "@mui/material";
import { logout } from "@/lib/actions/auth-actions";

/** Renders a button that clears the user's session and signs out. */
export default function LogoutButton() {
    return (
        <Button onClick={() => logout()} color="inherit">
            Logout
        </Button>
    );
}