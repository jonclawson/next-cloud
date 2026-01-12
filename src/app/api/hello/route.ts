import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  interface CloudflareEnv {
    NEXT_CLOUD_R2_BUCKET: R2Bucket;
  }
}


export async function GET() {
  try {
    const { env } = await getCloudflareContext();
    const key = "next.png";
    const object = await env?.NEXT_CLOUD_R2_BUCKET?.get(key);
    const body = await object?.arrayBuffer();
    const [setting] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, 'hello'))
      .limit(1);
    
    console.log('Setting:', setting);
    return NextResponse.json({
       message: `hello ${setting?.value}`, 
      image: body ? `data:${object?.httpMetadata?.contentType || 'image/png'};base64,${Buffer.from(body).toString('base64')}` : null 
      });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
