import { NextResponse } from 'next/server';
import { KNOWLEDGE_ARTICLES } from '@/lib/knowledge-data';
import { askGeminiCoach } from '@/lib/gemini';
import { getSessionUser } from '@/lib/auth';
import { connectDB, memoryStore } from '@/lib/db';
import { Profile } from '@/lib/models';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, lang = 'en', profile: clientProfile } = body;
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const query = message.toLowerCase();

    // Check relevant knowledge articles for grounded recommendations
    const matchedArticle = KNOWLEDGE_ARTICLES.find((art) => {
      return (
        art.tags.some((tag) => query.includes(tag.toLowerCase())) ||
        art.title.toLowerCase().split(' ').some((word) => word.length > 3 && query.includes(word))
      );
    });

    // Try to get profile
    let activeProfile = clientProfile;
    const user = await getSessionUser();
    if (user) {
      const db = await connectDB();
      if (db) {
        activeProfile = await Profile.findOne({ userId: user.id });
      } else {
        activeProfile = memoryStore.profiles.get(user.id);
      }
    }

    // Call live Gemini AI Coach
    const geminiReply = await askGeminiCoach(message, activeProfile, lang);

    return NextResponse.json({
      reply: geminiReply,
      relatedArticleSlug: matchedArticle?.slug,
      disclaimer:
        'Educational guidance only. Not medical advice. Always consult a healthcare professional for clinical concerns.',
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process AI query' }, { status: 500 });
  }
}
