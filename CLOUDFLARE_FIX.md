# Cloudflare Workers Fix

## Problem
The initial migration used `drizzle-orm/neon-serverless` with WebSocket connections (`Pool`), which doesn't work reliably in Cloudflare Workers due to WebSocket limitations.

## Solution
Switched to `drizzle-orm/neon-http` which uses Neon's HTTP API - fully compatible with Cloudflare Workers.

## Changes Made

### [src/lib/db/index.ts](src/lib/db/index.ts)
```typescript
// Before: WebSocket-based Pool
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool, { schema });

// After: HTTP-based neon
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### [src/lib/db/seed.ts](src/lib/db/seed.ts)
Updated to use the same HTTP driver for consistency.

## Deployment

### Option 1: Deploy from CI/CD (Recommended)
Use GitHub Actions or similar with Linux runner to build and deploy.

### Option 2: Skip Build Locally
If you have a working `.open-next` folder:
```bash
npm run deploy -- --skipBuild
```

### Option 3: Docker/DevContainer
Build in a Linux container that meets Cloudflare's requirements.

## Testing
The fix resolves the error:
```
Error: Failed query: select "key", "value" from "Setting" where "Setting"."key" = $1 limit $2
```

The HTTP driver properly handles parameterized queries in the Cloudflare Workers environment.

## Resources
- [Neon HTTP vs WebSocket](https://neon.tech/docs/serverless/serverless-driver#http-vs-websockets)
- [Drizzle Neon HTTP](https://orm.drizzle.team/docs/get-started-postgresql#neon)
