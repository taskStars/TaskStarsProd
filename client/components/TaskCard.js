import React, { useState } from "react";
import DescriptionModal from "./DescriptionModal";

const TaskCard = ({ task }) => {
  const { title, description, deadline, priority, tags } = task;
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);

  const toggleDescriptionModal = () => {
    console.log("Toggling Modal: ", !isDescriptionModalOpen); // Debugging
    console.log("Task Data: ", task); // Debugging
    setDescriptionModalOpen(!isDescriptionModalOpen);
  };

  // Calculate the number of days until the task is due
  const calculateDaysUntilDue = () => {
    const today = new Date();
    const taskDeadline = new Date(deadline);
    const timeDifference = taskDeadline - today; // Difference in milliseconds
    const daysUntilDue = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    if (daysUntilDue < 0) {
      return "Overdue";
    } else if (daysUntilDue === 0) {
      return "Due Today";
    } else {
      return `Due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`;
    }
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
          Authorization: `Bearer ${token}`,
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
    <>
      <tr className="border-b">
        <td className="p-2 text-gray-800">{title}</td>
        <td className="p-2 text-gray-600">
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={toggleDescriptionModal}
          >
            View Details
          </button>
        </td>
        <td className="p-2 text-gray-600">{new Date(deadline).toLocaleDateString()}</td>
        <td className="p-2 text-gray-800">{calculateDaysUntilDue()}</td>
        <td className="p-2">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 bg-white rounded p-1"
          >
            ✕
          </button>
        </td>
      </tr>

      {/* Description Modal */}
      <DescriptionModal isOpen={isDescriptionModalOpen} onClose={toggleDescriptionModal}>
        <h2 className="text-lg font-bold mb-2">{title || 'No Title'}</h2>
        <p className="mb-2"><strong>Description:</strong> {description || 'No Description Available'}</p>
        <p className="mb-2"><strong>Priority:</strong> {priority || 'No Priority Set'}</p>
        <p className="mb-2"><strong>Tags:</strong> {tags && tags.length ? tags.join(", ") : 'No Tags Available'}</p>
      </DescriptionModal>
    </>
  );
};

export default TaskCard;
