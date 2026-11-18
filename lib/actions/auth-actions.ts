"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";
import { createUserService, getUserByEmailService } from "@/lib/services/user-service";
import { ActionResponse } from "@/lib/types/Response";
import { User } from "@/db/schema";

export async function signup(formData: FormData): Promise<ActionResponse<User>> {
    const data = Object.fromEntries(formData.entries());

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password as string, saltRounds);

    const user = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
    };

    const newUser = await createUserService(user);

    return {
        success: true,
        data: newUser,
        message: "User added successfully.",
    };
}

export async function login(formData: FormData): Promise<ActionResponse<undefined>> {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        return {
            success: false,
            message: "Email and password are required.",
        };
    }

    const user = await getUserByEmailService(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
            success: false,
            message: "Invalid email or password.",
        };
    }

    const secret = process.env.SESSION_SECRET;

    if (!secret) {
        throw new Error("SESSION_SECRET is not configured.");
    }

    const token = await new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .setSubject(user.id)
        .sign(new TextEncoder().encode(secret));

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return {
        success: true,
        message: "Login successful.",
    };
}

export async function logout() {
    const cookieStore = await cookies();

    cookieStore.delete("session");

    redirect("/login");
}
