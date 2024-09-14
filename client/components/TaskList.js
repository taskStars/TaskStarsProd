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

  // Start and end of the current week (Monday to Sunday)
  const startOfThisWeek = getUTCMidnightDate(today);
  startOfThisWeek.setUTCDate(today.getUTCDate() - today.getUTCDay() + 1); // Monday

  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setUTCDate(startOfThisWeek.getUTCDate() + 6); // Sunday
  endOfThisWeek.setUTCHours(23, 59, 59, 999);

  // Start and end of the next week
  const startOfNextWeek = new Date(endOfThisWeek);
  startOfNextWeek.setUTCDate(endOfThisWeek.getUTCDate() + 1); // Monday after this Sunday
  startOfNextWeek.setUTCHours(0, 0, 0, 0);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setUTCDate(startOfNextWeek.getUTCDate() + 6); // Next Sunday
  endOfNextWeek.setUTCHours(23, 59, 59, 999);

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

  const thisWeekTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) >= startOfThisWeek &&
      new Date(task.deadline) <= endOfThisWeek
  );

  const nextWeekTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) >= startOfNextWeek &&
      new Date(task.deadline) <= endOfNextWeek
  );

  const thisMonthTasks = tasks.filter(
    (task) =>
      new Date(task.deadline) > endOfNextWeek &&
      new Date(task.deadline) <= endOfThisMonth
  );

  const sections = {
    "Today's Tasks": todayTasks,
    "This Week": thisWeekTasks,
    "Next Week": nextWeekTasks,
    "This Month": thisMonthTasks,
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="w-full h-full bg-gray-100 shadow-lg p-4">
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
                  : index === 2
                  ? "bg-[#1A237E] text-white border border-[#3949AB]"
                  : "bg-[#283593] text-white border border-[#3949AB]"
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
              <th className="p-2 text-left font-semibold text-gray-600">
                Name
              </th>
              <th className="p-2 text-left font-semibold text-gray-600">
                Description
              </th>
              <th className="p-2 text-left font-semibold text-gray-600">
                Date
              </th>
              <th className="p-2 text-left font-semibold text-gray-600">
                Due In
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
