import { migrate } from "drizzle-orm/neon-http/migrator";
import {drizzle} from 'drizzle-orm/neon-http';
import {neon, neonConfig} from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env'}); // needed to load .env file because we are not using the drizzle-kit cli

neonConfig.fetchConnectionCache = true;
if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable');
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);
await migrate(db, { migrationsFolder: "drizzle" });