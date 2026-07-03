import { CloseIcon, CameraIcon } from "./MaterialIcons";

export default function EditMaterialModal({ 
  editingMaterial, 
  setEditingMaterial, 
  handleSaveEdit 
}: { 
  editingMaterial: any, 
  setEditingMaterial: (m: any) => void, 
  handleSaveEdit: (e: React.FormEvent) => void 
}) {
  if (!editingMaterial) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900">Edit Material</h3>
          <button onClick={() => setEditingMaterial(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSaveEdit} className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={editingMaterial.title}
              onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Category</label>
              <input
                type="text"
                value={editingMaterial.category}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, category: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editingMaterial.price}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, price: parseFloat(e.target.value) })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Thumbnail</label>
            <div className="relative h-32 w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
              <img src={editingMaterial.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <div className="flex flex-col items-center text-white">
                  <CameraIcon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Change Image</span>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={() => setEditingMaterial(null)} className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-[#E84E29] hover:bg-[#d03d1c] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-md transition-all">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
