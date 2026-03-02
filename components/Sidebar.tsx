import { Users, PlusCircle, LogOut } from 'lucide-react';

interface Group {
  id: string;
  name: string;
}

interface SidebarProps {
  groups: Group[];
  activeGroup: Group | null;
  onSelectGroup: (group: Group) => void;
  onCreateClick: () => void;
  onLogout: () => void;
}

export default function Sidebar({ groups, activeGroup, onSelectGroup, onCreateClick, onLogout }: SidebarProps) {
  return (
    <aside className="w-72 bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm rounded-2xl flex flex-col p-5 shrink-0 z-10">
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2 mt-2">Your Silos</p>
        
        {groups.length === 0 ? (
          <p className="text-sm text-gray-500 italic ml-2 mb-4">No groups yet.</p>
        ) : (
          groups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeGroup?.id === group.id 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-[1.02]' 
                  : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-blue-600'
              }`}
            >
              <Users size={18} className={activeGroup?.id === group.id ? 'text-blue-100' : 'text-gray-400'} />
              <span>{group.name}</span>
            </button>
          ))
        )}

        <button 
          onClick={onCreateClick}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all duration-200 mt-6 border border-dashed border-gray-300 hover:border-blue-300"
        >
          <PlusCircle size={18} />
          <span>Create New Silo</span>
        </button>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}