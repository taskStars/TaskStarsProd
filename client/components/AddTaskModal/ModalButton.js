"use client";
import TaskModal from "./TaskModal";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import Button from "../ui/Button";

const ModalButton = ({ onSave, generateDescription }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleButtonClick}
        variant="primary"
        size="lg"
        className="w-full gap-2"
        aria-label="Add a new task"
      >
        <FiPlus size={20} />
        Add Task
      </Button>

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
