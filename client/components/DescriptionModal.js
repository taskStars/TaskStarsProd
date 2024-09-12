import React from "react";

const DescriptionModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50"
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-1/2 max-w-lg relative"
        style={{
          overflow: "auto",
          maxHeight: "80vh",
        }}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        {/* Render the modal content */}
        <div className="mt-4">
          {React.Children.map(children, (child, index) => (
            <div key={index} style={{ marginBottom: '10px', color: 'black' }}> {/* Ensuring text is still visible */}
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
