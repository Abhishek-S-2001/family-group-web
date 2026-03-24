'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '@/components/TopNavbar';
import Sidebar from '@/components/Sidebar';
import SiloChatPanel from '@/components/chat/SiloChatPanel';
import ViewProfileModal from '@/components/ViewProfileModal';
import ProfileHero from '@/components/profile/ProfileHero';
import ProfileAbout from '@/components/profile/ProfileAbout';
import ProfileMemories from '@/components/profile/ProfileMemories';
import ProfileStatsBar from '@/components/profile/ProfileStatsBar';
import EditProfileModal from '@/components/profile/EditProfileModal';
import ImageCropModal from '@/components/profile/ImageCropModal';
import { useProfile } from '@/lib/hooks/useProfile';
import { useUnreadMessages } from '@/lib/hooks/useUnreadMessages';
import { MessageCircle, X } from 'lucide-react';
import api from '@/lib/api';

export default function ProfilePage() {
  const { profile, stats, silosList, membersList, isLoading, mutate } = useProfile();
  const { hasUnread } = useUnreadMessages();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<'avatar' | 'cover' | null>(null);

  const [cropModal, setCropModal] = useState<{ image: string; type: 'avatar' | 'cover' } | null>(null);

  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
  const [activeDmName, setActiveDmName] = useState<string | null>(null);

  // Handle file selection → open cropper
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => setCropModal({ image: reader.result as string, type });
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = '';
  };

  // After crop → upload to backend
  const handleCropDone = async (croppedBase64: string, type: 'avatar' | 'cover') => {
    setCropModal(null);
    setIsUploading(type);
    try {
      const res = await api.post('/users/me/image', { image_base64: croppedBase64, type });
      mutate(); // revalidate SWR cache so new image shows immediately
    } catch (e) {
      console.error('Image upload failed', e);
    } finally {
      setIsUploading(null);
    }
  };

  const handleStartDM = (peerId: string, peerName: string) => {
    if (!profile?.id) return;
    const ids = [profile.id, peerId].sort();
    setActiveDmId(`dm_${ids[0]}_${ids[1]}`);
    setActiveDmName(peerName);
    setIsGlobalChatOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0434c6] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Derived display values
  const displayName = profile?.display_name || profile?.username || 'User';
  const userHandle = profile?.username ? `@${profile.username}` : '@user';
  const pronouns = profile?.pronouns || 'He/Him';
  const role = profile?.family_role || 'The Tech Guy';
  const bio = profile?.bio || '';
  const dob = profile?.dob ? new Date(profile.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '';
  const hobbies = profile?.hobbies?.length ? profile.hobbies : [];

  return (
    <div className="bg-gradient-to-br from-[#f0f4ff] to-[#f7f9fb] min-h-screen font-sans text-[#191c1e]">
      <TopNavbar />

      <main className="pt-28 px-8 max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-24">
        <div className="col-span-1 md:col-span-3 lg:col-span-2 relative z-20">
          <Sidebar />
        </div>

        <section className="col-span-1 md:col-span-9 lg:col-span-10 flex flex-col gap-8 relative z-10">
          <ProfileHero
            profile={profile}
            displayName={displayName}
            userHandle={userHandle}
            pronouns={pronouns}
            role={role}
            isUploading={isUploading}
            onFileChange={onFileChange}
            statsBar={
              <ProfileStatsBar
                stats={stats}
                silosList={silosList}
                membersList={membersList}
                onStartDM={handleStartDM}
                onViewProfile={setViewProfileId}
              />
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            <div className="col-span-1 lg:col-span-4">
              <ProfileAbout
                profile={profile}
                bio={bio}
                dob={dob}
                hobbies={hobbies}
                onEditClick={() => setIsEditModalOpen(true)}
              />
            </div>
            <div className="col-span-1 lg:col-span-8">
              <ProfileMemories />
            </div>
          </div>
        </section>
      </main>

      {/* Floating Chat */}
      {isGlobalChatOpen && (
        <div className="fixed top-24 right-8 w-full max-w-[400px] z-[60] shadow-2xl rounded-[3rem] animate-in slide-in-from-right-8 duration-300">
          <SiloChatPanel isGlobal={true} preSelectedChatId={activeDmId} preSelectedChatName={activeDmName} />
        </div>
      )}

      <button
        onClick={() => { setIsGlobalChatOpen(o => !o); setActiveDmId(null); }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#0434c6] rounded-full shadow-[0_10px_40px_rgba(4,52,198,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-[70]"
      >
        {isGlobalChatOpen ? <X size={24} /> : (
          <div className="relative">
            <MessageCircle size={24} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white" />
              </span>
            )}
          </div>
        )}
      </button>

      {/* Modals */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={mutate}
        />
      )}

      {cropModal && (
        <ImageCropModal
          image={cropModal.image}
          type={cropModal.type}
          onDone={handleCropDone}
          onCancel={() => setCropModal(null)}
        />
      )}

      <ViewProfileModal
        userId={viewProfileId}
        isOpen={!!viewProfileId}
        onClose={() => setViewProfileId(null)}
      />
    </div>
  );
}