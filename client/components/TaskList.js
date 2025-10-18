"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import TaskCard from "./TaskCard";
import { API_URL, SOCKET_URL } from "@/config/api";

const socket = io(SOCKET_URL); // Connect to your Socket.IO server

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [selectedSection, setSelectedSection] = useState("Today"); // State to manage selected section

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/tasks/readtasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch tasks:", errorData.message);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Socket.IO event listeners
    socket.on("task_added", (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on("task_updated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    socket.on("task_deleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    });

    return () => {
      socket.off("task_added");
      socket.off("task_updated");
      socket.off("task_deleted");
    };
  }, []);

  // Helper function to create a date at midnight in UTC
  const getUTCMidnightDate = (date) => {
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
    return utcDate;
  };

  const today = new Date();
  const startOfToday = getUTCMidnightDate(today);
  const endOfToday = new Date(startOfToday);
  endOfToday.setUTCDate(endOfToday.getUTCDate() + 1);
  endOfToday.setUTCMilliseconds(-1);

  // Define the next 7 days range
  const endOfNext7Days = new Date(startOfToday);
  endOfNext7Days.setUTCDate(endOfNext7Days.getUTCDate() + 7);
  endOfNext7Days.setUTCHours(23, 59, 59, 999);

  // Define the next 14 days range
  const endOfNext14Days = new Date(startOfToday);
  endOfNext14Days.setUTCDate(endOfNext14Days.getUTCDate() + 14);
  endOfNext14Days.setUTCHours(23, 59, 59, 999);

  // Start and end of this month
  const startOfThisMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)
  );
  const endOfThisMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0)
  );
  endOfThisMonth.setUTCHours(23, 59, 59, 999);

  // Filter tasks based on the corrected date ranges
  const todayTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) >= startOfToday &&
      new Date(task.deadline) <= endOfToday
  );

  const next7DaysTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) > endOfToday &&
      new Date(task.deadline) <= endOfNext7Days
  );

  const next14DaysTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) > endOfNext7Days &&
      new Date(task.deadline) <= endOfNext14Days
  );

  const thisMonthTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) > endOfNext14Days &&
      new Date(task.deadline) <= endOfThisMonth
  );

  const allTimeTasks = tasks; // All tasks without any filtering

  const sections = {
    Today: todayTasks,
    "Next 7 Days": next7DaysTasks,
    "Next 14 Days": next14DaysTasks,
    "This Month": thisMonthTasks,
    "All Time": allTimeTasks,
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Work Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize and track your tasks
        </p>
      </div>

      {/* Date Selection Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(sections).map((section, index) => {
          const isSelected = selectedSection === section;
          const variants = [
            "primary",
            "accent",
            "success",
            "warning",
            "primary",
          ];
          const variant = variants[index % variants.length];

          return (
            <motion.button
              key={section}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                isSelected
                  ? variant === "primary"
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/50"
                    : variant === "accent"
                    ? "bg-accent-500 text-white shadow-lg shadow-accent-500/50"
                    : variant === "success"
                    ? "bg-success-500 text-white shadow-lg shadow-success-500/50"
                    : "bg-warning-500 text-white shadow-lg shadow-warning-500/50"
                  : "bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600"
              }`}
              onClick={() => setSelectedSection(section)}
            >
              {section}
            </motion.button>
          );
        })}
      </div>

      {/* Task List for Selected Section */}
      <div className="flex-1 overflow-auto bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-50 dark:bg-dark-700 z-10">
              <tr className="border-b border-gray-200 dark:border-dark-600">
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Due In
                </th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sections[selectedSection].length > 0 ? (
                sections[selectedSection].map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 dark:text-gray-400 py-12"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="text-4xl">📋</div>
                      <p className="text-lg font-medium">
                        No tasks found for this section
                      </p>
                      <p className="text-sm">
                        Create a new task to get started!
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
