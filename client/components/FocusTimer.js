"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiSquare,
  FiClock,
  FiCoffee,
  FiZap,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";
import Card from "./ui/Card";
import ProgressRing from "./ui/ProgressRing";
import { API_URL } from "@/config/api";

const FOCUS_MODES = {
  FOCUS: { duration: 25 * 60, label: "Focus", color: "#0ea5e9", icon: FiZap },
  SHORT_BREAK: {
    duration: 5 * 60,
    label: "Short Break",
    color: "#22c55e",
    icon: FiCoffee,
  },
  LONG_BREAK: {
    duration: 15 * 60,
    label: "Long Break",
    color: "#a855f7",
    icon: FiCoffee,
  },
  CUSTOM: {
    duration: 25 * 60,
    label: "Custom",
    color: "#f59e0b",
    icon: FiClock,
  },
};

const FocusTimer = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [mode, setMode] = useState("FOCUS");
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    FOCUS_MODES.FOCUS.duration
  );
  const [initialTime, setInitialTime] = useState(FOCUS_MODES.FOCUS.duration);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const timerId = useRef(null);
  const isSessionEnded = useRef(false);
  const totalFocusTime = useRef(0);

  // Timer effect
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerId.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timerId.current);
            setIsActive(false);
            endSession(prevTime, true);
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerId.current);
    }
  }, [isActive, timeRemaining]);

  const handleStart = () => {
    setIsActive(true);
    isSessionEnded.current = false;
  };

  const handlePause = () => {
    setIsActive(false);
    clearInterval(timerId.current);
  };

  const handleEnd = () => {
    setShowEndModal(true);
  };

  const confirmEndSession = () => {
    setShowEndModal(false);
    endSession(timeRemaining, false);
  };

  const cancelEndSession = () => setShowEndModal(false);

  const endSession = (remainingTime, isNaturalEnd = true) => {
    if (isSessionEnded.current) return;
    isSessionEnded.current = true;
    setIsActive(false);
    clearInterval(timerId.current);

    const timeElapsed = initialTime - remainingTime;

    // Only save productivity data and track time during FOCUS mode
    if (isNaturalEnd && mode === "FOCUS") {
      if (token && timeElapsed > 0) {
        saveProductivityData(timeElapsed + 1);
        totalFocusTime.current += timeElapsed + 1;
      }
      setCompletedSessions((prev) => prev + 1);
      setShowCongratsModal(true);
      toast.success("🎉 Focus session completed! Time for a break!");

      // Auto-switch to break
      const newMode =
        (completedSessions + 1) % 4 === 0 ? "LONG_BREAK" : "SHORT_BREAK";
      switchMode(newMode);
    } else if (
      isNaturalEnd &&
      (mode === "SHORT_BREAK" || mode === "LONG_BREAK")
    ) {
      // Break completed - don't track time, just switch back to focus
      toast.success("Break over! Ready for another focus session?");
      switchMode("FOCUS");
    } else if (isNaturalEnd && mode === "CUSTOM") {
      // Custom timer completed - only track if we consider it a focus session
      if (token && timeElapsed > 0) {
        saveProductivityData(timeElapsed + 1);
        totalFocusTime.current += timeElapsed + 1;
      }
      setShowCongratsModal(true);
      toast.success("🎉 Focus session completed!");
    }

    if (!isNaturalEnd) {
      setTimeRemaining(initialTime);
    }
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

  const switchMode = (newMode) => {
    setMode(newMode);
    const duration = FOCUS_MODES[newMode].duration;
    setInitialTime(duration);
    setTimeRemaining(duration);
    setIsActive(false);
  };

  const handleCustomTimeChange = (minutes) => {
    if (mode !== "CUSTOM") return;
    const mins = parseInt(minutes, 10);
    if (isNaN(mins) || mins < 1) return;
    const newTime = Math.min(Math.max(mins, 1), 120) * 60; // 1-120 minutes
    setInitialTime(newTime);
    setTimeRemaining(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const progress = ((initialTime - timeRemaining) / initialTime) * 100;
  const ModeIcon = FOCUS_MODES[mode].icon;

  return (
    <div className="w-full">
      <Card className="w-full p-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <ModeIcon className="text-primary-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Focus Timer
            </h2>
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {Object.entries(FOCUS_MODES).map(([key, value]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchMode(key)}
                disabled={isActive}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  mode === key
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
                } ${isActive ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {value.label}
              </motion.button>
            ))}
          </div>

          {/* Daily Goal Stat - Above Timer */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-500/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-success-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Daily Goal
              </span>
              <span className="text-lg font-bold text-success-500">
                {completedSessions > 0
                  ? Math.floor((completedSessions / 8) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* Timer Display with Progress Ring */}
          <div className="relative inline-block mb-8">
            <ProgressRing
              progress={progress}
              size={280}
              strokeWidth={14}
              color={FOCUS_MODES[mode].color}
              showText={false}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <motion.div
                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white"
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3">
                {isActive
                  ? `${FOCUS_MODES[mode].label} in Progress`
                  : "Ready to Start"}
              </p>
            </div>
          </div>

          {/* Custom Timer Input */}
          {mode === "CUSTOM" && !isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 text-center">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={Math.floor(timeRemaining / 60)}
                    onChange={(e) => handleCustomTimeChange(e.target.value)}
                    className="w-24 px-4 py-2 text-center text-lg font-semibold bg-gray-100 dark:bg-dark-700 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Set custom focus time (1-120 minutes)
              </p>
            </motion.div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              onClick={handleStart}
              disabled={isActive}
              variant="success"
              size="lg"
              className="gap-2 min-w-[120px]"
            >
              <FiPlay /> Start
            </Button>
            <Button
              onClick={handlePause}
              disabled={!isActive}
              variant="secondary"
              size="lg"
              className="gap-2 min-w-[120px]"
            >
              <FiPause /> Pause
            </Button>
            <Button
              onClick={handleEnd}
              variant="danger"
              size="lg"
              className="gap-2"
            >
              <FiSquare /> End
            </Button>
          </div>

          {/* Session Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`w-3 h-3 rounded-full ${
                  i < completedSessions % 8
                    ? "bg-gradient-to-r from-primary-500 to-primary-600"
                    : "bg-gray-200 dark:bg-dark-700"
                }`}
              />
            ))}
          </div>

          {/* Stats - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Sessions
                </p>
              </div>
              <p className="text-3xl font-bold text-primary-500">
                {completedSessions}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent-500"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Total Focus
                </p>
              </div>
              <p className="text-3xl font-bold text-accent-500">
                {Math.floor(totalFocusTime.current / 60)}m
              </p>
            </div>
          </div>
        </motion.div>
      </Card>

      {/* End Confirmation Modal */}
      <AnimatePresence>
        {showEndModal && (
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
              className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-2xl w-96 border border-gray-200 dark:border-dark-700"
            >
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">
                ⚠️ End Session?
              </h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                {mode === "FOCUS"
                  ? "Focus session progress will be lost."
                  : "Are you sure you want to end your break?"}
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
                  Yes, End
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
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold mb-3 text-gradient">
                Congratulations!
              </h2>
              <p className="mb-2 text-gray-600 dark:text-gray-400 text-lg">
                You completed a focus session!
              </p>
              <p className="mb-6 text-2xl font-bold text-success-600 dark:text-success-400">
                {formatTime(initialTime)}
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

export default FocusTimer;
