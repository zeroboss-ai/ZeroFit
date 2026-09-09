import { NextResponse } from 'next/server';
import { KNOWLEDGE_ARTICLES } from '@/lib/knowledge-data';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';
  const category = searchParams.get('category') || 'all';
  const ageGroup = searchParams.get('ageGroup') || 'all';
  const goal = searchParams.get('goal') || 'all';

  let filtered = [...KNOWLEDGE_ARTICLES];

  if (category !== 'all') {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (ageGroup !== 'all') {
    filtered = filtered.filter((a) => a.ageGroups.includes(ageGroup as any));
  }

  if (goal !== 'all') {
    filtered = filtered.filter((a) => a.goals.includes(goal as any));
  }

  if (q) {
    filtered = filtered.filter((a) => {
      const matchTitle = a.title.toLowerCase().includes(q) || (a.titleHi && a.titleHi.includes(q)) || (a.titlePa && a.titlePa.includes(q));
      const matchSummary = a.summary.toLowerCase().includes(q);
      const matchContent = a.content.toLowerCase().includes(q);
      const matchTags = a.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchContent || matchTags;
    });
  }

  return NextResponse.json({
    articles: filtered,
    total: filtered.length,
  });
}
