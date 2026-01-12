import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { settings } from './schema';
import { eq } from 'drizzle-orm';

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool, { schema: { settings } });

  console.log('🌱 Starting seed...');

  // Check if the setting already exists
  const existing = await db.select().from(settings).where(eq(settings.key, 'hello'));

  if (existing.length === 0) {
    await db.insert(settings).values({
      key: 'hello',
      value: 'world',
    });
    console.log('Created setting: hello -> world');
  } else {
    console.log('Setting already exists: hello -> world');
  }

  console.log('✅ Seeding finished.');
  
  await pool.end();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
