import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { dbService } from "../services/db";
import { Category, Photo } from "../types";
import { LogOut, Plus, Trash2, Edit2, Image, LayoutGrid, X, BarChart2, Search, Filter, Clock } from "lucide-react";
import { cn } from "../lib/utils";
import { Modal } from "../components/Modal";

export const AdminPanel: React.FC = () => {
  const { user, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "photos" | "categories">("dashboard");

  const [categories, setCategories] = useState<Category[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const unsubCat = dbService.subscribeToCategories(setCategories);
    const unsubPhoto = dbService.subscribeToPhotos(setPhotos);
    return () => {
      unsubCat();
      unsubPhoto();
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row text-neutral-100 font-sans select-none">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col min-h-[50vh] md:min-h-screen p-4 gap-4">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg leading-tight">Admin<span className="text-indigo-400">.Panel</span></span>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Dashboard</p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              activeTab === "dashboard" ? "bg-neutral-900 border border-neutral-800 text-indigo-400" : "text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 border border-transparent"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              activeTab === "photos" ? "bg-neutral-900 border border-neutral-800 text-indigo-400" : "text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 border border-transparent"
            )}
          >
            <Image className="w-4 h-4" />
            Photos
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              activeTab === "categories" ? "bg-neutral-900 border border-neutral-800 text-indigo-400" : "text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 border border-transparent"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Categories
          </button>
        </nav>

        <div className="mt-auto border-t border-neutral-800 pt-4">
          <div className="px-2 mb-4 text-xs text-neutral-500 truncate font-mono">{user?.email}</div>
          <button
            onClick={logOut}
            className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-xl text-sm font-bold text-red-400 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all bg-neutral-900"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {activeTab === "dashboard" && <DashboardTab photos={photos} categories={categories} />}
        {activeTab === "categories" && <CategoriesManager categories={categories} photos={photos} />}
        {activeTab === "photos" && <PhotosManager photos={photos} categories={categories} />}
      </main>
    </div>
  );
};

const DashboardTab: React.FC<{ photos: Photo[], categories: Category[] }> = ({ photos, categories }) => {
  return (
    <div className="space-y-6">
       <div>
         <h2 className="text-2xl font-bold tracking-tight">Overview Dashboard</h2>
         <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Key metrics for your gallery</p>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col gap-2">
           <div className="flex items-center justify-between">
             <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Total Photos</span>
             <Image className="w-5 h-5 text-indigo-400" />
           </div>
           <span className="text-3xl font-bold text-neutral-100">{photos.length}</span>
         </div>
         <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col gap-2">
           <div className="flex items-center justify-between">
             <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Total Categories</span>
             <LayoutGrid className="w-5 h-5 text-indigo-400" />
           </div>
           <span className="text-3xl font-bold text-neutral-100">{categories.length}</span>
         </div>
         <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col gap-2">
           <div className="flex items-center justify-between">
             <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Latest Syncs</span>
             <Clock className="w-5 h-5 text-indigo-400" />
           </div>
           <span className="text-3xl font-bold text-neutral-100">{photos.slice(-5).length}</span>
         </div>
       </div>
       
       <div className="mt-8">
         <h3 className="text-lg font-bold tracking-tight mb-4">Recently Added Photos</h3>
         <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden text-neutral-100 divide-y divide-neutral-800">
           {photos.slice(-5).reverse().map(p => {
             const cat = categories.find(c => c.id === p.category_id);
             return (
               <div key={p.id} className="p-4 flex items-center justify-between hover:bg-neutral-800/50 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-neutral-800 rounded-xl overflow-hidden shrink-0">
                     <img src={`/api/photos/view/${p.drive_id}`} alt={p.title} className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-neutral-200">{p.title}</p>
                     <p className="text-xs text-neutral-500">{cat?.name || "Uncategorized"} • {p.drive_id.substring(0,8)}...</p>
                   </div>
                 </div>
               </div>
             )
           })}
           {photos.length === 0 && (
             <div className="p-8 text-center text-sm text-neutral-500">No photos available yet.</div>
           )}
         </div>
       </div>
    </div>
  )
}

const CategoriesManager: React.FC<{ categories: Category[], photos: Photo[] }> = ({ categories, photos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setIcon("");
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setIcon(cat.icon);
    setEditingId(cat.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) return;
    
    try {
      if (editingId) {
        await dbService.updateCategory(editingId, name, icon);
      } else {
        const id = Date.now().toString(); // simple ID gen
        await dbService.createCategory(id, name, icon);
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save category. Make sure you have permission and the data is valid.");
    }
  };

  return (
    <div className="max-w-4xl max-auto space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold tracking-tight">Manage Categories</h2>
           <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Organize your library</p>
         </div>
         <button
           onClick={() => setIsModalOpen(true)}
           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
         >
           <Plus className="w-4 h-4" />
           Add Category
         </button>
       </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={resetForm} 
        title={editingId ? "Edit Category" : "New Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Name</label>
              <input 
                autoFocus
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-neutral-600 text-neutral-100 outline-none text-sm"
                placeholder="e.g., Nature"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Icon (Emoji)</label>
              <input 
                type="text" 
                value={icon} 
                onChange={e => setIcon(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-neutral-600 text-neutral-100 outline-none text-sm"
                placeholder="e.g., 🌲"
                required
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
              Save Category
            </button>
          </div>
        </form>
      </Modal>

       <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden text-neutral-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
         {categories.map(cat => {
           const count = photos.filter(p => p.category_id === cat.id).length;
           return (
             <div key={cat.id} className="p-4 bg-neutral-800/50 rounded-xl flex items-center justify-between border border-neutral-700/50 gap-2 group">
               <div className="flex items-center gap-3">
                 <div className="text-2xl leading-none bg-neutral-800 p-2 rounded-lg">{cat.icon}</div>
                 <div className="flex flex-col items-start gap-1">
                   <span className="text-sm font-bold text-neutral-200">{cat.name}</span>
                   <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">{count} photos</span>
                 </div>
               </div>
               <div className="flex items-center gap-1">
                 <button 
                   onClick={() => handleEdit(cat)}
                   className="p-2 text-neutral-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                 >
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => {
                     if (confirm(`Are you sure you want to delete this category? There are ${count} photos in it.`)) {
                       dbService.deleteCategory(cat.id);
                     }
                   }}
                   className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
           );
         })}
         {categories.length === 0 && (
           <div className="col-span-full p-8 text-center text-neutral-600 text-sm">No categories found. Create one.</div>
         )}
       </div>
    </div>
  );
};

const PhotosManager: React.FC<{ photos: Photo[], categories: Category[] }> = ({ photos, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    drive_id: "",
    category_id: ""
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", drive_id: "", category_id: "" });
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleEdit = (p: Photo) => {
    setFormData({
      title: p.title,
      description: p.description,
      drive_id: p.drive_id,
      category_id: p.category_id
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.drive_id || !formData.category_id) return;

    try {
      if (editingId) {
        await dbService.updatePhoto(editingId, formData);
      } else {
        const id = Date.now().toString();
        await dbService.createPhoto(id, formData);
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save photo. Make sure you have permission and data is valid.");
    }
  };

  const filteredPhotos = photos.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = filterCategory ? p.category_id === filterCategory : true;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
           <h2 className="text-2xl font-bold tracking-tight">Manage Photos</h2>
           <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Photo proxy service</p>
         </div>
         <div className="flex flex-col sm:flex-row gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
             <input
               type="text"
               placeholder="Search photos..."
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full sm:w-48 pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-neutral-600"
             />
           </div>
           <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
             <select
               value={filterCategory}
               onChange={e => setFilterCategory(e.target.value)}
               className="w-full sm:w-48 pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
             >
               <option value="">All Categories</option>
               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
           </div>
           <button
             onClick={() => { resetForm(); setIsModalOpen(true); }}
             className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
           >
             <Plus className="w-4 h-4" />
             Add Photo
           </button>
         </div>
       </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={resetForm} 
        title={editingId ? "Edit Sync Config" : "Generate Proxy"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-neutral-600 outline-none text-sm text-neutral-100" required placeholder="Sunset at Bali" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Google Drive File ID</label>
            <div className="flex relative">
              <input type="text" value={formData.drive_id} onChange={e => setFormData({...formData, drive_id: e.target.value})} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-neutral-600 outline-none font-mono text-sm text-neutral-100" required placeholder="1O_abcd1234..." />
            </div>
            <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">Right click file in Drive &gt; Share &gt; Copy link. Extract the ID from the URL.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Category</label>
              <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors text-sm text-neutral-100 outline-none appearance-none" required>
                <option value="" disabled className="text-neutral-500">Select collection</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Context</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-neutral-600 outline-none resize-none text-sm text-neutral-100" placeholder="Source info or description..." />
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
              {editingId ? "Update Config" : "Generate Proxy"}
            </button>
          </div>
        </form>
      </Modal>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredPhotos.map(photo => {
           const cat = categories.find(c => c.id === photo.category_id);
           return (
           <div key={photo.id} className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden flex flex-col group relative">
             <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10 pointer-events-none"></div>
             <div className="aspect-square bg-neutral-800 relative z-0">
               <img 
                 src={`/api/photos/view/${photo.drive_id}`} 
                 alt={photo.title}
                 loading="lazy"
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/262626/737373.png?text=Sync+Error';
                 }}
               />
               <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                 <button onClick={() => handleEdit(photo)} className="p-2 backdrop-blur-md bg-black/40 border border-white/10 rounded-xl text-neutral-300 hover:text-indigo-400 hover:bg-black/60 transition-all shadow-xl">
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button onClick={() => {
                   if(confirm("Delete this proxy config?")) dbService.deletePhoto(photo.id);
                 }} className="p-2 backdrop-blur-md bg-black/40 border border-white/10 rounded-xl text-neutral-300 hover:text-red-400 hover:bg-black/60 transition-all shadow-xl">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
             <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
               <div className="flex items-center gap-2 mb-2">
                 <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm shrink-0">
                   {cat?.icon} {cat?.name || "Uncategorized"}
                 </span>
               </div>
               <h3 className="font-bold text-xl leading-tight truncate text-neutral-100">{photo.title}</h3>
               <p className="text-xs text-neutral-400 font-mono mt-1 opacity-75 truncate">{photo.drive_id.substring(0, 10)}... • SG Node</p>
             </div>
           </div>
           )
         })}
       </div>
       {filteredPhotos.length === 0 && !isModalOpen && (
         <div className="py-16 text-center text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-3xl">
           <Image className="w-10 h-10 mx-auto mb-4 opacity-20" />
           <p className="font-bold text-neutral-300">No active syncs found</p>
           <p className="text-xs font-medium uppercase tracking-widest mt-2">{photos.length > 0 ? "Try clearing your filters" : "Generate your first photo proxy"}</p>
         </div>
       )}
    </div>
  );
};
