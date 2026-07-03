import React from "react";

const IconPencil = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

export function TrainerProfileMain({ profile, onOpenEdit }: { profile: any; onOpenEdit: () => void }) {
  return (
    <div className="space-y-6">
      {/* About Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative group">
        <button 
          onClick={onOpenEdit}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-[#E84E29] hover:bg-orange-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <IconPencil className="w-4 h-4" />
        </button>
        
        <h2 className="text-lg font-black text-slate-900 mb-4">About</h2>
        <div className="prose prose-sm max-w-none text-slate-600">
          {profile.bio ? (
            <p className="whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
          ) : (
            <p className="italic text-slate-400">No bio provided yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
