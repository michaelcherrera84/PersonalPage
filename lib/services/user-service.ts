import { db } from "@/db";
import { user, User } from "@/db/schema";
import { userCreateSchema } from "../validators/user-validator";
import { eq } from "drizzle-orm";

/** Validates and inserts a user record, returning the created user. */
export async function createUserService(data: unknown): Promise<User> {
    const validated = userCreateSchema.parse(data);
    const [newUser] = await db.insert(user).values(validated).returning();
    return newUser;
}

/** Finds a user by ID, returning undefined when no record matches. */
export async function getUserByIdService(id: string): Promise<User | undefined> {
    const [requested] = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return requested;
}

/** Finds a user by email address, returning undefined when no record matches. */
export async function getUserByEmailService(email: string): Promise<User | undefined> {
    const [requested] = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return requested;
}
