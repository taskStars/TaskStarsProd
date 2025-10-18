"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProgressRing({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  color = "#0ea5e9",
  showText = true,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-dark-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={mounted ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Percentage text */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={mounted ? { scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold text-gray-900 dark:text-gray-50"
          >
            {Math.round(progress)}%
          </motion.span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Complete
          </span>
        </div>
      )}
    </div>
  );
}
