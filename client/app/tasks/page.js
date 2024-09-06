// app/tasks/page.js
"use client";
import React, { useEffect, useState } from 'react';
import TaskCard from '../../components/TaskCard'; // Ensure the import path is correct

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        console.error("No token found, user is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/tasks/readtask', {
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

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">All Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            title={task.title}
            description={task.description}
            deadline={task.deadline}
            priority={task.priority}
            tags={task.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
