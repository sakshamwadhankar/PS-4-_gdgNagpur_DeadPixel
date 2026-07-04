import { NextResponse } from 'next/server';
import { categorizeIssue, scoreSeverity, detectDuplicate } from '@/lib/ollama';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let where = {};
    if (category && category !== 'All') where.aiCategory = category;
    if (status && status !== 'All') where.status = status;

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { priorityScore: 'desc' },
      include: { author: true }
    });

    return NextResponse.json({
      success: true,
      count: issues.length,
      data: issues.map(i => ({
        issue_id: i.id,
        raw_text: i.rawText,
        location_text: i.locationText,
        ai_category: i.aiCategory,
        severity_score: i.severityScore,
        status: i.status,
        vote_count: i.voteCount,
        priority_score: i.priorityScore,
        similar_count: i.similarCount,
        created_at: i.createdAt.toISOString(),
        user_id: i.author.phoneNumber
      })),
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, location, userId } = body;

    if (!text || !location) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Get a default user if none provided (for demo purposes)
    let authorId = userId;
    if (!authorId) {
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: { phoneNumber: '9999999999', postalCode: '440001', isVerified: true }
        });
      }
      authorId = user.id;
    }

    // AI Processing via Ollama
    console.log('Fetching recent issues for deduplication...');
    const recentIssues = await prisma.issue.findMany({
      where: { status: { not: 'Resolved' } },
      select: { id: true, rawText: true },
      take: 20
    });

    console.log('Calling Ollama for deduplication...');
    const duplicateId = await detectDuplicate(text, recentIssues.map(i => ({ id: i.id, text: i.rawText })));

    if (duplicateId) {
      console.log('Duplicate found:', duplicateId);
      const existingIssue = await prisma.issue.findUnique({ where: { id: duplicateId } });
      
      // Increment duplicate count
      await prisma.issue.update({
        where: { id: duplicateId },
        data: { similarCount: existingIssue.similarCount + 1 }
      });

      return NextResponse.json({
        success: true,
        deduplicated: true,
        similarity: 85,
        existing_issue: {
          issue_id: existingIssue.id,
          raw_text: existingIssue.rawText,
          location_text: existingIssue.locationText,
          ai_category: existingIssue.aiCategory
        },
        message: 'Similar issue found. Please upvote the existing one.',
      });
    }

    console.log('Calling Ollama for categorization and severity...');
    const category = await categorizeIssue(text);
    const severity = await scoreSeverity(text);

    // Initial Priority Score = (Votes * 1.5) + (Severity * 2) - (DaysOpen * 0.5)
    // For a new issue, Votes = 1, DaysOpen = 0
    const priorityScore = (1 * 1.5) + (severity * 2);

    const newIssue = await prisma.issue.create({
      data: {
        rawText: text,
        locationText: location,
        aiCategory: category,
        severityScore: severity,
        priorityScore: priorityScore,
        authorId: authorId,
        voteCount: 1, // Author's implicit vote
      }
    });

    return NextResponse.json({
      success: true,
      deduplicated: false,
      issue_id: newIssue.id,
      category,
      severity,
      message: 'New issue created successfully.',
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
