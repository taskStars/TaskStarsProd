"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiPause, FiSquare, FiClock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { API_URL } from "@/config/api";

const LockInTimer = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1500); // Default to 25 minutes (1500 seconds)
  const [initialTime, setInitialTime] = useState(1500); // Initial time set for the timer (25 minutes)
  const [showModal, setShowModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false); // State for congrats modal
  const timerId = useRef(null); // Use a ref to store timerId to avoid re-renders
  const isSessionEnded = useRef(false); // Flag to prevent multiple calls to endSession

  // Timer effect
  useEffect(() => {
    if (isLockedIn && timeRemaining > 0) {
      timerId.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timerId.current); // Clear interval when time is up
            setIsLockedIn(false); // Stop the timer
            endSession(prevTime); // Save session when timer ends naturally
            return prevTime; // Return current time without decrementing
          }
          return prevTime - 1; // Decrement time
        });
      }, 1000);

      // Cleanup interval on component unmount or timer stop
      return () => clearInterval(timerId.current);
    }
  }, [isLockedIn, timeRemaining]);

  const handleStart = () => {
    setIsLockedIn(true);
    isSessionEnded.current = false; // Reset the flag when starting
  };

  const handlePause = () => {
    setIsLockedIn(false);
    clearInterval(timerId.current); // Clear interval when pausing
  };

  const handleEnd = () => {
    setShowModal(true);
  };

  const confirmEndSession = () => {
    setShowModal(false);
    endSession(timeRemaining, false); // Pass the current timeRemaining and false to indicate early end
  };

  const cancelEndSession = () => setShowModal(false);

  const endSession = (remainingTime, isNaturalEnd = true) => {
    if (isSessionEnded.current) return; // Prevent multiple calls
    isSessionEnded.current = true; // Set flag to prevent multiple requests
    setIsLockedIn(false);
    clearInterval(timerId.current);

    if (isNaturalEnd) {
      // Save only if the session ends naturally
      const timeElapsed = initialTime - remainingTime; // Calculate correct timeElapsed
      if (token && timeElapsed > 0) {
        saveProductivityData(timeElapsed + 1); // Add 1 second before saving the correct time elapsed
      } else {
        console.error("Invalid session or time elapsed is zero.");
      }
      setShowCongratsModal(true); // Show congrats modal instead of alert
    }

    setTimeRemaining(initialTime);
  };

  const saveProductivityData = async (timeElapsed) => {
    try {
      const response = await fetch(
        `${API_URL}/api/productivity/saveProductivity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionTime: timeElapsed }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Productivity data saved:", data);
      } else {
        console.error("Error saving data:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleSliderChange = (e) => {
    const newTime = parseInt(e.target.value, 10);
    setInitialTime(newTime);
    setTimeRemaining(newTime);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiClock className="text-primary-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Lock-In Mode
            </h2>
          </div>

          <motion.div
            animate={isLockedIn ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: isLockedIn ? Infinity : 0 }}
            className={`text-5xl font-bold mb-6 ${
              isLockedIn
                ? "text-gradient-fire"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {formatTime(timeRemaining)}
          </motion.div>

          <div className="mb-6">
            <input
              type="range"
              min="0"
              max="7200"
              value={timeRemaining}
              onChange={handleSliderChange}
              step="5"
              disabled={isLockedIn}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-dark-700 accent-primary-500"
              style={{
                background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${
                  (timeRemaining / 7200) * 100
                }%, #e2e8f0 ${(timeRemaining / 7200) * 100}%, #e2e8f0 100%)`,
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Drag to set time (up to 2 hours)
            </p>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              onClick={handleStart}
              disabled={isLockedIn}
              variant="success"
              size="sm"
              className="gap-2"
            >
              <FiPlay /> Start
            </Button>
            <Button
              onClick={handlePause}
              disabled={!isLockedIn}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <FiPause /> Pause
            </Button>
            <Button
              onClick={handleEnd}
              variant="danger"
              size="sm"
              className="gap-2"
            >
              <FiSquare /> End
            </Button>
          </div>
        </motion.div>
      </Card>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            onClick={cancelEndSession}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-2xl w-96 border border-gray-200 dark:border-dark-700"
            >
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">
                ⚠️ End Session?
              </h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                All progress from this current timer will be lost.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={cancelEndSession}
                  variant="secondary"
                  className="flex-1"
                >
                  Continue
                </Button>
                <Button
                  onClick={confirmEndSession}
                  variant="danger"
                  className="flex-1"
                >
                  Yes, Quit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congratulations Modal */}
      <AnimatePresence>
        {showCongratsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowCongratsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-2xl w-96 border border-gray-200 dark:border-dark-700 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold mb-3 text-gradient">
                Congratulations!
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400 text-lg">
                You've been productive for{" "}
                <span className="font-bold text-success-600 dark:text-success-400">
                  {formatTime(initialTime)}
                </span>
                !
              </p>
              <Button
                onClick={() => {
                  setShowCongratsModal(false);
                  toast.success("Great work! Keep it up! 🚀");
                }}
                variant="success"
                className="w-full"
              >
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LockInTimer;
