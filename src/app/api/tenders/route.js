import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const constituency = searchParams.get('constituency');
    const status = searchParams.get('status');

    let where = {};
    if (constituency && constituency !== 'All') where.constituency = constituency;
    if (status && status !== 'All') where.status = status;

    const tenders = await prisma.tender.findMany({
      where,
      orderBy: { deadline: 'asc' }
    });

    return NextResponse.json({
      success: true,
      count: tenders.length,
      data: tenders.map(t => ({
        tender_id: t.id,
        portal_tender_id: t.portalTenderId,
        title: t.title,
        department: t.department,
        estimated_value: t.estimatedValue,
        deadline: t.deadline.toISOString(),
        portal_url: t.portalUrl,
        source_portal: t.sourcePortal,
        constituency: t.constituency,
        status: t.status,
        category: t.category,
        description: t.description,
        scraped_at: t.scrapedAt.toISOString(),
      })),
      scraper: {
        last_run: new Date().toISOString(),
        status: 'completed',
        portals: ['GEM', 'CPPP', 'State eProcure'],
      },
    });
  } catch (error) {
    console.error('Error fetching tenders:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error', stack: error.stack }, { status: 500 });
  }
}
