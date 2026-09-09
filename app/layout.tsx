import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChatModal from '@/components/AIChatModal';

export const metadata: Metadata = {
  title: 'Zero FIT — Evidence-Based Fitness & Nutrition Platform',
  description:
    'Science-backed personalized diet and workout guidance, Indian & Punjabi high-protein nutrition, joint-safe workouts for 45+, interactive calculators, and full-text health knowledge hub.',
  keywords: [
    'Zero FIT',
    'Punjabi diet plan',
    'Indian bodybuilding',
    'High protein vegetarian',
    'BMR calculator Mifflin St Jeor',
    'PCOS diet',
    'Joint safe workout',
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <AIChatModal />
        </AppProvider>
      </body>
    </html>
  );
}
