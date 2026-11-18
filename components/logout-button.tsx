"use client";

import { Button } from "@mui/material";
import { logout } from "@/lib/actions/auth-actions";

export default function LogoutButton() {
    return (
        <Button onClick={() => logout()} color="inherit">
            Logout
        </Button>
    );
}