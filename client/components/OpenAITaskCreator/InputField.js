"use client"
const InputField = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="w-full p-2 border border-gray-300 rounded-md"
      value={value}
      onChange={onChange}
      placeholder="Enter task description..."
    />
  );
};

export default InputField;