import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create SQL query function for HTTP
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle instance with HTTP driver
export const db = drizzle(sql, { schema });

export { schema };
