import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// En Next/Vercel, usa DATABASE_URL desde .env/.env.local (Next lo carga solo)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL env var");
}

const client = postgres(connectionString, { ssl: "require" });
export const db = drizzle(client);
