import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  interface CloudflareEnv {
    NEXT_CLOUD_R2_BUCKET?: R2Bucket;
  }
}

export async function GET() {
  const { env } = await getCloudflareContext();
  console.log('Environment Variables:', env);
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'hello' },
    });
    const key = 'next.png';  // Replace with your actual image key in R2
    
    const object = await env.NEXT_CLOUD_R2_BUCKET?.get(key);  // Assuming 'R2_BUCKET' is your binding name
    
    // if (!object) {
      //   return NextResponse.json({ message: 'Image not found' }, { status: 404 });
      // }
      
    const body = await object?.arrayBuffer();
    
    console.log('Fetched object from R2:', object);
    
    console.log('Setting:', setting);
    return NextResponse.json({ 
      message: `hello ${setting?.value}`, 
      image: body ? `data:${object?.httpMetadata?.contentType || 'image/png'};base64,${Buffer.from(body).toString('base64')}` : null 
    }, 
    { status: 200 });
    // return new NextResponse(body, {
    //   headers: {
    //     'Content-Type': object?.httpMetadata?.contentType || 'image/png',
    //     "x-image-alt": `hello ${setting?.value}`,
    //   },
    // });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
