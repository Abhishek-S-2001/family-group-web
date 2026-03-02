import { Search, Bell, UserCircle } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between mb-6 z-10 shrink-0">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          <h1 className="text-2xl font-extrabold tracking-tight">FamSilo</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center bg-gray-100/80 px-4 py-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={16} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search memories..." className="bg-transparent border-none outline-none text-sm w-48" />
        </div>
        <button className="text-gray-500 hover:text-blue-600 transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-gray-500 hover:text-blue-600 transition-colors">
          <UserCircle size={24} />
        </button>
      </div>
    </nav>
  );
}