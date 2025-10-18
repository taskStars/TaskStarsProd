"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiAward,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiTarget,
  FiClock,
} from "react-icons/fi";
import { FaFire, FaTrophy, FaMedal } from "react-icons/fa";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";

const BADGE_TYPES = [
  {
    id: "first-task",
    name: "First Step",
    description: "Complete your first task",
    icon: FiStar,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    requirement: 1,
  },
  {
    id: "task-master",
    name: "Task Master",
    description: "Complete 50 tasks",
    icon: FiAward,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    requirement: 50,
  },
  {
    id: "week-streak",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: FaFire,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    requirement: 7,
  },
  {
    id: "productivity-king",
    name: "Productivity King",
    description: "Log 100 hours of focus time",
    icon: FiClock,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    requirement: 360000, // 100 hours in seconds
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete 10 tasks in one day",
    icon: FiZap,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    requirement: 10,
  },
  {
    id: "goal-crusher",
    name: "Goal Crusher",
    description: "Hit 100% daily goal 30 times",
    icon: FiTarget,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    requirement: 30,
  },
  {
    id: "trending-up",
    name: "Rising Star",
    description: "Increase productivity by 50%",
    icon: FiTrendingUp,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    requirement: 50,
  },
  {
    id: "champion",
    name: "Champion",
    description: "Earn all other badges",
    icon: FaTrophy,
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    requirement: 100,
  },
];

export default function BadgeGallery({ userBadges = [], stats = {} }) {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const isBadgeEarned = (badgeId) => {
    return userBadges.includes(badgeId);
  };

  const getBadgeProgress = (badge) => {
    switch (badge.id) {
      case "first-task":
      case "task-master":
        return Math.min(
          ((stats.tasksCompleted || 0) / badge.requirement) * 100,
          100
        );
      case "week-streak":
        return Math.min(
          ((stats.currentStreak || 0) / badge.requirement) * 100,
          100
        );
      case "productivity-king":
        return Math.min(
          ((stats.totalProductivityTime || 0) / badge.requirement) * 100,
          100
        );
      case "speed-demon":
        return Math.min(
          ((stats.maxTasksInDay || 0) / badge.requirement) * 100,
          100
        );
      default:
        return 0;
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Achievement Badges
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {userBadges.length} of {BADGE_TYPES.length} earned
            </p>
          </div>
          <Badge variant="primary" className="text-lg px-4 py-2">
            <FaMedal className="text-xl" />
            {userBadges.length}/{BADGE_TYPES.length}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BADGE_TYPES.map((badge, index) => {
            const earned = isBadgeEarned(badge.id);
            const progress = getBadgeProgress(badge);
            const Icon = badge.icon;

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedBadge(badge)}
                className="cursor-pointer"
              >
                <div
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    earned
                      ? "border-primary-500 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30"
                      : "border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 opacity-60"
                  }`}
                >
                  {/* Badge Icon */}
                  <div className="flex justify-center mb-3">
                    <motion.div
                      animate={
                        earned
                          ? {
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: earned ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        earned ? badge.bgColor : "bg-gray-100 dark:bg-dark-700"
                      }`}
                    >
                      <Icon
                        className={`text-3xl ${
                          earned
                            ? badge.color
                            : "text-gray-400 dark:text-gray-600"
                        }`}
                      />
                    </motion.div>
                  </div>

                  {/* Badge Name */}
                  <h3
                    className={`text-center font-bold text-sm mb-1 ${
                      earned
                        ? "text-gray-900 dark:text-gray-50"
                        : "text-gray-500 dark:text-gray-600"
                    }`}
                  >
                    {badge.name}
                  </h3>

                  {/* Progress Bar (if not earned) */}
                  {!earned && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-500">
                        {Math.round(progress)}%
                      </p>
                    </div>
                  )}

                  {/* Earned Badge Indicator */}
                  {earned && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-success-500 rounded-full p-1"
                    >
                      <FiStar className="text-white text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Badge Detail Modal */}
      <Modal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title="Badge Details"
        size="sm"
      >
        {selectedBadge && (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
              className={`inline-flex w-32 h-32 rounded-full items-center justify-center ${selectedBadge.bgColor} mb-4`}
            >
              <selectedBadge.icon
                className={`text-6xl ${selectedBadge.color}`}
              />
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              {selectedBadge.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedBadge.description}
            </p>

            {isBadgeEarned(selectedBadge.id) ? (
              <Badge variant="success" className="text-lg px-6 py-2">
                ✅ Earned!
              </Badge>
            ) : (
              <div>
                <div className="mb-2">
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getBadgeProgress(selectedBadge)}%` }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(getBadgeProgress(selectedBadge))}% complete
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Celebration Modal (triggered when badge is earned) */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card p-8 max-w-md text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6, repeat: 3 }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                Badge Earned!
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Congratulations! You've unlocked a new achievement!
              </p>

              <button
                onClick={() => setShowCelebration(false)}
                className="btn-primary"
              >
                Awesome! 🎊
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
