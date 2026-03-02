'use client';

import { Image as ImageIcon, PlusCircle, Users } from 'lucide-react';
import SecureImage from './SecureImage'; 

interface Post {
  id: string;
  caption: string;
  image_path: string;
  created_at: string;
  profiles: { username: string };
}

interface Group {
  id: string;
  name: string;
  description?: string;
}

interface GroupProfileFeedProps {
  group: Group;
  posts: Post[];
  onUploadClick: () => void;
}

export default function GroupProfileFeed({ group, posts, onUploadClick }: GroupProfileFeedProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      
      {/* --- INSTAGRAM-STYLE PROFILE HEADER --- */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/60 p-8 md:p-12 shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Group Avatar (Big Circle) */}
          <div className="h-28 w-28 md:h-36 md:w-36 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 border-4 border-white shadow-lg flex items-center justify-center shrink-0">
            <Users size={48} className="text-blue-300" />
          </div>

          {/* Group Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">{group.name}</h2>
              <button 
                onClick={onUploadClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <PlusCircle size={18} />
                <span>Share Memory</span>
              </button>
            </div>

            {/* Stats row */}
            <div className="flex justify-center md:justify-start gap-6 text-gray-700 font-medium">
              <div><span className="font-bold text-gray-900">{posts.length}</span> posts</div>
              <div><span className="font-bold text-gray-900">Private</span> silo</div>
            </div>

            {/* Description */}
            <p className="text-gray-600 max-w-lg">
              {group.description || "A private space to share memories with your inner circle."}
            </p>
          </div>
        </div>
      </div>

      {/* --- SCROLLING FEED --- */}
      <div className="p-6 md:p-10 flex flex-col items-center">
        <div className="w-full max-w-xl space-y-8 pb-20">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/60 rounded-3xl border border-gray-100 shadow-sm">
              <ImageIcon className="mx-auto h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-800">No memories yet</h3>
              <p className="text-sm text-gray-500 mt-2">Be the first to share a moment in this silo.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="px-5 py-4 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                    {post.profiles.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-gray-800 block">{post.profiles.username}</span>
                    <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <SecureImage imagePath={post.image_path} alt={post.caption || "Family moment"} />
                
                {post.caption && (
                  <div className="p-5 text-sm leading-relaxed">
                    <span className="font-bold text-gray-800 mr-2">{post.profiles.username}</span>
                    <span className="text-gray-600">{post.caption}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}