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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Image className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ProxyGallery<span className="text-indigo-400">.v1</span></h1>
              <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest hidden sm:block">G-Drive Photo Engine</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
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
                  "px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border",
                  activeCategory === cat.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredPhotos.map((photo) => {
                const proxyUrl = `/api/photos/view/${photo.drive_id}`;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={photo.id}
                    className="group cursor-pointer aspect-square bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden relative"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={proxyUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Image+Load+Error';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium truncate">{photo.title}</h3>
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
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center gap-4"
            >
              <img
                src={`/api/photos/view/${selectedPhoto.drive_id}`}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="text-center w-full max-w-2xl bg-black/50 p-4 rounded-xl text-white">
                <h2 className="text-xl font-semibold mb-2 text-white">{selectedPhoto.title}</h2>
                {selectedPhoto.description && (
                  <p className="text-neutral-400 text-sm whitespace-pre-wrap">{selectedPhoto.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
