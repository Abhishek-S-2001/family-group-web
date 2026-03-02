'use client';

import { useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { X, UploadCloud } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onUploadSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, groupId, onUploadSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('family_app_token');
      
      // 1. Get the authenticated user from Supabase directly to ensure ownership
      const { data: userData, error: userError } = await supabase.auth.getUser(token || '');
      if (userError || !userData.user) throw new Error("Authentication failed");

      // 2. Create a unique filename and upload directly to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userData.user.id}/${fileName}`; // Organizes files by user ID inside the bucket

      const { error: uploadError } = await supabase.storage
        .from('group-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Tell the Python API to save the post record in the database
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/`,
        {
          group_id: groupId,
          image_path: filePath,
          caption: caption,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset and close
      setFile(null);
      setCaption('');
      onUploadSuccess();
      onClose();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Share a Memory</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-4">
          
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
            <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              placeholder="What's happening in this photo?"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading securely...' : 'Post to Silo'}
          </button>

        </form>
      </div>
    </div>
  );
}