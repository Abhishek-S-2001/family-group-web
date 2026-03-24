'use client';

import { Edit3 } from 'lucide-react';

interface ProfileHeroProps {
  profile: any;
  displayName: string;
  userHandle: string;
  pronouns: string;
  role: string;
  isUploading: 'avatar' | 'cover' | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => void;
  statsBar: React.ReactNode; // ProfileStatsBar passed as slot
}

export default function ProfileHero({
  profile, displayName, userHandle, pronouns, role,
  isUploading, onFileChange, statsBar,
}: ProfileHeroProps) {
  return (
    <div className="w-full flex flex-col">
      {/* Cover Photo */}
      <div className="group relative h-48 md:h-64 w-full rounded-[2.5rem] overflow-hidden shadow-sm bg-gradient-to-r from-teal-800 to-teal-600">
        {profile?.cover_photo_url && (
          <img
            src={`${profile.cover_photo_url}?t=${Date.now()}`}
            className="w-full h-full object-cover"
            alt="Cover"
          />
        )}
        <label className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
          <input type="file" className="hidden" accept="image/*" onChange={e => onFileChange(e, 'cover')} />
          <div className="bg-white/90 p-3 rounded-full shadow-lg flex items-center gap-2">
            {isUploading === 'cover'
              ? <div className="animate-spin w-5 h-5 border-2 border-[#0434c6] border-t-transparent rounded-full" />
              : <><Edit3 size={18} className="text-[#0434c6]" /><span className="text-xs font-bold text-[#0434c6]">Change Cover</span></>
            }
          </div>
        </label>
      </div>

      {/* Avatar + Name + Stats row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-8 -mt-12 md:-mt-16 gap-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6">

          {/* Avatar */}
          <div className="group relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#f7f9fb] bg-[#e0e3e5] shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {profile?.avatar_url
              ? <img src={`${profile.avatar_url}?t=${Date.now()}`} className="w-full h-full object-cover" alt="Avatar" />
              : <span className="text-4xl md:text-5xl font-extrabold text-[#0434c6] uppercase">{displayName.charAt(0)}</span>
            }
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
              <input type="file" className="hidden" accept="image/*" onChange={e => onFileChange(e, 'avatar')} />
              {isUploading === 'avatar'
                ? <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                : <Edit3 size={24} className="text-white" />
              }
            </label>
          </div>

          {/* Name */}
          <div className="flex flex-col pb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] tracking-tight">{displayName}</h1>
            <p className="text-[#464555] font-bold mt-1 text-sm md:text-base flex items-center gap-2">
              <span className="text-[#0434c6]">{userHandle}</span> • {pronouns} •{' '}
              <span className="text-[#0434c6] font-extrabold">{role}</span>
            </p>
          </div>
        </div>

        {/* Stats popovers slot */}
        {statsBar}
      </div>
    </div>
  );
}