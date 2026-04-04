'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useProfile } from '@/lib/hooks/useProfile';
import api from '@/lib/axios';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function TermsGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, isLoading, mutate } = useProfile();
  const [isAccepting, setIsAccepting] = useState(false);

  // Do not block public or unauthenticated routes
  if (pathname === '/login' || pathname === '/join' || pathname === '/docs') {
    return <>{children}</>;
  }

  // If still fetching the profile, we can just show the children for a split second 
  // or a loading state. Showing children is smoother for the UI until profile returns.
  if (isLoading || !profile) {
    return <>{children}</>;
  }

  // If terms are already accepted, render children normally
  if (profile.terms_accepted) {
    return <>{children}</>;
  }

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await api.post('/users/me/accept-terms');
      // Immediately tell SWR that terms are accepted so it removes the modal
      mutate();
    } catch (error) {
      console.error('Failed to accept terms', error);
      setIsAccepting(false);
    }
  };

  return (
    <>
      {/* Background Content (blurred and non-interactive) */}
      <div className="pointer-events-none select-none blur-sm opacity-50 h-screen overflow-hidden">
        {children}
      </div>

      {/* Persistent Terms Overlay */}
      <div className="fixed inset-0 z-[999] bg-[#191c1e]/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          
          <div className="w-16 h-16 bg-[#0434c6]/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={32} className="text-[#0434c6]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1e] tracking-tight mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Terms & Conditions
          </h2>

          <div className="bg-[#f2f4f6] text-[#464555] p-5 rounded-2xl text-sm font-medium mb-8 text-left h-48 overflow-y-auto border border-[#e0e3e5] leading-relaxed">
            <p className="mb-4">
              <strong className="text-[#191c1e] text-base">Welcome to FamSilo! 👋</strong>
            </p>
            <p className="mb-3">
              By using this application, you acknowledge and agree to the following terms:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-[#464555]">
              <li><strong>Practice Project:</strong> This platform is a portfolio and practice project designed for educational and demonstration purposes. It is not a commercial product.</li>
              <li><strong>Data Privacy:</strong> While we aim to keep things secure, please do not upload highly sensitive, personal, or confidential information to this platform.</li>
              <li><strong>Service Availability:</strong> The app may experience downtime, data resets, or feature changes without prior notice as it is actively under development.</li>
              <li><strong>Respectful Use:</strong> Be kind and respectful to other members in your silos.</li>
            </ul>
            <p>
              By clicking "I Accept" below, you confirm that you understand the educational nature of this project.
            </p>
          </div>

          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full py-4 bg-gradient-to-br from-[#0434c6] to-[#3050de] text-white font-extrabold rounded-full shadow-[0_10px_25px_rgba(4,52,198,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-none"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            {isAccepting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Accepting...
              </>
            ) : (
              'I Accept & Continue'
            )}
          </button>

        </div>
      </div>
    </>
  );
}
