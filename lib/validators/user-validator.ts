import { z } from "zod";

export const userSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    password: z.string(),
});

export const userCreateSchema = userSchema.omit({ id: true });
export const userLoginSchema = userSchema.pick({ email: true, password: true });

export type User = z.infer<typeof userSchema>;
export type Register = z.infer<typeof userCreateSchema>;
export type Login = z.infer<typeof userLoginSchema>;
