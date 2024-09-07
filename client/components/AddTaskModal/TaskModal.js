"use client"; // Ensure it's marked as a Client Component
import { useState } from "react";

const TaskModal = ({ isOpen, onClose, onSave, generateDescription }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState(""); // State for the deadline
  const [priority, setPriority] = useState("Medium"); // State for priority with default value
  const [tags, setTags] = useState(""); // State for tags

  const handleSave = () => {
    // Ensure required fields are not empty
    if (!taskName || !taskDescription || !deadline) {
      alert("Please fill in all required fields.");
      return;
    }

    // Split tags by comma, remove empty spaces around them
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    onSave({
      title: taskName,
      description: taskDescription,
      deadline,
      priority,
      tags: tagsArray,
    })
      .then(() => {
        // If onSave is successful, close the modal and reset fields
        onClose();
        setTaskName("");
        setTaskDescription("");
        setDeadline(""); // Reset the deadline
        setPriority("Medium"); // Reset the priority to default
        setTags(""); // Reset the tags
      })
      .catch((error) => {
        console.error("Error saving task:", error);
        alert("Failed to save task. Please try again.");
      });
  };

  const handleGenerateDescription = async () => {
    const generatedDescription = await generateDescription(taskName);
    setTaskDescription(generatedDescription);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 p-8 rounded-xl shadow-2xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Add Task</h2>

        {/* Task Name Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-white mb-2">Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            placeholder="Enter task name"
          />
        </div>

        {/* Task Description Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-white mb-2">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            rows={3}
            placeholder="Enter task description"
          />
        </div>

        {/* Task Deadline Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-white mb-2">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </div>

        {/* Task Priority Selector */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-white mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Task Tags Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-white mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            placeholder="e.g. work, important"
          />
        </div>

        {/* Generate Description Button */}
        <button
          onClick={handleGenerateDescription}
          className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-md w-full text-white font-bold shadow-md"
        >
          Generate Description
        </button>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-4 py-2 rounded-md text-white font-bold shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-4 py-2 rounded-md text-white font-bold shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
