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
        className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded"
      >
        Add Task
      </button>

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
