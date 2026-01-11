import { motion } from "framer-motion";
import { forwardRef } from "react";

interface WordCardSkeletonProps {
  index: number;
}

// Shimmer animation styles
const shimmerStyle = {
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite ease-in-out",
};

export const WordCardSkeleton = forwardRef<HTMLDivElement, WordCardSkeletonProps>(
  function WordCardSkeleton({ index }, ref) {
    return (
      <>
        <style>
          {`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}
        </style>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          className="rounded-2xl p-6 sm:p-8 bg-white border border-stone-100 shadow-sm h-full"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              {/* Word title */}
              <div
                className="h-9 w-40 rounded-lg"
                style={shimmerStyle}
              />
              {/* IPA and part of speech */}
              <div className="flex gap-2">
                <div
                  className="h-7 w-20 rounded-md"
                  style={shimmerStyle}
                />
                <div
                  className="h-7 w-16 rounded-md"
                  style={shimmerStyle}
                />
              </div>
            </div>
            {/* Audio button */}
            <div
              className="w-11 h-11 rounded-full shrink-0"
              style={shimmerStyle}
            />
          </div>

          <div className="mt-6 space-y-4">
            {/* Definition */}
            <div className="border-l-2 border-stone-200 pl-4 py-1 space-y-2">
              <div
                className="h-5 w-full rounded-md"
                style={shimmerStyle}
              />
              <div
                className="h-5 w-4/5 rounded-md"
                style={shimmerStyle}
              />
            </div>

            {/* Example section */}
            <div className="pl-4 space-y-2">
              <div
                className="h-3 w-16 rounded-md"
                style={shimmerStyle}
              />
              <div
                className="h-16 w-full rounded-lg"
                style={shimmerStyle}
              />
            </div>

            {/* Synonyms/Tags */}
            <div className="pl-4 space-y-2">
              <div
                className="h-3 w-20 rounded-md"
                style={shimmerStyle}
              />
              <div className="flex gap-2 flex-wrap">
                <div
                  className="h-6 w-16 rounded-full"
                  style={shimmerStyle}
                />
                <div
                  className="h-6 w-20 rounded-full"
                  style={shimmerStyle}
                />
                <div
                  className="h-6 w-14 rounded-full"
                  style={shimmerStyle}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  }
);
