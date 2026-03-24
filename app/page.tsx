'use client';

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MessageSquare, X } from 'lucide-react';
import TopNavbar from '@/components/TopNavbar';
import Sidebar from '@/components/Sidebar';
import SiloChatPanel from '@/components/chat/SiloChatPanel';
import HomeHeader from '@/components/HomeHeader';
import FeedList from '@/components/FeedList';
import { useUser } from '@/lib/hooks/useUser';

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, loading } = useUser();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there';

  return (
    <div className="bg-gradient-to-br from-[#f0f4ff] to-[#f7f9fb] min-h-screen font-sans text-[#191c1e] overflow-hidden">
      <TopNavbar />

      <main className="pt-28 px-8 pb-8 max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 h-screen relative">

        <div className="col-span-1 md:col-span-3 lg:col-span-2">
          <Sidebar />
        </div>

        <section className={`flex flex-col gap-8 overflow-y-auto pb-32 scroll-smooth no-scrollbar transition-all duration-500 ease-in-out ${
          isChatOpen ? 'col-span-1 md:col-span-6 lg:col-span-7' : 'col-span-1 md:col-span-9 lg:col-span-10'
        }`}>
          {!loading && <HomeHeader firstName={firstName} />}
          <FeedList />
        </section>

        {isChatOpen && <SiloChatPanel isGlobal={true} siloName={''} members={[]} />}

        <div className="fixed bottom-10 right-10 flex gap-4 z-50">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-14 h-14 bg-[#0434c6] rounded-full flex items-center justify-center text-white shadow-[0_8px_24px_rgba(4,52,198,0.3)] hover:scale-[1.05] hover:bg-[#3050de] active:scale-[0.95] transition-all"
          >
            {isChatOpen ? <X size={24} /> : <MessageSquare size={24} className="mt-0.5" />}
          </button>
        </div>

      </main>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}