import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { settings, users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Configure WebSocket for Node.js environment (for local dev)
neonConfig.webSocketConstructor = ws;

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema: { settings, users } });

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

  // Check if test user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, 'test@example.com'));

  if (existingUser.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      emailVerified: new Date(),
    });
    console.log('Created test user: test@example.com / password123');
  } else {
    console.log('Test user already exists: test@example.com');
  }

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
