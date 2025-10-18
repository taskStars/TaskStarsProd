"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEye } from "react-icons/fi";
import { toast } from "react-hot-toast";
import DescriptionModal from "./DescriptionModal";
import Button from "./ui/Button";
import { API_URL } from "@/config/api";

const TaskCard = ({ task }) => {
  const { title, description, deadline, priority, tags } = task;
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);

  // Toggle modal visibility
  const toggleDescriptionModal = () => {
    setDescriptionModalOpen(!isDescriptionModalOpen);
  };

  // Calculate days until due or overdue status
  const calculateDaysUntilDue = () => {
    const today = new Date();
    const taskDeadline = new Date(deadline);
    const timeDifference = taskDeadline - today; // Difference in milliseconds
    const daysUntilDue = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    if (daysUntilDue < 0) {
      return "Overdue";
    } else if (daysUntilDue === 0) {
      return "Due Today";
    } else {
      return `Due in ${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""}`;
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated.");
      toast.error("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Task deleted successfully");
        toast.success("Task deleted successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to delete task:", errorData.message);
        toast.error(`Failed to delete task: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(`Error deleting task: ${error.message}`);
    }
  };

  const formattedDeadline = new Date(deadline).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });

  const dueInText = calculateDaysUntilDue();
  const isOverdue = dueInText === "Overdue";

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
      >
        <td className="p-4 text-gray-900 dark:text-gray-100 font-medium">
          {title}
        </td>
        <td className="p-4">
          <button
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            onClick={toggleDescriptionModal}
          >
            <FiEye />
            View Details
          </button>
        </td>
        <td className="p-4 text-gray-600 dark:text-gray-400">
          {formattedDeadline}
        </td>
        <td className="p-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isOverdue
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                : dueInText === "Due Today"
                ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300"
                : "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300"
            }`}
          >
            {dueInText}
          </span>
        </td>
        <td className="p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <FiTrash2 size={18} />
          </motion.button>
        </td>
      </motion.tr>

      {/* Description Modal */}
      {isDescriptionModalOpen && (
        <DescriptionModal
          isOpen={isDescriptionModalOpen}
          onClose={toggleDescriptionModal}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title || "No Title"}
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Description:
                </span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {description || "No Description Available"}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Priority:
                </span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {priority || "No Priority Set"}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags && tags.length ? (
                    tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No Tags Available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DescriptionModal>
      )}
    </>
  );
};

export default TaskCard;
