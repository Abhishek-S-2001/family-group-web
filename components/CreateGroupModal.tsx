'use client';

import { useState } from 'react';
import axios from 'axios';
import { X, Users } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGroupModal({ isOpen, onClose, onSuccess }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('family_app_token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      setDescription('');
      onSuccess(); // Tells the parent to refresh the sidebar
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Create New Silo
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Silo Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="e.g. The Smith Family"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              placeholder="What is this space for?"
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Creating...' : 'Create Silo'}
          </button>
        </form>
      </div>
    </div>
  );
}