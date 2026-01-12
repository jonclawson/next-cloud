import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  interface CloudflareEnv {
    NEXT_CLOUD_R2_BUCKET: any;
  }
}


export async function GET() {
  try {
    const { env } = await getCloudflareContext();
    const key = "next.png";
    const object = await env.NEXT_CLOUD_R2_BUCKET?.get(key);
    const [setting] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, 'hello'))
      .limit(1);
    
    console.log('Setting:', setting);
    return NextResponse.json({
       message: `hello ${setting?.value}`, 
       // base64 imaage data or placeholder text
       image: object ? await object.arrayBuffer().then((buffer: any) => {
         const uint8Array = new Uint8Array(buffer);
         let binary = '';
         for (let i = 0; i < uint8Array.byteLength; i++) {
           binary += String.fromCharCode(uint8Array[i]);
         }
         return 'data:' + object.httpMetadata.contentType + ';base64,' + btoa(binary);
       }) : ''
      });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
