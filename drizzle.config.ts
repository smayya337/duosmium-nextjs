import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: './lib/global/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		// @ts-ignore
		connectionString: process.env.DATABASE_URL
	}
} satisfies Config;
