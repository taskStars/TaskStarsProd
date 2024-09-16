// components/TaskManager.js
"use client"; // Mark this as a Client Component

import ModalButton from "./AddTaskModal/ModalButton";
import AIModal from "./OpenAITaskCreator/AIModal";

const TaskManager = () => {
  // Function to save task to the database (API call)
  const handleSaveTask = async (task) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      console.error("No token found, user is not authenticated.");
      alert("You are not authenticated. Please log in.");
      return Promise.reject("No token found");
    }

    try {
      const response = await fetch("https://taskstars.onrender.com/api/tasks/createtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure JWT token is included
        },
        body: JSON.stringify(task), // Send task data to the API
      });

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
      console.error("Error generating description:", error);
      return "Error generating description";
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center"> {/* Updated background and added shadow */}
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Task Manager</h1> Changed text color to gray-800 */}
      {/* Use the ModalButton and pass the API functions */}
      <ModalButton
        onSave={handleSaveTask} // Pass the save function to the button
        generateDescription={generateDescription} // Pass the description generation function
      />
      <AIModal></AIModal>
    </div>
  );
};

export default TaskManager;
