"use client";
import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard"; // Ensure the import path is correct

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Today's Tasks"); // State to track selected section

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
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
              Authorization: `Bearer ${token}`, // Include token for protected routes
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

  // Filter and categorize tasks
  const todayTasks = tasks.filter(
    (task) => new Date(task.deadline).toDateString() === new Date().toDateString()
  );
  const nextWeekTasks = tasks.filter((task) => {
    const taskDate = new Date(task.deadline);
    const today = new Date();
    return taskDate > today && taskDate <= new Date(today.setDate(today.getDate() + 7));
  });
  const nextMonthTasks = tasks.filter((task) => {
    const taskDate = new Date(task.deadline);
    const today = new Date();
    return taskDate > new Date(today.setDate(today.getDate() + 7)) && taskDate <= new Date(today.setDate(today.getDate() + 30));
  });

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
        {Object.keys(sections).map((section) => (
          <button
            key={section}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 shadow ${
              selectedSection === section
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
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
              <th className="p-2 text-left font-semibold text-gray-600">Status</th>
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
