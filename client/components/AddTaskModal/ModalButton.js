// /components/AddtaskModal/ModalButton

"use client";
import TaskModal from "./TaskModal"; 
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
        className="bg-[#1E3A8A] text-white text-xl px-5 py-3 rounded-full hover:bg-[#1E40AF] transition duration-200"
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

export default ModalButton; 
