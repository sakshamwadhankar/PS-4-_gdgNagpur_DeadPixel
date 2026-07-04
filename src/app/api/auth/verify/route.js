import { NextResponse } from 'next/server';

const VALID_POSTCODES = ['440001', '440002', '440003', '440004', '440005', '440006', '440008', '440009', '440010'];

export async function POST(request) {
  const { phone, postal_code } = await request.json();

  if (!phone || !postal_code) {
    return NextResponse.json(
      { success: false, message: 'Phone number and postal code are required.' },
      { status: 400 }
    );
  }

  const isVerified = VALID_POSTCODES.includes(postal_code);

  return NextResponse.json({
    success: true,
    is_verified: isVerified,
    access_level: isVerified ? 'write' : 'read-only',
    token: isVerified
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtbyIsInBvc3RhbF9jb2RlIjoiNDQwMDAxIiwiaXNfdmVyaWZpZWQiOnRydWV9.mock'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtbyIsInBvc3RhbF9jb2RlIjoiNDQwMDk5IiwiaXNfdmVyaWZpZWQiOmZhbHNlfQ.mock',
    constituency: isVerified ? `Nagpur Ward (${postal_code})` : null,
    message: isVerified
      ? 'Location verified. Write-enabled JWT issued.'
      : 'Location outside constituency. Read-only JWT issued.',
  });
}
