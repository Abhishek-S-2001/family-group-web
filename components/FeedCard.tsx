'use client';

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { memo } from 'react';

export interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  siloName: string;
  timeAgo: string;
  imageUrl: string;
  imageAlt: string;
  caption: string;
  likes: number;
  comments: number;
}

const jakarta = { fontFamily: '"Plus Jakarta Sans", sans-serif' };
const manrope = { fontFamily: '"Manrope", sans-serif' };

function FeedCard({ post }: { post: FeedPost }) {
  return (
    <article className="bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white">
      
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e0e3e5]">
            <img className="w-full h-full object-cover" src={post.authorAvatar} alt={post.authorName} />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-[#191c1e]" style={jakarta}>{post.authorName}</h4>
            <span className="text-[10px] text-[#3050de] font-extrabold uppercase tracking-widest" style={manrope}>
              {post.siloName}
            </span>
          </div>
        </div>
        <span className="text-xs text-[#777587] font-bold" style={manrope}>{post.timeAgo}</span>
      </div>

      {/* Image */}
      <div className="w-full bg-[#f2f4f6]">
        <img className="w-full object-cover" src={post.imageUrl} alt={post.imageAlt} loading="lazy" />
      </div>

      {/* Footer */}
      <div className="p-8 flex flex-col gap-6">
        <p className="text-[#191c1e] font-medium text-lg leading-relaxed" style={jakarta}>
          {post.caption}
        </p>
        <div className="flex items-center gap-8 pt-2">
          <button className="flex items-center gap-2.5 text-[#464555] hover:text-[#0434c6] transition-colors font-bold text-sm">
            <Heart size={20} /> {post.likes}
          </button>
          <button className="flex items-center gap-2.5 text-[#464555] hover:text-[#0434c6] transition-colors font-bold text-sm">
            <MessageCircle size={20} /> {post.comments} comments
          </button>
          <button className="ml-auto text-[#777587] hover:text-[#0434c6] transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(FeedCard); // prevents re-renders if parent state changes