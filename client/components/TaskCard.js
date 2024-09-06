// components/TaskCard.js TS-14
import React from 'react';

const TaskCard = ({ title, description, deadline, tags, priority }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 max-w-sm w-full">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">
          {new Date(deadline).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm font-medium text-red-600 mb-4">Priority: {priority}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
