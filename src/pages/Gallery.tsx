import React, { useState, useEffect } from "react";
import { dbService } from "../services/db";
import { Photo, Category } from "../types";
import { Image, ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubCategories = dbService.subscribeToCategories(setCategories);
    let unsubPhotos = dbService.subscribeToPhotos((data) => {
      setPhotos(data);
      setLoading(false);
    });

    return () => {
      unsubCategories();
      unsubPhotos();
    };
  }, []);

  const filteredPhotos = activeCategory === "all" 
    ? photos 
    : photos.filter(p => p.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans select-none">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Image className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ProxyGallery<span className="text-indigo-400">.v1</span></h1>
              <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest hidden sm:block">G-Drive Photo Engine</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                activeCategory === "all" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800"
              )}
            >
              All Photos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 border",
                  activeCategory === cat.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                )}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
           </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-24 text-neutral-500">
            <p className="text-lg">No photos found in this category.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 grid-flow-dense auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[220px]"
          >
            <AnimatePresence>
              {filteredPhotos.map((photo, index) => {
                const proxyUrl = `/api/photos/view/${photo.drive_id}?w=800`;
                
                // Construct algorithmic grid span based on drive_id
                let sum = 0;
                for(let i = 0; i < photo.drive_id.length; i++) sum += photo.drive_id.charCodeAt(i);
                const mod = sum % 12;
                
                let gridClass = "col-span-1 row-span-1";
                if (mod === 0) gridClass = "col-span-2 row-span-2"; // Large feature
                else if (mod === 1 || mod === 2) gridClass = "col-span-1 row-span-2"; // Tall portrait
                else if (mod === 3 || mod === 4) gridClass = "col-span-2 row-span-1"; // Wide landscape

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                    key={photo.id}
                    className={cn(
                      "group cursor-pointer bg-neutral-900 rounded-3xl overflow-hidden relative shadow-md hover:shadow-2xl hover:z-10 transition-all duration-300 transform",
                      gridClass
                    )}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="absolute inset-0 bg-neutral-800"></div>
                    <img
                      src={proxyUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 relative z-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Image+Load+Error';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 z-10 pointer-events-none">
                      <h3 className="text-white font-bold text-sm sm:text-base leading-tight tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-300 line-clamp-2">{photo.title}</h3>
                      <div className="flex items-center gap-2 mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                         <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-wider">
                           View Image
                         </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <a 
                href={`/api/photos/view/${selectedPhoto.drive_id}?download=1&filename=${encodeURIComponent(selectedPhoto.title || 'photo')}`}
                download
                className="text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
              <button 
                className="text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center gap-4 py-8"
            >
              <img
                src={`/api/photos/view/${selectedPhoto.drive_id}`}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[60vh] sm:max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="w-full max-w-2xl bg-neutral-900/40 backdrop-blur-md border border-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">{selectedPhoto.title}</h2>
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded w-fit">
                     Sync Active
                  </span>
                </div>
                {selectedPhoto.description && (
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 sm:line-clamp-none">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
