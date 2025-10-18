"use client";
import { motion } from "framer-motion";
import { FiClock, FiTrendingUp } from "react-icons/fi";

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};

const FriendCard = ({ friend }) => {
  return (
    <motion.li
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-4 bg-white dark:bg-dark-700 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-dark-600"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {friend.name}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiClock size={14} />
            <span>{formatTime(friend.productivityTime)}</span>
          </div>
        </div>
        <motion.div
          whileHover={{ rotate: 15 }}
          className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg"
        >
          <FiTrendingUp className="text-success-600 dark:text-success-400" size={20} />
        </motion.div>
      </div>
    </motion.li>
  );
};

export default FriendCard;


