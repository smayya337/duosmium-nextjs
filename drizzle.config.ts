import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./lib/global/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    // @ts-ignore
    connectionString: process.env.DATABASE_URL,
  }
} satisfies Config;