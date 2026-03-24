'use client';

import { MapPin, Calendar, Edit3 } from 'lucide-react';

interface ProfileAboutProps {
  profile: any;
  bio: string;
  dob: string;
  hobbies: string[];
  onEditClick: () => void;
}

export default function ProfileAbout({ profile, bio, dob, hobbies, onEditClick }: ProfileAboutProps) {
  return (
    <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(25,28,30,0.04)] border border-white/60 relative group">
      <button
        onClick={onEditClick}
        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#777587] hover:text-[#0434c6] opacity-0 group-hover:opacity-100 transition-all"
      >
        <Edit3 size={14} />
      </button>

      <h3 className="text-lg font-extrabold text-[#191c1e] mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>About Me</h3>
      <p className="text-[#464555] font-medium text-sm leading-relaxed mb-8 whitespace-pre-wrap">{bio}</p>

      <div className="flex flex-col gap-5 mb-8">
        {profile?.show_location && profile?.location && (
          <div className="flex items-center gap-4 text-[#464555]">
            <MapPin size={18} className="text-[#b5b3c3]" />
            <span className="text-sm font-bold">{profile.location}</span>
          </div>
        )}
        {profile?.show_dob && profile?.dob && (
          <div className="flex items-center gap-4 text-[#464555]">
            <Calendar size={18} className="text-[#b5b3c3]" />
            <span className="text-sm font-bold">Born {dob}</span>
          </div>
        )}
      </div>

      {profile?.show_hobbies && hobbies.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-[#777587] uppercase tracking-widest">Hobbies & Interests</h4>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, idx) => (
              <span key={idx} className="px-4 py-2 rounded-full bg-[#f2f4f6] text-[#464555] text-xs font-extrabold border border-white hover:bg-white hover:text-[#0434c6] transition-colors cursor-default shadow-sm">
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}