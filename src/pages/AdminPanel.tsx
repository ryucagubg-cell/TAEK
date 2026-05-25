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
      {/* Sidebar / Top Nav on Mobile */}
      <aside className="w-full md:w-64 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col shrink-0">
        <div className="flex items-center justify-between md:justify-start gap-3 px-6 py-5 md:py-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg leading-tight block">Admin<span className="text-indigo-400">.Panel</span></span>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium hidden sm:block">Control Center</p>
            </div>
          </div>
          {/* Mobile Tab Indicator/Button can go here if needed */}
        </div>
        
        <nav className="flex md:flex-col gap-1 px-4 pb-4 md:pt-4 overflow-x-auto md:overflow-x-visible hide-scrollbar">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex items-center gap-2 md:gap-3 px-4 md:px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === "dashboard" ? "bg-neutral-900 border border-neutral-800 text-indigo-400" : "text-neutral-500 hover:text-neutral-200 border border-transparent"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={cn(
              "flex items-center gap-2 md:gap-3 px-4 md:px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === "photos" ? "bg-neutral-900 border border-neutral-800 text-indigo-400" : "text-neutral-500 hover:text-neutral-200 border border-transparent"
            )}
          >
            <Image className="w-4 h-4" />
            <span>Photos</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={cn(
              "flex items-center gap-2 md:gap-3 px-4 md:px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === "categories" ? "bg-neutral-900 border border-neutral-800 text-indigo-400" : "text-neutral-500 hover:text-neutral-200 border border-transparent"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </nav>

        <div className="hidden md:flex mt-auto border-t border-neutral-800 p-4 flex-col gap-4">
          <div className="px-2 text-xs text-neutral-500 truncate font-mono">{user?.email}</div>
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
                     <img src={`/api/photos/view/${p.drive_id}?w=400`} alt={p.title} className="w-full h-full object-cover" />
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
  const [isImportingFolder, setIsImportingFolder] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    drive_id: "",
    category_id: ""
  });

  const parseDriveId = (input: string) => {
    // Regex for file ID: d/ID/view or id=ID or simply the ID string
    const fileRegex = /(?:[\/=d]\/|id=)([a-zA-Z0-9-_]{25,})/;
    // Regex for folder ID: folders/ID
    const folderRegex = /folders\/([a-zA-Z0-9-_]{25,})/;
    
    // Check for folder first
    const folderMatch = input.match(folderRegex);
    if (folderMatch) return { id: folderMatch[1], type: 'folder' as const };
    
    const fileMatch = input.match(fileRegex);
    if (fileMatch) return { id: fileMatch[1], type: 'file' as const };
    
    // Fallback: if it's already a clean ID
    if (input.length >= 25 && !input.includes('/') && !input.includes('?')) {
      return { id: input, type: 'file' as const };
    }
    
    return { id: input, type: 'unknown' as const };
  };

  const handleDriveIdChange = (val: string) => {
    const parsed = parseDriveId(val);
    setFormData({ ...formData, drive_id: parsed.id });
    
    // If it's a folder link, notify user we could batch import
    if (parsed.type === 'folder' && !editingId) {
       setImportStatus("Google Drive folder detected. Click 'Import Folder' to add all photos.");
    } else {
       setImportStatus(null);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", drive_id: "", category_id: "" });
    setIsModalOpen(false);
    setEditingId(null);
    setIsImportingFolder(false);
    setImportStatus(null);
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

  const handleDeleteAllPhotos = async () => {
    if (photos.length === 0) {
      alert("No photos to delete.");
      return;
    }

    if (confirm(`Are you absolutely sure you want to delete ALL ${photos.length} photos? This action cannot be undone.`)) {
      setProgressStatus("Starting deletion of all photos...");
      setProgressPercent(0);
      try {
        await dbService.bulkDeletePhotos(photos.map(p => p.id), (done, total) => {
           setProgressPercent(Math.round((done / total) * 100));
           setProgressStatus(`Deleted ${done} / ${total} photos`);
        });
        setProgressStatus("All photos deleted successfully.");
        setTimeout(() => { setProgressStatus(""); setProgressPercent(0); }, 3000);
      } catch (e: any) {
        setProgressStatus("Delete failed: " + e.message);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPhotoIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedPhotoIds.size} selected photos?`)) {
       setProgressStatus(`Deleting ${selectedPhotoIds.size} selected photos...`);
       setProgressPercent(0);
       try {
         await dbService.bulkDeletePhotos(Array.from(selectedPhotoIds), (done, total) => {
           setProgressPercent(Math.round((done / total) * 100));
           setProgressStatus(`Deleted ${done} / ${total} selected photos`);
         });
         setSelectedPhotoIds(new Set());
         setIsSelecting(false);
         setProgressStatus("Selected photos deleted.");
         setTimeout(() => { setProgressStatus(""); setProgressPercent(0); }, 3000);
       } catch (e: any) {
         setProgressStatus("Delete failed: " + e.message);
       }
    }
  }

  const handleDeleteImportedFolder = async () => {
    const driveInput = prompt("Enter the Folder Google Drive URL or ID that you want to delete:");
    if (!driveInput) return;

    const parsed = parseDriveId(driveInput);
    if (!parsed || parsed.type !== 'folder') {
      alert("Invalid folder ID or URL. Make sure it's a folder link.");
      return;
    }

    const descToMatch = `Bulk imported from folder: ${parsed.id}`;
    const photosToDelete = photos.filter(p => p.description && p.description.includes(descToMatch));
    
    if (photosToDelete.length === 0) {
      alert("No photos found imported from this folder. Ensure you pasted the exact folder link.");
      return;
    }

    if (confirm(`Are you sure you want to delete ${photosToDelete.length} photos imported from this folder?`)) {
      setProgressStatus(`Starting folder deletion of ${photosToDelete.length} photos...`);
      setProgressPercent(0);
      try {
        await dbService.bulkDeletePhotos(photosToDelete.map(p => p.id), (done, total) => {
          setProgressPercent(Math.round((done / total) * 100));
          setProgressStatus(`Deleted ${done} / ${total} photos from folder`);
        });
        setProgressStatus("Folder deleted successfully.");
        setTimeout(() => { setProgressStatus(""); setProgressPercent(0); }, 3000);
      } catch (e: any) {
        setProgressStatus("Delete failed: " + e.message);
      }
    }
  };

  const handleBatchImport = async () => {
    if (!formData.drive_id || !formData.category_id) {
      alert("Please provide Folder ID and Category.");
      return;
    }

    setIsImportingFolder(true);
    setImportStatus("Reading folder contents...");

    try {
      const resp = await fetch(`/api/photos/list-folder/${formData.drive_id}`);
      if (!resp.ok) throw new Error("Failed to list folder");
      
      const { files } = await resp.json();
      
      if (!files || files.length === 0) {
        setImportStatus("No images found in this folder.");
        setIsImportingFolder(false);
        return;
      }

      setImportStatus(`Found ${files.length} images. Syncing...`);

      const photosToCreate = files.map((file: any, i: number) => {
        return {
          id: `${Date.now()}_${i}`,
          photo: {
            title: (file.name ? file.name.split('.')[0] : "Photo").substring(0, 190) || "Photo",
            description: `Bulk imported from folder: ${formData.drive_id}`.substring(0, 999),
            drive_id: file.id,
            category_id: formData.category_id
          }
        };
      });

      await dbService.bulkCreatePhotos(photosToCreate, (done, total) => {
        setImportStatus(`Imported ${done}/${total}...`);
      });

      setImportStatus("Successfully imported all images!");
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setImportStatus("Error during import. Ensure folder is public.");
      setIsImportingFolder(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if it's a folder import scenario
    if (importStatus && importStatus.includes("detected") && !editingId) {
      if (!formData.category_id) {
        alert("Please select a category for the folder import.");
        return;
      }
      await handleBatchImport();
      return;
    }

    if (!formData.title || !formData.drive_id || !formData.category_id) {
      alert("Please fill in Title, Drive ID, and Category.");
      return;
    }

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
       {progressStatus && (
         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm font-bold">
              <span>{progressStatus}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
         </div>
       )}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
           <h2 className="text-2xl font-bold tracking-tight">Manage Photos</h2>
           <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Photo proxy service</p>
         </div>
         <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
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
           <button
             onClick={() => {
               if (isSelecting) {
                 setIsSelecting(false);
                 setSelectedPhotoIds(new Set());
               } else {
                 setIsSelecting(true);
               }
             }}
             className={cn("flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all sm:ml-auto", isSelecting ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300")}
           >
             {isSelecting ? "Cancel Selection" : "Select Photos"}
           </button>
           {isSelecting && selectedPhotoIds.size > 0 && (
             <button
               onClick={handleDeleteSelected}
               className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
             >
               <Trash2 className="w-4 h-4" /> Delete ({selectedPhotoIds.size})
             </button>
           )}
           <button
             onClick={handleDeleteImportedFolder}
             className="flex items-center justify-center gap-2 bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
             title="Delete a folder that was previously bulk-imported"
           >
             <Trash2 className="w-4 h-4" /> Delete Imported Folder
           </button>
           <button
             onClick={handleDeleteAllPhotos}
             className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
             title="Delete ALL photos in the gallery"
           >
             <Trash2 className="w-4 h-4" /> Delete All
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
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Google Drive URL or ID</label>
            <div className="flex relative">
              <input 
                type="text" 
                value={formData.drive_id} 
                onChange={e => handleDriveIdChange(e.target.value)} 
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-neutral-600 outline-none font-mono text-sm text-neutral-100" 
                required 
                placeholder="Paste Drive link or ID..." 
              />
            </div>
            {importStatus ? (
              <p className={cn(
                "text-[10px] mt-2 font-medium truncate",
                importStatus.includes("Error") ? "text-red-400" : "text-indigo-400"
              )}>{importStatus}</p>
            ) : (
              <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">Paste a file link or a folder link to import everything.</p>
            )}
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

          <div className="flex justify-end gap-3 pt-4">
            {importStatus && importStatus.includes("detected") && !isImportingFolder && (
              <button 
                type="button" 
                onClick={handleBatchImport}
                className="bg-neutral-800 text-indigo-400 border border-neutral-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-neutral-700 transition-all"
              >
                Import Folder
              </button>
            )}
            <button 
              type="submit" 
              disabled={isImportingFolder}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {isImportingFolder ? "Importing..." : (editingId ? "Update Config" : "Generate Proxy")}
            </button>
          </div>
        </form>
      </Modal>

       <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 grid-flow-dense auto-rows-[160px] md:auto-rows-[200px]">
         {filteredPhotos.map(photo => {
           const cat = categories.find(c => c.id === photo.category_id);
           
           // Deterministic Grid Spacing for Bento Grid
           let sum = 0;
           for(let i=0; i<photo.drive_id.length; i++) sum += photo.drive_id.charCodeAt(i);
           const mod = sum % 10;
           let gridClass = "col-span-1 row-span-1";
           if (mod === 0) gridClass = "col-span-2 row-span-2";
           else if (mod === 1) gridClass = "col-span-1 row-span-2";
           else if (mod === 2) gridClass = "col-span-2 row-span-1";
           
           return (
           <div 
             key={photo.id} 
             onClick={() => {
               if (isSelecting) {
                 const newSet = new Set(selectedPhotoIds);
                 if (newSet.has(photo.id)) newSet.delete(photo.id);
                 else newSet.add(photo.id);
                 setSelectedPhotoIds(newSet);
               }
             }}
             className={cn("bg-neutral-900 rounded-2xl md:rounded-3xl border overflow-hidden flex flex-col group relative shadow-md hover:shadow-2xl transition-all duration-300 transform", gridClass, selectedPhotoIds.has(photo.id) ? "border-indigo-500 ring-2 ring-indigo-500/50 scale-95" : "border-neutral-800", isSelecting ? "cursor-pointer" : "")}>
             {isSelecting && (
               <div className="absolute top-4 left-4 z-30">
                 <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", selectedPhotoIds.has(photo.id) ? "bg-indigo-500 border-indigo-500" : "border-white/50 bg-black/20 backdrop-blur-md")}>
                   {selectedPhotoIds.has(photo.id) && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                 </div>
               </div>
             )}
             <div className="absolute inset-0 bg-neutral-800"></div>
             <img 
               src={`/api/photos/view/${photo.drive_id}?w=400`} 
               alt={photo.title}
               loading="lazy"
               className={cn("w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 relative z-0", selectedPhotoIds.has(photo.id) ? "opacity-70" : "")}
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/262626/737373.png?text=Sync+Error';
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
             
             {!isSelecting && (
               <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
                 <button onClick={(e) => { e.stopPropagation(); handleEdit(photo); }} className="p-2 backdrop-blur-md bg-black/50 border border-white/20 rounded-xl text-neutral-200 hover:text-indigo-400 hover:bg-black/80 transition-all shadow-xl">
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button onClick={(e) => {
                   e.stopPropagation();
                   if(confirm("Delete this proxy config?")) dbService.deletePhoto(photo.id);
                 }} className="p-2 backdrop-blur-md bg-black/50 border border-white/20 rounded-xl text-neutral-200 hover:text-red-400 hover:bg-black/80 transition-all shadow-xl">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             )}

             <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col justify-end">
               <div className="flex flex-wrap items-center gap-2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                 <span className="px-1.5 py-0.5 bg-indigo-500/20 backdrop-blur-md text-indigo-300 border border-indigo-500/30 text-[9px] font-bold uppercase tracking-widest rounded">
                   {cat?.icon} {cat?.name || "Uncategorized"}
                 </span>
               </div>
               <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight truncate text-neutral-100 drop-shadow-md">{photo.title}</h3>
               <p className="text-[9px] md:text-[10px] text-neutral-400 font-mono mt-0.5 opacity-0 group-hover:opacity-75 transition-opacity delay-150 truncate drop-shadow-md">{photo.drive_id.substring(0, 10)}... • G-Node</p>
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
