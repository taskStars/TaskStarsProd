"use client"
import React from 'react';

const ChatBox = ({ chatHistory }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto">
      {chatHistory.length === 0 ? (
        <p className="text-gray-500">No conversation yet...</p>
      ) : (
        chatHistory.map((entry, index) => (
          <div key={index} className="mb-2">
            <p className="font-semibold">{entry.user}</p>
            <p className="text-sm text-gray-600">{entry.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatBox;
