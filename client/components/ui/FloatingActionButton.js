"use client";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";

export default function FloatingActionButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-2xl hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center group"
    >
      <motion.div
        animate={{ rotate: isHovered ? 90 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <FiPlus className="text-2xl" />
      </motion.div>

      {/* Ripple effect */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-primary-400"
      />
    </motion.button>
  );
}
