// components/ModalButton.js
import React, { useState } from 'react';
import AIModal from './AIModal';

const ModalButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Use AI to generate tasks
      </button>
      {isModalOpen && <AIModal isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default ModalButton;
