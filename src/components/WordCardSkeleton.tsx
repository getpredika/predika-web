import { motion } from "framer-motion";
import { forwardRef } from "react";

interface WordCardSkeletonProps {
  index: number;
}

export const WordCardSkeleton = forwardRef<HTMLDivElement, WordCardSkeletonProps>(
  function WordCardSkeleton({ index }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
        className="rounded-2xl p-6 sm:p-8 bg-white border border-stone-100 shadow-sm"
      >
        <div className="space-y-4">
          <div className="h-8 w-48 bg-stone-100 rounded-md shimmer" />
          
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-stone-100 rounded-md shimmer" />
            <div className="h-6 w-20 bg-stone-100 rounded-md shimmer" />
          </div>

          <div className="space-y-2 pt-4">
            <div className="h-5 w-full bg-stone-100 rounded-md shimmer" />
            <div className="h-5 w-5/6 bg-stone-100 rounded-md shimmer" />
          </div>

          <div className="space-y-2 pt-4">
            <div className="h-4 w-20 bg-stone-100 rounded-md shimmer" />
            <div className="h-5 w-full bg-stone-100 rounded-md shimmer" />
            <div className="h-5 w-4/5 bg-stone-100 rounded-md shimmer" />
          </div>

          <div className="flex gap-2 pt-4 flex-wrap">
            <div className="h-6 w-20 bg-stone-100 rounded-full shimmer" />
            <div className="h-6 w-24 bg-stone-100 rounded-full shimmer" />
            <div className="h-6 w-18 bg-stone-100 rounded-full shimmer" />
          </div>
        </div>
      </motion.div>
    );
  }
);
