"use client";
import React, { useState } from "react";
import ChatBox from "./ChatBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const AIModal = () => {
  const [taskDescription, setTaskDescription] = useState(""); // Use 'taskDescription' as the state
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to manage modal visibility

  const handleInputChange = (e) => {
    setTaskDescription(e.target.value); // Set taskDescription state
  };

  const handleSubmit = async () => {
    if (!taskDescription.trim()) return;

    const userMessage = { user: "User", message: taskDescription };
    setChatHistory([...chatHistory, userMessage]);

    // Call the backend API here to generate the task
    const response = await fetch("http://localhost:8080/api/tasks/createTaskWithAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user is authenticated
      },
      // The key here should be `taskDescription` to match the backend
      body: JSON.stringify({ taskDescription }), // Change 'input' to 'taskDescription'
    });

    const data = await response.json();
    const aiMessage = { user: "AI", message: data.text || "Task created successfully" };

    setChatHistory([...chatHistory, userMessage, aiMessage]);
    setTaskDescription(""); // Clear input after submission
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Button to open modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Use AI to Generate Tasks
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">AI Task Generator</h2>
            <ChatBox chatHistory={chatHistory} />
            <div className="mt-4">
              <InputField value={taskDescription} onChange={handleInputChange} />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <SubmitButton onClick={handleSubmit} />
              <button
                onClick={closeModal}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModal;
