"use client";
const InputField = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="w-full p-2 border border-gray-300 rounded-md text-black"
      value={value}
      onChange={onChange}
      placeholder="Enter task description along with the deadline..."
    />
  );
};

export default InputField;
