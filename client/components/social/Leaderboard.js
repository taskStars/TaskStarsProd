"use client";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import { FaTrophy, FaMedal } from "react-icons/fa";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

// Sample data - replace with real data from your API
const leaderboardData = [
  {
    id: 1,
    name: "You",
    score: 1250,
    rank: 1,
    change: 0,
    avatar: "👨",
    streak: 21,
  },
  {
    id: 2,
    name: "Alex Chen",
    score: 1180,
    rank: 2,
    change: 1,
    avatar: "👩",
    streak: 18,
  },
  {
    id: 3,
    name: "Sarah Kim",
    score: 1150,
    rank: 3,
    change: -1,
    avatar: "🧑",
    streak: 15,
  },
  {
    id: 4,
    name: "Mike Johnson",
    score: 1100,
    rank: 4,
    change: 2,
    avatar: "👨‍💼",
    streak: 12,
  },
  {
    id: 5,
    name: "Emma Davis",
    score: 1050,
    rank: 5,
    change: -1,
    avatar: "👩‍💼",
    streak: 14,
  },
  {
    id: 6,
    name: "Chris Lee",
    score: 980,
    rank: 6,
    change: 0,
    avatar: "🧔",
    streak: 10,
  },
  {
    id: 7,
    name: "Lisa Wang",
    score: 950,
    rank: 7,
    change: 3,
    avatar: "👩‍🎓",
    streak: 9,
  },
  {
    id: 8,
    name: "Tom Brown",
    score: 920,
    rank: 8,
    change: -2,
    avatar: "👨‍🎓",
    streak: 11,
  },
];

const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return <FaTrophy className="text-yellow-500 text-2xl" />;
    case 2:
      return <FaMedal className="text-gray-400 text-2xl" />;
    case 3:
      return <FaMedal className="text-amber-600 text-2xl" />;
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center font-bold text-sm">
          {rank}
        </div>
      );
  }
};

const getTrendIcon = (change) => {
  if (change > 0) {
    return <FiTrendingUp className="text-success-500" />;
  } else if (change < 0) {
    return <FiTrendingDown className="text-red-500" />;
  }
  return <FiMinus className="text-gray-400" />;
};

export default function Leaderboard() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Leaderboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Top performers this week
          </p>
        </div>
        <Badge variant="primary" className="text-lg px-4 py-2">
          🏆 Weekly
        </Badge>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user, index) => {
          const isCurrentUser = user.name === "You";

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                isCurrentUser
                  ? "bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 border-2 border-primary-500"
                  : "bg-gray-50 dark:bg-dark-700/50 hover:bg-gray-100 dark:hover:bg-dark-700"
              }`}
            >
              {/* Rank Badge for Top 3 */}
              {user.rank <= 3 && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-2 -right-2"
                >
                  {user.rank === 1 && (
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      👑 Champion
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex items-center gap-4">
                {/* Rank Icon */}
                <div className="flex-shrink-0">{getRankIcon(user.rank)}</div>

                {/* Avatar */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-2xl"
                >
                  {user.avatar}
                </motion.div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-bold ${
                        isCurrentUser
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-900 dark:text-gray-50"
                      }`}
                    >
                      {user.name}
                    </h3>
                    {isCurrentUser && (
                      <Badge variant="primary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.score} points
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      🔥 {user.streak} days
                    </span>
                  </div>
                </div>

                {/* Trend */}
                <div className="flex flex-col items-center gap-1">
                  {getTrendIcon(user.change)}
                  {user.change !== 0 && (
                    <span
                      className={`text-xs font-medium ${
                        user.change > 0
                          ? "text-success-600 dark:text-success-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {Math.abs(user.change)}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar for visual interest */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: user.score / 1300 }}
                transition={{ duration: 1, delay: index * 0.05 }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 origin-left"
              />
            </motion.div>
          );
        })}
      </div>

      {/* View Full Leaderboard Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 font-medium transition-colors"
      >
        View Full Leaderboard
      </motion.button>
    </Card>
  );
}
