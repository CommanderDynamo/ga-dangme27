import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  src: string;
  caption: string;
  type?: 'image' | 'video';
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ images, currentIndex, isOpen, onClose, onPrev, onNext }: LightboxProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !images[currentIndex]) return null;

  const current = images[currentIndex];
  const isVideo = current.type === 'video';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-heritage-dark/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200 z-10"
          aria-label="Close"
        >
          <X size={32} />
        </button>

        {/* Previous */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200 z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Media container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <video
              key={current.src}
              src={current.src}
              controls
              autoPlay
              className="max-w-full max-h-[75vh] rounded-lg shadow-elevated"
            />
          ) : (
            <img
              src={current.src}
              alt={current.caption}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-elevated"
            />
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-center font-body text-lg text-primary-foreground/90"
          >
            {current.caption}
          </motion.p>
          <p className="mt-2 text-center font-body text-sm text-primary-foreground/60">
            {currentIndex + 1} / {images.length}
          </p>
        </motion.div>

        {/* Next */}
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200 z-10"
          aria-label="Next"
        >
          <ChevronRight size={40} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
