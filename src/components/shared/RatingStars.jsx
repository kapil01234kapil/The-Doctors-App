"use client";
import { Star } from "lucide-react";

export default function RatingStars({ rating = 0 }) {
  // Clamp rating between 0 and 5
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = i + 1 <= safeRating ? "text-yellow-500" : "text-gray-300";
        return <Star key={i} className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${fill}`} fill={i + 1 <= safeRating ? "currentColor" : "none"} />;
      })}

      {/* Show numeric rating too */}
      <span className="ml-2 text-sm sm:text-base md:text-lg font-medium text-gray-700">
        {safeRating}/5
      </span>
    </div>
  );
}
