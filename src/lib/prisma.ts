// import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client/edge' // Use your custom output path
import { withAccelerate } from "@prisma/extension-accelerate";

// Pass connection string directly to the adapter
// const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })

// Instantiate the client with the adapter
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL! }).$extends(withAccelerate())
export default prisma
