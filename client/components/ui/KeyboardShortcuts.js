"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { key: ["G", "D"], description: "Go to Dashboard" },
      { key: ["G", "T"], description: "Go to Tasks" },
      { key: ["G", "A"], description: "Go to Analytics" },
    ],
  },
  {
    category: "Actions",
    items: [
      { key: ["N"], description: "New Task" },
      { key: ["Cmd", "K"], description: "Quick Search" },
      { key: ["Cmd", "Enter"], description: "Save" },
      { key: ["Esc"], description: "Close Modal/Cancel" },
    ],
  },
  {
    category: "Task Management",
    items: [
      { key: ["E"], description: "Edit Selected Task" },
      { key: ["D"], description: "Delete Selected Task" },
      { key: ["Space"], description: "Complete Task" },
      { key: ["↑", "↓"], description: "Navigate Tasks" },
    ],
  },
  {
    category: "Other",
    items: [
      { key: ["?"], description: "Show Shortcuts" },
      { key: ["T"], description: "Toggle Theme" },
      { key: ["P"], description: "Start Pomodoro" },
    ],
  },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Show shortcuts on '?' key
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen]);

  return (
    <>
      {/* Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-2xl hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center font-bold text-lg"
        title="Keyboard Shortcuts (Press ?)"
      >
        ?
      </motion.button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="card p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                      Keyboard Shortcuts
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Boost your productivity with these shortcuts
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <FiX className="text-xl text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>

                {/* Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {shortcuts.map((category, categoryIndex) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.1 }}
                    >
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((shortcut, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: categoryIndex * 0.1 + index * 0.05,
                            }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {shortcut.description}
                            </span>
                            <div className="flex items-center gap-1">
                              {shortcut.key.map((k, i) => (
                                <span key={i} className="flex items-center">
                                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded shadow-sm">
                                    {k}
                                  </kbd>
                                  {i < shortcut.key.length - 1 && (
                                    <span className="mx-1 text-gray-400">
                                      then
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Press{" "}
                    <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-dark-800 rounded">
                      ?
                    </kbd>{" "}
                    anytime to view shortcuts
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
