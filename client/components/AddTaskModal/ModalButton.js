// /components/AddtaskModal/ModalButton

"use client";
import TaskModal from "./TaskModal"; // Ensure the import path is correct
import { useState } from "react";

const ModalButton = ({ onSave, generateDescription }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleButtonClick}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        aria-label="Add a new task"
        role="button"
      >
        Add Task
      </button>

      {/* Render the Task Modal */}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={onSave}
          generateDescription={generateDescription}
        />
      )}
    </div>
  );
};

export default ModalButton; // Ensure this line exports the component correctly
