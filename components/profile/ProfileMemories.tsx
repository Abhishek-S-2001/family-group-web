'use client';

export default function ProfileMemories() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-extrabold text-[#191c1e]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        Recent Memories
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 relative h-64 rounded-[2rem] overflow-hidden group shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt="Memory"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Nainital • Oct 2025</p>
              <h3 className="text-white text-lg font-extrabold">Family Hiking Trip</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}