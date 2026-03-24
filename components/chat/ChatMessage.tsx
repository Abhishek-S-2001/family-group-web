'use client';

import { CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  msg: any;
  currentUserId: string | null;
}

export default function ChatMessage({ msg, currentUserId }: ChatMessageProps) {
  const isMe = currentUserId && (msg.user_id === currentUserId || msg.sender_id === currentUserId);
  const senderName = isMe ? 'You' : (msg.profiles?.username || msg.username || msg.sender || 'Family Member');
  const timestamp = msg.created_at || msg.timestamp;

  return (
    <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[75%] ${isMe ? 'items-end self-end' : 'items-start'}`}>
      <span className={`text-[10px] font-bold text-[#b5b3c3] ${isMe ? 'mr-2' : 'ml-2'}`}>
        {senderName}
      </span>

      <div className={`px-5 py-3.5 rounded-[1.25rem] text-sm font-medium leading-relaxed shadow-sm ${
        isMe
          ? 'bg-[#0434c6] text-white rounded-tr-sm shadow-md'
          : 'bg-white border border-[#e0e3e5] text-[#191c1e] rounded-tl-sm'
      }`}>
        {msg.content || msg.text}
      </div>

      <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'mr-2' : 'ml-2'}`}>
        <span className="text-[9px] font-bold text-[#b5b3c3]">
          {timestamp
            ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now'}
        </span>
        {isMe && <CheckCheck size={12} className="text-[#0434c6]" />}
      </div>
    </div>
  );
}