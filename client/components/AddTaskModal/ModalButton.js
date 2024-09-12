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
        className="bg-[#1E3A8A] text-white text-2xl px-10 py-7 rounded-full hover:bg-[#1E40AF] transition duration-200"
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
