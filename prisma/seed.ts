import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;
async function main() {
  // Use the adapter for Cloudflare/Neon compatibility if needed
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
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
  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })