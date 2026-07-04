import { NextResponse } from 'next/server';
import { MOCK_ISSUES } from '@/lib/mockData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  let issues = [...MOCK_ISSUES];
  if (category) issues = issues.filter(i => i.ai_category === category);
  if (status) issues = issues.filter(i => i.status === status);

  return NextResponse.json({
    success: true,
    count: issues.length,
    data: issues,
  });
}

export async function POST(request) {
  const body = await request.json();
  
  // Simulate AI deduplication
  const similarIssue = MOCK_ISSUES.find(i => {
    const words = body.text?.toLowerCase().split(' ') || [];
    return words.some(w => i.raw_text.toLowerCase().includes(w) && w.length > 4);
  });

  if (similarIssue) {
    return NextResponse.json({
      success: true,
      deduplicated: true,
      similarity: 72,
      existing_issue: similarIssue,
      message: 'Similar issue found. Consider upvoting the existing one.',
    });
  }

  return NextResponse.json({
    success: true,
    deduplicated: false,
    issue_id: `iss-${Date.now()}`,
    message: 'New issue created successfully.',
  });
}
