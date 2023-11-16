import type {Config} from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env'}); // needed to load .env file because we are not using the drizzle-kit cli

export default {
    driver: 'pg',
    schema: './lib/db/schema.ts',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
    out: "./drizzle",
} satisfies Config;

// npx drizzle-kit push:pg