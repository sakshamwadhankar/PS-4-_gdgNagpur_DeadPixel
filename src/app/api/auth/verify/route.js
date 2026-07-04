import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VALID_POSTCODES = ['440001', '440002', '440003', '440004', '440005', '440006', '440008', '440009', '440010'];

export async function POST(request) {
  try {
    const { phone, postal_code } = await request.json();

    if (!phone || !postal_code) {
      return NextResponse.json(
        { success: false, message: 'Phone number and postal code are required.' },
        { status: 400 }
      );
    }

    const isVerified = VALID_POSTCODES.includes(postal_code);

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { phoneNumber: phone },
      update: { postalCode: postal_code, isVerified },
      create: { phoneNumber: phone, postalCode: postal_code, isVerified }
    });

    return NextResponse.json({
      success: true,
      is_verified: isVerified,
      access_level: isVerified ? 'write' : 'read-only',
      token: isVerified
        ? `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoi${user.id}IsInBvc3RhbF9jb2RlIjoi${postal_code}IiwiaXNfdmVyaWZpZWQiOnRydWV9.mock`
        : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoi${user.id}IsInBvc3RhbF9jb2RlIjoi${postal_code}IiwiaXNfdmVyaWZpZWQiOmZhbHNlfQ.mock`,
      constituency: isVerified ? `Nagpur Ward (${postal_code})` : null,
      message: isVerified
        ? 'Location verified. Write-enabled JWT issued.'
        : 'Location outside constituency. Read-only JWT issued.',
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
