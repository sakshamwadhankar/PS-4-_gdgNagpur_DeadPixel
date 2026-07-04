import { NextResponse } from 'next/server';
import { MOCK_TENDERS } from '@/lib/mockData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const constituency = searchParams.get('constituency');
  const status = searchParams.get('status');

  let tenders = [...MOCK_TENDERS];
  if (constituency) tenders = tenders.filter(t => t.constituency === constituency);
  if (status) tenders = tenders.filter(t => t.status === status);

  return NextResponse.json({
    success: true,
    count: tenders.length,
    data: tenders,
    scraper: {
      last_run: '2025-07-03T06:00:00Z',
      status: 'completed',
      portals: ['GEM', 'CPPP', 'State eProcure'],
    },
  });
}
