"use client";
import React from "react";

const ChatBox = ({ chatHistory }) => {
  return (
    <div className="bg-gray-100 dark:bg-dark-700 p-4 rounded-xl min-h-[200px] max-h-96 overflow-y-auto">
      {chatHistory.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          💬 Start a conversation...
        </p>
      ) : (
        <div className="space-y-3">
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                entry.user === "User"
                  ? "bg-primary-100 dark:bg-primary-900/30 ml-8"
                  : "bg-accent-100 dark:bg-accent-900/30 mr-8"
              }`}
            >
              <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                {entry.user === "User" ? "You" : "🤖 AI Assistant"}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
