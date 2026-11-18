import { db } from "@/db";
import { user, User } from "@/db/schema";
import { userCreateSchema } from "../validators/user-validator";
import { eq } from "drizzle-orm";

export async function createUserService(data: unknown): Promise<User> {
    const validated = userCreateSchema.parse(data);
    const [newUser] = await db.insert(user).values(validated).returning();
    return newUser;
}

export async function getUserByIdService(id: string): Promise<User | undefined> {
    const [requested] = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return requested;
}

export async function getUserByEmailService(email: string): Promise<User | undefined> {
    const [requested] = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return requested;
}
