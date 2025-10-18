"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import ChatBox from "./ChatBox";
import InputField from "./InputField";
import Button from "../ui/Button";
import { API_URL } from "@/config/api";

const AIModal = () => {
  const [taskDescription, setTaskDescription] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!taskDescription.trim()) return;

    const userMessage = { user: "User", message: taskDescription };
    setChatHistory([...chatHistory, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/tasks/createTaskWithAI`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ taskDescription }),
      });

      const data = await response.json();
      const aiMessage = {
        user: "AI",
        message: data.text || "Task created successfully",
      };

      setChatHistory([...chatHistory, userMessage, aiMessage]);
      setTaskDescription("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setChatHistory([]);
    setTaskDescription("");
  };

  return (
    <div className="w-full">
      {/* Button to open modal */}
      <Button
        onClick={openModal}
        variant="accent"
        size="lg"
        className="w-full gap-2"
      >
        <HiSparkles size={20} />
        AI Task Generator
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-dark-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg">
                    <HiSparkles className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AI Task Generator
                  </h2>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <FiX size={24} className="text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>

              <div className="max-h-96 overflow-y-auto mb-4">
                <ChatBox chatHistory={chatHistory} />
              </div>

              <div className="space-y-3">
                <InputField
                  value={taskDescription}
                  onChange={handleInputChange}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    variant="accent"
                    className="flex-1 gap-2"
                  >
                    <FiSend />
                    Generate Task
                  </Button>
                  <Button onClick={closeModal} variant="secondary">
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIModal;
