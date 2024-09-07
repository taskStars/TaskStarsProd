"use client";
import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard'; // Ensure the import path is correct

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
        const response = await fetch('http://localhost:8080/api/tasks/readtasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token for protected routes
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
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;

  // Group tasks by date
  const tasksByDate = tasks.reduce((group, task) => {
    const date = new Date(task.deadline).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
    });
    if (!group[date]) {
      group[date] = [];
    }
    group[date].push(task);
    return group;
  }, {});

  const dates = Object.keys(tasksByDate); // Get all unique dates

  return (
    <div className="container mx-auto mt-6 p-6 flex flex-col items-center bg-white shadow-lg rounded-lg"> {/* Updated styles */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Tasks</h1> {/* Changed text color to gray-800 */}

      {/* Dates Display */}
      <div className="flex overflow-x-auto mb-6 space-x-4 p-2 max-w-lg w-full justify-center"> {/* Centered and matched width */}
        {dates.map((date) => (
          <button
            key={date}
            className={`px-4 py-2 rounded-lg ${
              selectedDate === date ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Task List for Selected Date */}
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full"> {/* Centered and matched width */}
        {selectedDate && (
          <div>
            <h2 className="text-lg font-bold mb-3">{selectedDate}</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {tasksByDate[selectedDate].map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
