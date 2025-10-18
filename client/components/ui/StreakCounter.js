"use client";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import Card from "./Card";

export default function StreakCounter({
  streak = 0,
  maxStreak = 0,
  compact = false,
}) {
  const isActive = streak > 0;

  // Compact mode for dashboard stats
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {isActive && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FaFire className="text-orange-500 text-sm" />
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <Card className="p-6 relative overflow-hidden">
      {/* Background gradient */}
      {isActive && (
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-fire opacity-30"
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Current Streak
          </h3>
          {isActive && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaFire className="text-3xl text-orange-500" />
            </motion.div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <motion.div
            key={streak}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-gradient-fire"
          >
            {streak}
          </motion.div>
          <span className="text-2xl text-gray-600 dark:text-gray-400">
            {streak === 1 ? "day" : "days"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Personal Best: {maxStreak} days
          </span>
          {streak > 0 && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-orange-500 font-medium"
            >
              🔥 On fire!
            </motion.span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(streak / (maxStreak || 1)) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-fire"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
