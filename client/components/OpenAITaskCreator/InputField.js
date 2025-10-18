"use client";
import React from "react";

const InputField = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="input w-full text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
      value={value}
      onChange={onChange}
      placeholder="Enter task description with deadline..."
    />
  );
};

export default InputField;
