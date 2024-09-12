"use client";
import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Today's Tasks");

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/tasks/readtasks",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  }, []);

  // Corrected time categorization
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  // Start and end of the current week (Monday to Sunday)
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  startOfThisWeek.setHours(0, 0, 0, 0);

  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
  endOfThisWeek.setHours(23, 59, 59, 999);

  // Start and end of the next week
  const startOfNextWeek = new Date(endOfThisWeek);
  startOfNextWeek.setDate(endOfThisWeek.getDate() + 1); // Monday after this Sunday
  startOfNextWeek.setHours(0, 0, 0, 0);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6); // Next Sunday
  endOfNextWeek.setHours(23, 59, 59, 999);

  // Start and end of next month
  const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Last day of next month
  endOfNextMonth.setHours(23, 59, 59, 999);

  const todayTasks = tasks.filter(
    (task) => new Date(task.deadline) >= startOfToday && new Date(task.deadline) <= endOfToday
  );

  const nextWeekTasks = tasks.filter(
    (task) => new Date(task.deadline) >= startOfNextWeek && new Date(task.deadline) <= endOfNextWeek
  );

  const nextMonthTasks = tasks.filter(
    (task) => new Date(task.deadline) > endOfNextWeek && new Date(task.deadline) <= endOfNextMonth
  );

  const sections = {
    "Today's Tasks": todayTasks,
    "Next Week": nextWeekTasks,
    "Next Month": nextMonthTasks,
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="container mx-auto mt-8 p-8 bg-gray-100 shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Work Plan</h1>

      {/* Date Selection Buttons */}
      <div className="flex space-x-2 mb-6">
        {Object.keys(sections).map((section, index) => (
          <button
            key={section}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 shadow rounded-full ${
              selectedSection === section
                ? index === 0
                  ? "bg-[#3949AB] text-white"
                  : index === 1
                  ? "bg-[#283593] text-white"
                  : "bg-[#1A237E] text-white border border-[#3949AB]"
                : "bg-grey text-black border border-black hover:bg-[#BBDEFB] hover:text-[#283593]"
            }`}
            onClick={() => setSelectedSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Task List for Selected Section */}
      <div className="bg-white shadow p-4 w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left font-semibold text-gray-600">Name</th>
              <th className="p-2 text-left font-semibold text-gray-600">Description</th>
              <th className="p-2 text-left font-semibold text-gray-600">Date</th>
              <th className="p-2 text-left font-semibold text-gray-600">Due In</th>
            </tr>
          </thead>
          <tbody>
            {sections[selectedSection].length > 0 ? (
              sections[selectedSection].map((task) => (
                <TaskCard key={task._id} task={task} />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-600 py-4">
                  No tasks found for this section.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
