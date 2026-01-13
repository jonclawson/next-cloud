import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// import { neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
// import ws from 'ws';
// neonConfig.webSocketConstructor = ws;
async function main() {
  // Use the adapter for Cloudflare/Neon compatibility if needed
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Starting seed...');

  const setting = await prisma.setting.upsert({
    where: { key: 'hello' },
    update: {},
    create: {
      value: 'world',
      key: 'hello',
    },
  });

  console.log({ setting });

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log({ user });
  console.log('✅ Seeding finished.');
  console.log('📧 Login credentials: test@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })