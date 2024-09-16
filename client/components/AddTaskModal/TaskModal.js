"use client"; 
import { useState } from "react";

const TaskModal = ({ isOpen, onClose, onSave, generateDescription }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState(""); 

  const handleSave = () => {
    if (!taskName || !taskDescription || !deadline) {
      alert("Please fill in all required fields.");
      return;
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim());

    onSave({
      title: taskName,
      description: taskDescription,
      deadline,
      priority,
      tags: tagsArray,
    })
      .then(() => {
        onClose();
        setTaskName("");
        setTaskDescription("");
        setDeadline(""); 
        setPriority("Medium"); 
        setTags(""); 
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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#1C2331] p-8 rounded-lg shadow-2xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#F87171] transition duration-200"
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
            className="mt-1 block w-full px-3 py-2 border border-[#0A1F44] rounded-full focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
            placeholder="Enter task name"
          />
        </div>

        {/* Task Description Input */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-white mb-2">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-[#0A1F44] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
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
            className="mt-1 block w-full px-3 py-2 border border-[#0A1F44] rounded-full focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
          />
        </div>

        {/* Task Priority Selector */}
        <div className="mb-5">
          <label className="block text-lg font-semibold text-white mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-[#0A1F44] rounded-full focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
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
            className="mt-1 block w-full px-3 py-2 border border-[#0A1F44] rounded-full focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
            placeholder="e.g. work, important"
          />
        </div>

        {/* Generate Description Button */}
        <button
          onClick={handleGenerateDescription}
          className="mb-4 bg-[#1E3A8A] hover:bg-[#34495E] px-4 py-2 rounded-full w-full text-white font-bold shadow-md transition duration-200"
        >
          Generate Description
        </button>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-[#E74C3C] hover:bg-[#C0392B] px-4 py-2 rounded-full text-white font-bold shadow-md transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#27AE60] hover:bg-[#229954] px-4 py-2 rounded-full text-white font-bold shadow-md transition duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
