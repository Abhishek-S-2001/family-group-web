'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Users } from 'lucide-react';

// --- Clean Component Imports ---
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import GroupProfileFeed from '../components/GroupProfileFeed';
import CreateGroupModal from '../components/CreateGroupModal';
import UploadModal from '../components/UploadModal';

interface Group {
  id: string;
  name: string;
  description?: string;
}

interface Post {
  id: string;
  caption: string;
  image_path: string;
  created_at: string;
  profiles: { username: string };
}

export default function Home() {
  const router = useRouter();
  
  // State
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // --- API Calls & Effects ---
  useEffect(() => {
    const token = localStorage.getItem('family_app_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/groups/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroups(response.data);
        if (response.data.length > 0) setActiveGroup(response.data[0]); 
      } catch (error: any) {
        if (error.response?.status === 401) handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [router]);

  useEffect(() => {
    refreshPosts();
  }, [activeGroup]);

  const refreshPosts = async () => {
    const token = localStorage.getItem('family_app_token');
    if (!activeGroup || !token) return;
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/group/${activeGroup.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Failed to refresh posts", error);
    }
  };

  const handleGroupCreated = async () => {
    const token = localStorage.getItem('family_app_token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/groups/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to refresh groups");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('family_app_token');
    router.push('/login');
  };

  // --- Render ---
  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-blue-50">Loading...</div>;

  return (
    <main className="h-screen w-full bg-gradient-to-br from-blue-50 via-[#f0f4fd] to-[#e6eeff] p-4 md:p-6 flex flex-col text-gray-800 overflow-hidden font-sans">
      
      <TopNavbar />

      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        
        <Sidebar 
          groups={groups}
          activeGroup={activeGroup}
          onSelectGroup={setActiveGroup}
          onCreateClick={() => setIsCreateGroupModalOpen(true)}
          onLogout={handleLogout}
        />

        <section className="flex-1 bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl flex flex-col overflow-hidden relative">
          {activeGroup ? (
            <GroupProfileFeed 
              group={activeGroup} 
              posts={posts} 
              onUploadClick={() => setIsUploadModalOpen(true)} 
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Users size={48} className="text-blue-200 mb-4" />
              <p className="text-lg font-medium">Select a Silo to view the feed</p>
            </div>
          )}
        </section>
        
      </div>

      {/* Modals */}
      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen} 
        onClose={() => setIsCreateGroupModalOpen(false)} 
        onSuccess={handleGroupCreated}
      />

      {activeGroup && (
        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          groupId={activeGroup.id}
          onUploadSuccess={refreshPosts}
        />
      )}
      
    </main>
  );
}