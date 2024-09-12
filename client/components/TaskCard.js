import React, { useState } from "react";

const TaskCard = ({ task }) => {
  const { title, description, deadline, status } = task;
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated.");
      alert("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for protected routes
        },
      });

      if (response.ok) {
        console.log("Task deleted successfully");
        window.location.reload(); // Refresh the page after deletion
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2 text-gray-800">{title}</td>
      <td className="p-2 text-gray-600">{isDescriptionVisible ? description : "—"}</td>
      <td className="p-2 text-gray-600">{new Date(deadline).toLocaleDateString()}</td>
      <td className="p-2">
        <span className={`px-2 py-1 text-xs font-semibold ${status === "Done" ? "bg-green-200 text-green-800" : status === "Start" ? "bg-purple-200 text-purple-800" : status === "Pending" ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-800"}`}>
          {status}
        </span>
      </td>
      <td className="p-2">
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 bg-white rounded p-1"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};

export default TaskCard;
