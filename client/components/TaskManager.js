"use client"; // Mark this as a Client Component

import ModalButton from "./AddTaskModal/ModalButton";
import AIModal from "./OpenAITaskCreator/AIModal";
import { useState } from "react";

const TaskManager = () => {
  const [taskDescription, setTaskDescription] = useState(""); // For storing the generated task description

  // Function to save task to the database (API call)
  const handleSaveTask = async (task) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      console.error("No token found, user is not authenticated.");
      alert("You are not authenticated. Please log in.");
      return Promise.reject("No token found");
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/tasks/createtask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ensure JWT token is included
          },
          body: JSON.stringify(task), // Send task data to the API
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Task saved successfully:", data);
        return Promise.resolve();
      } else {
        const errorData = await response.json();
        console.error("Failed to save task:", errorData.message);
        return Promise.reject(errorData.message);
      }
    } catch (error) {
      console.error("Error saving task:", error);
      return Promise.reject(error);
    }
  };

  // Function to generate task description using OpenAI API (API call)
  const generateDescription = async (taskName) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      console.error("No token found, user is not authenticated.");
      alert("You are not authenticated. Please log in.");
      return "Error: Not authenticated";
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/tasks/generateTaskDescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
          body: JSON.stringify({
            input: taskName, // Pass the taskName as input
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTaskDescription(data.text); // Store the generated task description
        return data.text;
      } else {
        const errorData = await response.json();
        console.error("Error generating description:", errorData.message);
        alert(`Error: ${errorData.message}`);
        return "Error generating description";
      }
    } catch (error) {
      console.error("Error generating description:", error);
      alert("An unexpected error occurred.");
      return "Error generating description";
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center">
      {/* ModalButton is responsible for creating tasks */}
      <ModalButton
        onSave={handleSaveTask} // Pass the save function to the button
        generateDescription={generateDescription} // Pass the description generation function
      />
      {/* AIModal is responsible for AI-related task generation */}
      <AIModal
        generateDescription={generateDescription} // Pass the description generation function
        taskDescription={taskDescription} // Pass the generated task description
      />
    </div>
  );
};

export default TaskManager;
