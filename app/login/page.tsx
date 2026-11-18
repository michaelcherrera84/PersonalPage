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
            router.replace("/papa-johns");
            router.refresh();
        } else {
            alert(response.message);
        }
    };

    return (
        <main className="flex justify-center w-screen h-[calc(100vh-72px)]">
            <form onSubmit={handleLogin} className="w-75 mt-20">
                <fieldset className="flex flex-col gap-3">
                    <legend>
                        <Typography variant="h5" className="py-4 text-center">
                            Sign In
                        </Typography>
                    </legend>
                    <TextField name="email" type="email" label="Email" className="w-full" required />
                    <TextField name="password" type="password" label="Password" className="w-full" required />

                    <Button type="submit" variant="contained">Sign In</Button>
                </fieldset>
            </form>
        </main>
    );
}
