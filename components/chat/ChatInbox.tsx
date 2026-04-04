'use client';

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/axios';
import ChatItem, { ChatData } from './ChatItem';
import { useChat } from '@/lib/context/ChatContext';

const fetcher = (url: string) => api.get(url).then(r => r.data);

interface ChatInboxProps {
  chats?: ChatData[];
  onSelectChat?: (id: string) => void;
}

export default function ChatInbox({ chats: propChats, onSelectChat }: ChatInboxProps) {
  const { openChatWith } = useChat();
  
  // Search States
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Background Inbox Fetching
  const { data: fetchedChats = [] } = useSWR(
    propChats === undefined ? '/chat/inbox' : null,
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 15000 }
  );

  const chats = propChats ?? fetchedChats;

  // --- THE REAL-TIME DEBOUNCE MAGIC ---
  useEffect(() => {
    // If the search bar is empty, clear results and stop
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Wait 300ms after the user stops typing before hitting the API
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await api.get(`/chat/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data.results || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    // Cleanup the timeout if the user types again before 300ms is up!
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click Handlers
  const handleChatClick = (chat: ChatData) => {
    if (onSelectChat) onSelectChat(chat.id);
    else openChatWith(chat.id, chat.name);
  };

  const handleStartNewDM = (user: any) => {
    // Construct a consistent DM ID (e.g., sort the IDs alphabetically)
    // For now, we'll just trigger the context. The backend should handle room creation.
    openChatWith(`new_dm_${user.id}`, user.display_name || user.username);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      
      {/* Header with Expanding Search */}
      <div className="p-4 md:p-6 pb-4 flex items-center justify-between border-b border-[#f2f4f6] min-h-[72px]">
        {isSearchActive ? (
          <div className="flex-1 flex items-center bg-[#f7f9fb] rounded-full px-3 py-1.5 border border-[#e0e3e5] focus-within:border-[#0434c6]/50 transition-colors">
            <Search size={16} className="text-[#b5b3c3] mr-2" />
            <input
              autoFocus
              type="text"
              placeholder="Search family..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-[#191c1e] placeholder-[#b5b3c3]"
            />
            {isSearching ? (
              <Loader2 size={16} className="text-[#0434c6] animate-spin ml-2" />
            ) : (
              <button 
                onClick={() => {
                  setIsSearchActive(false);
                  setSearchQuery('');
                }} 
                className="text-[#777587] hover:text-red-500 ml-2"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <>
            <h3 className="text-lg font-extrabold text-[#191c1e]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Messages
            </h3>
            <button 
              onClick={() => setIsSearchActive(true)}
              className="text-[#777587] hover:text-[#0434c6] transition-colors p-2 rounded-full hover:bg-gray-50"
            >
              <Search size={18} />
            </button>
          </>
        )}
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-4 no-scrollbar bg-[#f7f9fb]/30">
        
        {isSearchActive && searchQuery.trim() !== '' ? (
          /* --- SEARCH RESULTS --- */
          searchResults.length === 0 && !isSearching ? (
            <p className="text-center text-[#b5b3c3] text-sm font-bold mt-10">No matches found.</p>
          ) : (
            // Notice how we just reuse ChatItem! It handles the 'dm' vs 'group' styling automatically.
            searchResults.map((result: ChatData) => (
              <ChatItem 
                key={result.id} 
                chat={result} 
                onClick={() => handleChatClick(result)} 
                size="md" 
              />
            ))
          )
        ) : (
          /* --- NORMAL INBOX --- */
          chats.length === 0 ? (
            <p className="text-center text-[#b5b3c3] text-sm font-bold mt-10">Your inbox is empty.</p>
          ) : (
            chats.map((chat: ChatData) => (
              <ChatItem 
                key={chat.id} 
                chat={chat} 
                onClick={() => handleChatClick(chat)} 
                size="md" 
              />
            ))
          )
        )}
      </div>
    </div>
  );
}