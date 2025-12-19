import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL env var");
}

const client = postgres(connectionString, { ssl: "require" });

// Habilita db.query.<table> tipado (ej: db.query.teamMembers)
export const db = drizzle(client, { schema });
