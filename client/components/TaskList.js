"use client";
import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard"; // Ensure the import path is correct

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null); // State to track selected date

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

  if (loading) return <p>Loading tasks...</p>;

  // Group tasks by date
  const tasksByDate = tasks.reduce((group, task) => {
    const date = new Date(task.deadline).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
    });
    if (!group[date]) {
      group[date] = [];
    }
    group[date].push(task);
    return group;
  }, {});

  const dates = Object.keys(tasksByDate); // Get all unique dates

  return (
    <div className="container mx-auto mt-8 p-8 flex flex-col items-center bg-gray-50 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Tasks
      </h1>

      {/* Dates Display */}
      <div className="flex overflow-x-auto mb-8 space-x-4 p-3 max-w-xl w-full justify-center bg-gray-100 rounded-lg">
        {dates.map((date) => (
          <button
            key={date}
            className={`px-6 py-3 rounded-md transition-all duration-300 shadow-md ${
              selectedDate === date
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 hover:from-gray-400 hover:to-gray-500"
            }`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Task List for Selected Date */}
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-xl w-full">
        {selectedDate ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {selectedDate} 
            </h2>
            <div className="space-y-4 max-h-[450px] overflow-y-auto">
              {tasksByDate[selectedDate].map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Select a date to view tasks
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
