import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface CulturalItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  images?: string[];
}

interface CulturalModalProps {
  item: CulturalItem | null;
  onClose: () => void;
}

const CulturalModal = ({ item, onClose }: CulturalModalProps) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-dark/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-card rounded-2xl overflow-hidden shadow-elevated max-w-4xl w-full max-h-[90vh] grid grid-cols-1 md:grid-cols-2 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="aspect-[4/3] md:aspect-auto md:h-full">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
              <span className="inline-block px-3 py-1 mb-4 bg-primary/10 text-primary rounded-full font-body text-xs font-medium w-fit">
                Community Moments
              </span>
              <h3 className="heritage-heading text-foreground text-2xl md:text-3xl mb-4">
                {item.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-background transition-colors shadow-soft"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CulturalModal;
