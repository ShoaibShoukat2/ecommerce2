import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        className={`${sizes[size]} border-2 border-gold-500/30 border-t-gold-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-premium overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-dark-800" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-dark-700 rounded w-1/3" />
            <div className="h-4 bg-dark-700 rounded w-3/4" />
            <div className="h-4 bg-dark-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
