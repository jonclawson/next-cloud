import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const [setting] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, 'hello'))
      .limit(1);
    
    console.log('Setting:', setting);
    return NextResponse.json({ message: `hello ${setting?.value}` });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
