"use client"; // Ensure this is a client-side component

import { useState } from "react";

export default function SaveProductivity() {
  const [sessionTime, setSessionTime] = useState(0); // State for session time input
  const [message, setMessage] = useState(""); // State for displaying messages

  // Get JWT token from localStorage
  const getToken = () => localStorage.getItem("token");

  const handleSaveProductivity = async () => {
    const token = getToken(); // Retrieve JWT token
    console.log("Retrieved Token for Request:", token); // Debug: Log token being sent

    if (!token) {
      setMessage("No token found, user might not be authenticated.");
      console.error("No token found, user might not be authenticated.");
      return;
    }

    try {
      const response = await fetch("/api/saveProductivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token in the request header
        },
        body: JSON.stringify({ sessionTime }), // Send sessionTime in request body
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Productivity data saved successfully!");
      } else {
        setMessage(data.message || "Failed to save productivity data.");
      }
    } catch (error) {
      console.error("Error saving productivity data:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Save Productivity Data</h1>
      <input
        type="number"
        value={sessionTime}
        onChange={(e) => setSessionTime(e.target.value)}
        placeholder="Session Time (in seconds)"
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleSaveProductivity}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Productivity
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
