'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { KNOWLEDGE_ARTICLES } from '@/lib/knowledge-data';
import { Article, AgeGroup, FitnessGoal } from '@/types';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function KnowledgeHubPage() {
  const { t, lang, setShowAiChat } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedGoal, setSelectedGoal] = useState<string>('all');

  const categories = [
    { key: 'all', label: t.allTopics },
    { key: 'punjabi_indian', label: t.punjabiIndian },
    { key: 'fat_loss', label: t.fatLoss },
    { key: 'muscle_gain', label: t.muscleGain },
    { key: 'nutrition', label: t.macronutrients },
    { key: 'conditions', label: t.conditions },
    { key: 'supplements', label: t.supplements },
    { key: 'mobility', label: t.mobility },
    { key: 'womens_fitness', label: t.womensFitness },
    { key: 'hydration_sleep', label: t.hydrationSleep },
  ];

  const ageGroups: { key: string; label: string }[] = [
    { key: 'all', label: 'All Ages' },
    { key: 'teens', label: 'Teens (13–19)' },
    { key: 'young_adults', label: 'Young Adults (20–35)' },
    { key: 'mid_age', label: 'Mid-Age (36–50)' },
    { key: 'seniors', label: '50+ / Seniors' },
  ];

  const goals: { key: string; label: string }[] = [
    { key: 'all', label: 'All Goals' },
    { key: 'lose_fat', label: 'Fat Loss' },
    { key: 'gain_muscle', label: 'Muscle Gain' },
    { key: 'maintain', label: 'Maintenance' },
    { key: 'general_health', label: 'General Health' },
  ];

  // Instant real-time filtering
  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter((art) => {
      const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
      const matchesAge = selectedAgeGroup === 'all' || art.ageGroups.includes(selectedAgeGroup as AgeGroup);
      const matchesGoal = selectedGoal === 'all' || art.goals.includes(selectedGoal as FitnessGoal);

      if (!matchesCategory || !matchesAge || !matchesGoal) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle =
        art.title.toLowerCase().includes(q) ||
        (art.titleHi && art.titleHi.includes(q)) ||
        (art.titlePa && art.titlePa.includes(q));
      const matchSummary = art.summary.toLowerCase().includes(q);
      const matchContent = art.content.toLowerCase().includes(q);
      const matchTags = art.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchTitle || matchSummary || matchContent || matchTags;
    });
  }, [searchQuery, selectedCategory, selectedAgeGroup, selectedGoal]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Evidence-Based Health Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Nutrition & Exercise Science Hub
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Search scientifically validated guides on Indian diets, fat loss biochemistry, joint protection, hormones, and supplement safety.
        </p>
      </div>

      {/* Search Bar & Instant Filtering Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchArticlesPlaceholder}
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Age Group & Goal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">Filter Age:</span>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              {ageGroups.map((ag) => (
                <option key={ag.key} value={ag.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1">
                  {ag.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">Filter Goal:</span>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              {goals.map((g) => (
                <option key={g.key} value={g.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1">
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          Showing {filteredArticles.length} of {KNOWLEDGE_ARTICLES.length} scientific guides
        </span>
        <button
          onClick={() => setShowAiChat(true)}
          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center space-x-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Can't find an answer? Ask AI Coach</span>
        </button>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching articles found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or reset filters to explore all available guides.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedAgeGroup('all');
              setSelectedGoal('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const displayTitle =
              lang === 'pa' && article.titlePa
                ? article.titlePa
                : lang === 'hi' && article.titleHi
                ? article.titleHi
                : article.title;

            return (
              <div
                key={article.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all group"
              >
                <div className="p-6">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {article.category.replace('_', ' ')}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-emerald-600 transition-colors">
                    <Link href={`/knowledge/${article.slug}`}>{displayTitle}</Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Key Takeaway Teaser */}
                  {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                    <div className="mt-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start space-x-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{article.keyTakeaways[0]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer bar */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/knowledge/${article.slug}`}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
