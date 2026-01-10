import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client' // Use your custom output path

// Pass connection string directly to the adapter
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })

// Instantiate the client with the adapter
const prisma = new PrismaClient({ adapter })
export default prisma
