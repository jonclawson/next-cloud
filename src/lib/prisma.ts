import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../../prisma/src/generated/prisma/client' // Use your custom output path
import { env } from 'prisma/config'

// Pass connection string directly to the adapter
const adapter = new PrismaNeon({ connectionString: env("DATABASE_URL") })

// Instantiate the client with the adapter
const prisma = new PrismaClient({ adapter })
export default prisma
