import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, icon }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-neutral-900 border border-neutral-800 shadow-2xl rounded-3xl overflow-hidden pointer-events-auto"
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  {icon && <div className="text-indigo-400">{icon}</div>}
                  <h3 className="font-bold text-neutral-100 text-lg">{title}</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
