'use client';

import { Search } from 'lucide-react';
import ChatItem from './ChatItem';

interface ChatInboxProps {
  chats: any[];
  onSelectChat: (id: string) => void;
}

export default function ChatInbox({ chats, onSelectChat }: ChatInboxProps) {
  return (
    <div className="col-span-1 md:col-span-4 lg:col-span-3 w-full h-full md:h-[calc(100vh-8rem)] bg-white md:rounded-[3rem] shadow-[0_20px_60px_rgba(25,28,30,0.15)] border border-[#f2f4f6] flex flex-col overflow-hidden relative">
      
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[#f2f4f6]">
        <h3 className="text-lg font-extrabold text-[#191c1e]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Messages
        </h3>
        <button className="text-[#777587] hover:text-[#0434c6] transition-colors">
          <Search size={18} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-4 no-scrollbar bg-[#f7f9fb]/30">
        {chats.length === 0 ? (
          <p className="text-center text-[#b5b3c3] text-sm font-bold mt-10">Your inbox is empty.</p>
        ) : (
          chats.map(chat => (
            <ChatItem key={chat.id} chat={chat} onClick={onSelectChat} size="md" />
          ))
        )}
      </div>
    </div>
  );
}