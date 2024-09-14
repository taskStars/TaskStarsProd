// components/SubmitButton.js
import React from 'react';

const SubmitButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
    >
      Submit
    </button>
  );
};

export default SubmitButton;
