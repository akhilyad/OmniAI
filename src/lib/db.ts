import { neon } from "@neondatabase/serverless";

// DATABASE_URL must be set in .env.local (Neon connection string)
// Format: postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
const DATABASE_URL = process.env.DATABASE_URL;

let _sql: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local — see .env.example."
    );
  }
  if (!_sql) {
    _sql = neon(DATABASE_URL);
  }
  return _sql;
}

// Returns true if DB is configured, false otherwise (used for graceful fallback)
export function isDbConfigured(): boolean {
  return Boolean(DATABASE_URL);
}
