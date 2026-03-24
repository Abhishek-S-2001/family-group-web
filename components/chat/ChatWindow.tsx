'use client';

import { useRef, useEffect } from 'react';
import { MessageSquare, Smile, Send, ChevronLeft } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatItem from './ChatItem';
import AvatarStack from './AvatarStack';

interface ChatWindowProps {
  displayTitle: string;
  messages: any[];
  currentUserId: string | null;
  newMessage: string;
  isDM: boolean;
  isGlobal: boolean;
  siloId?: string;
  activeChatId?: string;
  members: any[];
  otherChats: any[];
  onMessageChange: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onSelectChat: (id: string) => void;
  onBack: () => void;
}

export default function ChatWindow({
  displayTitle, messages, currentUserId, newMessage, isDM,
  isGlobal, siloId, activeChatId, members, otherChats,
  onMessageChange, onSendMessage, onSelectChat, onBack,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="col-span-1 md:col-span-4 lg:col-span-3 w-full h-full md:h-[calc(100vh-8rem)] bg-white md:rounded-[3rem] shadow-[0_20px_60px_rgba(25,28,30,0.15)] border border-[#f2f4f6] flex flex-col overflow-hidden relative pb-6">

      {/* TOP: Header + Messages + Input */}
      <div className="flex flex-col flex-1 h-[60%] border-b border-[#f2f4f6]">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between z-10 bg-white">
          <div className="flex items-center gap-2">
            {isGlobal ? (
              <button onClick={onBack} className="text-[#777587] hover:text-[#0434c6] -ml-1 mr-1 transition-colors">
                <ChevronLeft size={22} />
              </button>
            ) : (
              <MessageSquare size={20} className="text-[#0434c6]" />
            )}
            <h3 className="text-lg font-extrabold text-[#191c1e] truncate max-w-[150px]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {displayTitle}
            </h3>
          </div>
          {activeChatId === siloId && !isDM && <AvatarStack members={members} />}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 pb-2 pt-4 flex flex-col gap-5 no-scrollbar bg-[#f7f9fb]/30">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-16 h-16 bg-[#e0e3e5] rounded-full flex items-center justify-center text-[#777587] mb-4">
                <MessageSquare size={28} />
              </div>
              <p className="text-[#191c1e] font-extrabold text-sm mb-1">No messages yet</p>
              <p className="text-[#777587] text-xs font-medium">Say hello!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage key={idx} msg={msg} currentUserId={currentUserId} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 pb-4 pt-3 bg-white">
          <form
            onSubmit={onSendMessage}
            className="relative flex items-center bg-[#f7f9fb] border border-[#e0e3e5] rounded-full shadow-sm p-1.5 pr-2 focus-within:border-[#0434c6]/50 transition-colors"
          >
            <button type="button" className="text-[#777587] hover:text-[#0434c6] transition-colors p-2">
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder={isDM ? 'Message...' : 'Message the family...'}
              className="w-full bg-transparent border-none text-sm font-medium text-[#191c1e] placeholder-[#b5b3c3] focus:ring-0 outline-none px-2"
            />
            <button type="submit" className="w-8 h-8 bg-[#0434c6] rounded-full flex items-center justify-center text-white hover:bg-[#3050de] transition-colors">
              <Send size={14} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM: Other Conversations */}
      <div className="flex flex-col h-[40%] px-6 pt-5 bg-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px bg-[#f2f4f6] flex-1" />
          <span className="text-[9px] font-bold text-[#b5b3c3] uppercase tracking-widest">Other Conversations</span>
          <div className="h-px bg-[#f2f4f6] flex-1" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-1 no-scrollbar pb-16">
          {otherChats.length === 0 ? (
            <p className="text-center text-[#b5b3c3] text-xs font-bold mt-4">No other chats yet.</p>
          ) : (
            otherChats.map(chat => (
              <ChatItem key={chat.id} chat={chat} onClick={onSelectChat} size="sm" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}