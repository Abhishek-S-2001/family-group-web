'use client';

import { useState, useEffect } from 'react';
import { X, Mail, ArrowRight, Search, User as UserIcon, CheckCircle2, Send, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import ViewProfileModal from './ViewProfileModal';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  siloId: string;
}

// Quick type for our search results
type UserResult = { id: string; username: string; avatar?: string };

export default function InviteMemberModal({ isOpen, onClose, siloId }: InviteMemberModalProps) {
  // UI States
  const [mode, setMode] = useState<'search' | 'email'>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Profile Preview State
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  // Email States
  const [email, setEmail] = useState('');

  // --- REAL-TIME DEBOUNCED SEARCH (same pattern as ChatInbox) ---
  // ⚠️ Must be ABOVE the early return to satisfy Rules of Hooks
  useEffect(() => {
    if (!isOpen || !searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);

    const timeout = setTimeout(async () => {
      try {
        const response = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
        const users = response.data.users || [];
        setSearchResults(
          users.map((u: any) => ({
            id: u.id,
            username: u.username,
            avatar: u.avatar_url,
          }))
        );
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, isOpen]);

  if (!isOpen) return null;

  // --- IN-APP DIRECT INVITE ---
  const handleDirectInvite = async (userId: string) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post(`/silos/${siloId}/invite`, { user_id: userId });
      setSuccess(true);
      setTimeout(() => resetAndClose(), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send invite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- EMAIL FALLBACK INVITE ---
  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post(`/silos/${siloId}/invites`, { email, role: 'member' });
      setSuccess(true);
      setTimeout(() => resetAndClose(), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send email invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccess(false);
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);
    setMode('search');
    setEmail('');
    onClose();
  };

  return (
    <>
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191c1e]/30 backdrop-blur-md transition-all"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-[440px] bg-white p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(25,28,30,0.15)] relative border-none flex flex-col transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 w-10 h-10 bg-[#f2f4f6] text-[#777587] rounded-full flex items-center justify-center hover:bg-[#e0e3e5] hover:text-[#191c1e] transition-colors"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Header Area */}
        <div className="mb-6 pr-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-[#0434c6]">
            {mode === 'search' ? <Search size={24} /> : <Mail size={24} />}
          </div>
          <h2 className="text-3xl font-extrabold text-[#191c1e] tracking-tight mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {mode === 'search' ? 'Find Family' : 'Invite via Email'}
          </h2>
          <p className="text-[#464555] font-medium text-sm leading-relaxed" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {mode === 'search'
              ? 'Search for a username to add them directly to your vault.'
              : 'Send a secure magic link to invite them to this Silo.'}
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 mt-4">
            <CheckCircle2 size={32} className="text-green-600 mb-2" />
            <span className="font-extrabold text-lg" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Invite Sent! ✨</span>
            <span className="text-sm font-medium">They will be notified shortly.</span>
          </div>
        ) : (
          <>
            {/* --------------------------- */}
            {/* MODE 1: SEARCH FOR USERNAME */}
            {/* --------------------------- */}
            {mode === 'search' && (
              <div className="flex flex-col gap-4">
                {/* Real-time search input — no submit button */}
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setError(''); }}
                    className="w-full px-5 py-4 pl-12 pr-10 bg-[#f2f4f6] border-none rounded-2xl focus:ring-2 focus:ring-[#0434c6]/20 focus:bg-[#f7f9fb] transition-all text-[#191c1e] outline-none font-medium placeholder-[#777587]"
                    placeholder="e.g. sarah_miller"
                  />
                  <Search size={20} className="absolute left-4 top-4 text-[#777587]" />
                  {isSearching && (
                    <Loader2 size={18} className="absolute right-4 top-4 text-[#0434c6] animate-spin" />
                  )}
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="text-[#93000a] text-sm text-center bg-[#ffdad6] p-3 rounded-xl font-bold">
                    {error}
                  </div>
                )}

                {/* Search Results Area */}
                {hasSearched && (
                  <div className="flex flex-col gap-3">
                    {searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 pr-4 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]/50">
                          {/* Clickable avatar + name opens profile */}
                          <button
                            onClick={() => setViewingUserId(user.id)}
                            className="flex items-center gap-3 text-left hover:opacity-75 transition-opacity"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#e0e3e5] overflow-hidden flex-shrink-0">
                              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserIcon className="m-2 text-[#777587]" />}
                            </div>
                            <span className="font-extrabold text-[#191c1e] text-sm" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>@{user.username}</span>
                          </button>
                          <button
                            onClick={() => handleDirectInvite(user.id)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 bg-[#0434c6] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#3050de] transition-colors disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            Invite
                          </button>
                        </div>
                      ))
                    ) : (
                      // No Users Found -> Fallback UI
                      <div className="flex flex-col items-center justify-center p-6 bg-[#f7f9fb] rounded-2xl text-center gap-3 border border-[#e0e3e5]/50">
                        <span className="text-sm font-bold text-[#464555]">No user found matching "{searchQuery}"</span>
                        <button
                          onClick={() => { setMode('email'); setEmail(searchQuery.includes('@') ? searchQuery : ''); }}
                          className="flex items-center gap-2 text-[#0434c6] font-bold text-sm hover:underline"
                        >
                          <Mail size={16} /> Invite via Email instead
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --------------------------- */}
            {/* MODE 2: EMAIL FALLBACK FORM */}
            {/* --------------------------- */}
            {mode === 'email' && (
              <form onSubmit={handleEmailInvite} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#464555] ml-1" style={{ fontFamily: '"Manrope", sans-serif' }}>Email Address</label>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 pl-12 bg-[#f2f4f6] border-none rounded-xl focus:ring-2 focus:ring-[#0434c6]/20 focus:bg-[#f7f9fb] transition-all text-[#191c1e] outline-none font-medium placeholder-[#777587]"
                      placeholder="name@family.com"
                    />
                    <Mail size={20} className="absolute left-4 top-4 text-[#777587]" />
                  </div>
                </div>

                {error && (
                  <div className="text-[#93000a] text-sm text-center bg-[#ffdad6] p-3 rounded-xl font-bold border-none mt-2">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setMode('search')}
                    className="flex-1 py-4 bg-[#f2f4f6] text-[#464555] font-extrabold rounded-full hover:bg-[#e0e3e5] transition-all border-none"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="flex-[2] py-4 bg-gradient-to-br from-[#0434c6] to-[#3050de] text-white font-extrabold rounded-full shadow-[0_10px_25px_rgba(4,52,198,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-none"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    {isLoading ? 'Sending...' : 'Send Invite'}
                    {!isLoading && <ArrowRight size={18} />}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>

    {/* Profile Preview — rendered on top of InviteMemberModal */}
    <ViewProfileModal
      userId={viewingUserId}
      isOpen={!!viewingUserId}
      onClose={() => setViewingUserId(null)}
    />
    </>
  );
}