'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { KNOWLEDGE_ARTICLES } from '@/lib/knowledge-data';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  BookmarkCheck,
  Share2,
  FileText,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { lang, setShowAiChat } = useApp();

  const article = KNOWLEDGE_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested health guide does not exist or has been relocated.
        </p>
        <Link
          href="/knowledge"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Hub</span>
        </Link>
      </div>
    );
  }

  const title =
    lang === 'pa' && article.titlePa
      ? article.titlePa
      : lang === 'hi' && article.titleHi
      ? article.titleHi
      : article.title;

  const relatedArticles = KNOWLEDGE_ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category
  ).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/knowledge"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Hub</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAiChat(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI about this</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            {article.category.replace('_', ' ')}
          </span>
          <span className="flex items-center space-x-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTimeMinutes} min read</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center space-x-1 text-slate-500">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{article.author}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {article.summary}
        </p>
      </header>

      {/* Key Takeaways Box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
          <h3 className="text-sm uppercase font-bold tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center space-x-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Key Scientific Takeaways</span>
          </h3>
          <ul className="space-y-2">
            {article.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Body */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 text-sm sm:text-base">
        {article.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2
                key={index}
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-100 dark:border-slate-800"
              >
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
            return (
              <div
                key={index}
                className="pl-4 border-l-2 border-emerald-500 my-2 space-y-1 text-slate-700 dark:text-slate-300"
              >
                {paragraph.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
            );
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </div>

      {/* Citations & Evidence section */}
      {article.citations && article.citations.length > 0 && (
        <div className="mt-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Scientific Citations & Literature</span>
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400">
            {article.citations.map((cite, idx) => (
              <li key={idx} className="italic">
                {cite}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Mandatory Medical Disclaimer on Health Article */}
      <MedicalDisclaimer />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Related Guides in this Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/knowledge/${rel.slug}`}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition-colors block"
              >
                <div className="text-[11px] font-bold text-emerald-600 uppercase mb-1">
                  {rel.category.replace('_', ' ')}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rel.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
