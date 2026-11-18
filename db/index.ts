// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// export const db = drizzle(process.env.DATABASE_URL!);

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config({ path: ".env" }); // or .env.local
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
