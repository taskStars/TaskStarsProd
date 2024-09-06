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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Task</h2>

        {/* Task Name Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="Enter task name"
          />
        </div>

        {/* Task Description Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            rows={3}
            placeholder="Enter task description"
          />
        </div>

        {/* Task Deadline Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
          />
        </div>

        {/* Task Priority Selector */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Task Tags Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="e.g. work, important"
          />
        </div>

        {/* Generate Description Button */}
        <button
          onClick={handleGenerateDescription}
          className="mb-4 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md w-full text-black"
        >
          Generate Description
        </button>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
