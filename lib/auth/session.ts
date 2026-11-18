import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getUserByIdService } from "@/lib/services/user-service";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function verifySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });

        if (!payload.sub) return null;

        const user = await getUserByIdService(payload.sub);

        if (!user) return null;

        const { password, ...safeUser} = user;

        return safeUser;
    } catch {
        return null;
    }
}