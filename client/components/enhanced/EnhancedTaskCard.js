"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiCheck, FiEdit2, FiTrash2, FiClock, FiFlag } from "react-icons/fi";
import { MdDragIndicator } from "react-icons/md";
import Badge from "../ui/Badge";
import {
  formatTimeDisplay,
  getPriorityColor,
  getRelativeTime,
} from "@/lib/utils";
import toast from "react-hot-toast";

export default function EnhancedTaskCard({ task, onDelete, onComplete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete?.(task._id);
      toast.success("Task completed! 🎉");
    } catch (error) {
      toast.error("Failed to complete task");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete?.(task._id);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const priorityColors = {
    High: "text-red-600 bg-red-100 dark:bg-red-900/30",
    Medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    Low: "text-green-600 bg-green-100 dark:bg-green-900/30",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card p-4 cursor-pointer group relative overflow-hidden"
    >
      {/* Background gradient on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 pointer-events-none"
      />

      <div className="relative flex items-start gap-4">
        {/* Drag Handle */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          className="flex-shrink-0 text-gray-400 dark:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <MdDragIndicator className="text-xl" />
        </motion.div>

        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleComplete}
          disabled={isCompleting}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
            isCompleting
              ? "border-success-500 bg-success-500"
              : "border-gray-300 dark:border-dark-600 hover:border-success-500 dark:hover:border-success-500"
          }`}
        >
          {isCompleting && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FiCheck className="text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {task.title}
            </h3>

            {/* Quick Actions - Show on hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              className="flex items-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              >
                <FiEdit2 className="text-sm" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
              >
                <FiTrash2 className="text-sm" />
              </motion.button>
            </motion.div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            {task.priority && (
              <Badge
                variant="default"
                className={priorityColors[task.priority]}
              >
                <FiFlag className="text-xs" />
                {task.priority}
              </Badge>
            )}

            {/* Deadline */}
            {task.deadline && (
              <Badge variant="default">
                <FiClock className="text-xs" />
                {getRelativeTime(task.deadline)}
              </Badge>
            )}

            {/* Tags */}
            {task.tags?.map((tag, index) => (
              <Badge key={index} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar at bottom if task is time-sensitive */}
      {task.deadline && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 opacity-20"
        />
      )}
    </motion.div>
  );
}
