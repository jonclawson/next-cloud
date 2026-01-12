# Drizzle Migration Guide

This project has been migrated from Prisma to Drizzle ORM.

## What Changed

### Dependencies
- ✅ Added: `drizzle-orm`, `drizzle-kit`
- ❌ Removed: `@prisma/client`, `@prisma/adapter-neon`, `@prisma/extension-accelerate`, `prisma`

### File Structure
```
src/lib/db/
  ├── schema.ts      # Database schema definition
  ├── index.ts       # Drizzle client instance
  └── seed.ts        # Database seed script

drizzle/             # Migration files
drizzle.config.ts    # Drizzle Kit configuration
```

### Scripts
- `npm run db:generate` - Generate migrations from schema changes
- `npm run db:migrate` - Apply migrations to database
- `npm run db:push` - Push schema changes directly (dev only)
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed the database

## Migration Steps

### If you have an existing database:

Your existing Prisma tables will work with Drizzle! The schema matches:
- Table name: `Setting`
- Columns: `key` (text, primary key), `value` (text)

**No migration needed** - your existing data is compatible.

### For a fresh database:

1. Push the schema:
   ```bash
   npm run db:push
   ```

2. Seed the database:
   ```bash
   npm run db:seed
   ```

## Usage Examples

### Query Data
```typescript
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

// Find one
const [setting] = await db
  .select()
  .from(schema.settings)
  .where(eq(schema.settings.key, 'hello'))
  .limit(1)

// Find all
const allSettings = await db.select().from(schema.settings)
```

### Insert Data
```typescript
await db.insert(schema.settings).values({
  key: 'myKey',
  value: 'myValue',
})
```

### Update Data
```typescript
import { eq } from 'drizzle-orm'

await db
  .update(schema.settings)
  .set({ value: 'newValue' })
  .where(eq(schema.settings.key, 'myKey'))
```

### Delete Data
```typescript
import { eq } from 'drizzle-orm'

await db
  .delete(schema.settings)
  .where(eq(schema.settings.key, 'myKey'))
```

## Differences from Prisma

| Feature | Prisma | Drizzle |
|---------|--------|---------|
| Query Builder | `prisma.setting.findUnique()` | `db.select().from(schema.settings)` |
| Type Safety | Generated types | Inferred from schema |
| Migrations | `prisma migrate` | `drizzle-kit generate/migrate` |
| Studio | `prisma studio` | `drizzle-kit studio` |
| Edge Runtime | Via adapters | Native support |

## Benefits of Drizzle

- ✅ Lightweight (smaller bundle size)
- ✅ Native Cloudflare Workers support
- ✅ Type-safe query builder
- ✅ No code generation required
- ✅ Better TypeScript inference
- ✅ Direct SQL when needed

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Column Types](https://orm.drizzle.team/docs/column-types/pg)
