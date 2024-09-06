"use client"; // Ensure it's marked as a Client Component
import { useState } from 'react';

const TaskModal = ({ isOpen, onClose, onSave, generateDescription }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState(""); // State for the deadline
  const [tags, setTags] = useState(""); // State for tags (as a comma-separated string)

  const handleSave = () => {
    // Split tags by comma, remove empty spaces around them
    const tagsArray = tags.split(",").map(tag => tag.trim());

    onSave({
      title: taskName,
      description: taskDescription,
      deadline,
      tags: tagsArray,
    });
    onClose();
    setTaskName("");
    setTaskDescription("");
    setDeadline(""); // Reset the deadline
    setTags(""); // Reset the tags
  };

  const handleGenerateDescription = async () => {
    const generatedDescription = await generateDescription(taskName);
    setTaskDescription(generatedDescription);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold">Add Task</h2>
        
        {/* Task Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Task Name: </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Task Description Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Task Description:</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Task Deadline Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Task Tags Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Generate Description Button */}
        <button
          onClick={handleGenerateDescription}
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md w-full"
        >
          Generate Description
        </button>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
