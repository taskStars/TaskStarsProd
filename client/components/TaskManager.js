// components/TaskManager.js
"use client";

import ModalButton from "./AddTaskModal/ModalButton";
import AIModal from "./OpenAITaskCreator/AIModal";

const TaskManager = () => {
  const handleSaveTask = async (task) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated.");
      alert("You are not authenticated. Please log in.");
      return Promise.reject("No token found");
    }

    try {
      const response = await fetch(
        "https://taskstars.onrender.com/api/tasks/createtask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
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

  const generateDescription = async (taskName) => {
    try {
      const response = await fetch(
        "https://taskstars.onrender.com//api/generateDescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: taskName,
          }),
        }
      );

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Error generating description:", error);
      return "Error generating description";
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center">
      {" "}
      <ModalButton
        onSave={handleSaveTask}
        generateDescription={generateDescription}
      />
      <AIModal></AIModal>
    </div>
  );
};

export default TaskManager;
