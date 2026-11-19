"use client";

import { login } from "@/lib/actions/auth-actions";
import { Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const response = await login(formData);

        if (response.success) {
            router.replace("/");
            router.refresh();
        } else {
            alert(response.message);
        }
    };

    return (
        <main className="flex flex-col items-center gap-10 w-screen h-screen mt-25">
            <Typography variant="h1" className="font-medium text-4xl">Personal Page</Typography>
            <form onSubmit={handleLogin} className="w-75">
                <fieldset className="flex flex-col gap-3">
                    <legend>
                        <Typography variant="h2" className="pb-4 text-center font-normal text-2xl">
                            Sign In
                        </Typography>
                    </legend>
                    <TextField
                        name="email"
                        type="email"
                        label="Email"
                        className="w-full"
                        required
                        slotProps={{
                            inputLabel: {
                                required: false,
                            },
                        }}
                    />
                    <TextField
                        name="password"
                        type="password"
                        label="Password"
                        className="w-full"
                        required
                        slotProps={{
                            inputLabel: {
                                required: false,
                            },
                        }}
                    />

                    <Button type="submit" variant="contained">
                        Sign In
                    </Button>
                </fieldset>
            </form>
        </main>
    );
}
