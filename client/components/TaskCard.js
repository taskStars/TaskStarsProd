import React from 'react';

const TaskCard = ({ task }) => {
  const { title, description, deadline, tags, priority } = task;

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
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 shadow-md rounded-lg p-4 mb-3 w-full relative border border-gray-200">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow-lg"
      >
        ✕
      </button>
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm font-medium text-red-600 mb-2">Priority: {priority}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
