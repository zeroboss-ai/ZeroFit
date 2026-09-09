'use client';

import React, { useState } from 'react';
import { Dumbbell, ShieldAlert, Heart, Mail, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function AboutPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Brand Mission Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Dumbbell className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          About ZERO FIT
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          The evidence-based fitness and nutrition platform built to bridge modern sports science with authentic Indian and Punjabi lifestyles.
        </p>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            1. Zero Extreme Crash Diets
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Starvation diets destroy metabolic rate and trigger binge cycles. We prescribe modest 350–500 kcal deficits that protect thyroid function and lean muscle mass.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            2. Desi Nutrition Done Right
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            You don't need to give up your cultural foods. We optimize traditional staples like roti, dal, rajma, and paneer with portion awareness and smart protein density.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            3. Longevity Across All Ages
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            From teenagers building bone mass to adults managing PCOS, and seniors 50+ safeguarding joint health, fitness must adapt to your life stage.
          </p>
        </div>
      </div>

      {/* Detailed Legal & Medical Disclaimer Section */}
      <div id="disclaimer" className="p-8 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-4">
        <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300">
          <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <h2 className="text-lg font-black uppercase tracking-wider">
            Clinical & Legal Notice
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed space-y-3">
          <p>
            <strong>1. General Educational Purpose Only:</strong> All content, tools, meal plans, workout routines, and calculator outputs provided by Zero FIT are intended exclusively for general educational and informational purposes. None of the content constitutes medical advice, clinical diagnosis, or a formal prescription.
          </p>
          <p>
            <strong>2. Physician & Dietitian Consultation:</strong> Always consult with a licensed physician, registered dietitian, or qualified healthcare professional before beginning any new exercise regimen or adopting significant dietary modifications—particularly if you have pre-existing conditions such as Type 1 or 2 diabetes, hypothyroidism, cardiovascular disorders, severe hypertension, or joint pathology.
          </p>
          <p>
            <strong>3. Exercise Safety & Assumption of Risk:</strong> Physical resistance training and cardiovascular exertion carry inherent risks of injury. Ensure you execute exercises within your safe physical capacity, warm up adequately, and terminate any movement that elicits sharp or abnormal joint pain.
          </p>
        </div>
      </div>

      {/* Contact & Coaching Inquiry */}
      <div id="contact" className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Contact & Coaching Feedback
            </h3>
            <p className="text-xs text-slate-500">
              Have questions about nutrition protocols, corporate workshops, or courses?
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
              Message Received!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Thank you for contacting Zero FIT. Our coaching team will get back to you within 24–48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aman Singh"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Your Inquiry or Feedback
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about workout modifications, Indian high-protein meal advice, or coaching..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
