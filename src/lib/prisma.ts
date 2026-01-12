import { PrismaClient } from '@prisma/client/edge' // Use your custom output path
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL! })
.$extends(withAccelerate())
export default prisma

//   Prisma Client could not locate the Query Engine for runtime "debian-openssl-1.1.x".
// import { neonConfig } from '@neondatabase/serverless';
// import { PrismaClient } from '@prisma/client';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import ws from 'ws';

// neonConfig.webSocketConstructor = ws;

// const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
// const prisma = new PrismaClient({ adapter });

// export default prisma;

// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from '@prisma/adapter-pg'

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
// const prisma = new PrismaClient({adapter})

// export default prisma;