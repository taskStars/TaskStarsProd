// components/TaskManager.js
"use client"; // Mark this as a Client Component

import ModalButton from "./AddTaskModal/ModalButton";

const TaskManager = () => {
  // Function to save task to the database (API call)
  const handleSaveTask = async (task) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure JWT token is included
          },
          body: JSON.stringify(task), // Send task data to the API
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Task saved successfully:", data);
      } else {
        console.error("Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Function to generate task description using OpenAI API (API call)
  const generateDescription = async (taskName) => {
    try {
      const response = await fetch("/api/generateDescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: taskName, // Pass the taskName as input
        }),
      });

      const data = await response.json();
      return data.text; // Assuming your API returns { text } for the description
    } catch (error) {
      return "Error generating description";
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
      {/* Use the ModalButton and pass the API functions */}
      <ModalButton
        onSave={handleSaveTask}
        generateDescription={generateDescription}
      />
    </div>
  );
};

export default TaskManager;
