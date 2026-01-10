import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'hello' },
    });
    console.log('Setting:', setting);
    return NextResponse.json({ message: `hello ${setting?.value}` });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
