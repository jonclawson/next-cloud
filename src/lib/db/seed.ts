import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { settings } from './schema';
import { eq } from 'drizzle-orm';

// Configure WebSocket for Node.js environment (for local dev)
neonConfig.webSocketConstructor = ws;

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema: { settings } });

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
