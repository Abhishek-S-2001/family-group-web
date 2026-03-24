'use client';

interface Member {
  id: string;
  username: string;
  avatar?: string;
}

export default function AvatarStack({ members }: { members: Member[] }) {
  const display = members.slice(0, 3);
  const extra = members.length - 3;

  return (
    <div className="flex items-center -space-x-2.5">
      {display.map((member, i) => (
        <div
          key={member.id}
          className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center overflow-hidden shadow-sm"
          style={{ zIndex: 10 - i }}
        >
          {member.avatar ? (
            <img src={member.avatar} className="w-full h-full object-cover" alt={member.username} />
          ) : (
            <span className="text-[#0434c6] font-extrabold uppercase text-[10px]">
              {member.username?.charAt(0) || 'U'}
            </span>
          )}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-7 h-7 rounded-full border-2 border-white bg-[#e0e3e5] flex items-center justify-center text-[10px] font-bold text-[#464555] z-0">
          +{extra}
        </div>
      )}
    </div>
  );
}