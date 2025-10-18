"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FiPlay, FiPause, FiRefreshCw, FiSettings } from "react-icons/fi";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import ProgressRing from "../ui/ProgressRing";
import toast from "react-hot-toast";

const TIMER_MODES = {
  POMODORO: { duration: 25 * 60, label: "Focus" },
  SHORT_BREAK: { duration: 5 * 60, label: "Short Break" },
  LONG_BREAK: { duration: 15 * 60, label: "Long Break" },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState("POMODORO");
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.POMODORO.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (mode === "POMODORO") {
      setCompletedPomodoros((prev) => prev + 1);
      toast.success("Pomodoro completed! 🎉 Take a break!");

      // Auto-switch to break
      const newMode =
        completedPomodoros > 0 && (completedPomodoros + 1) % 4 === 0
          ? "LONG_BREAK"
          : "SHORT_BREAK";
      setMode(newMode);
      setTimeLeft(TIMER_MODES[newMode].duration);
    } else {
      toast.success("Break over! Ready for another pomodoro?");
      setMode("POMODORO");
      setTimeLeft(TIMER_MODES.POMODORO.duration);
    }

    // Play notification sound
    if (typeof Audio !== "undefined") {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[mode].duration);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_MODES[newMode].duration);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    ((TIMER_MODES[mode].duration - timeLeft) / TIMER_MODES[mode].duration) *
    100;

  return (
    <>
      <Card className="p-8">
        <div className="text-center">
          {/* Mode Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {Object.entries(TIMER_MODES).map(([key, value]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchMode(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === key
                    ? "bg-primary-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
                }`}
              >
                {value.label}
              </motion.button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative inline-block mb-6">
            <ProgressRing
              progress={progress}
              size={240}
              strokeWidth={12}
              color={
                mode === "POMODORO"
                  ? "#0ea5e9"
                  : mode === "SHORT_BREAK"
                  ? "#22c55e"
                  : "#a855f7"
              }
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={timeLeft}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold text-gray-900 dark:text-gray-50"
              >
                {formatTime(timeLeft)}
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {isRunning ? "In Progress" : "Ready to Start"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant={isRunning ? "secondary" : "primary"}
              size="lg"
              onClick={toggleTimer}
              className="min-w-[140px]"
            >
              {isRunning ? (
                <>
                  <FiPause /> Pause
                </>
              ) : (
                <>
                  <FiPlay /> Start
                </>
              )}
            </Button>

            <Button variant="ghost" size="lg" onClick={resetTimer}>
              <FiRefreshCw />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowSettings(true)}
            >
              <FiSettings />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div>
              <p className="text-2xl font-bold text-primary-500">
                {completedPomodoros}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Completed
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-500">
                {Math.floor((completedPomodoros * 25) / 60)}h
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Focus Time
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success-500">
                {completedPomodoros > 0
                  ? Math.floor((completedPomodoros / 8) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Daily Goal
              </p>
            </div>
          </div>

          {/* Pomodoro Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`w-3 h-3 rounded-full ${
                  i < completedPomodoros % 8
                    ? "bg-primary-500"
                    : "bg-gray-200 dark:bg-dark-700"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Pomodoro Settings"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Focus Duration
            </label>
            <input
              type="number"
              className="input"
              defaultValue={25}
              min={1}
              max={60}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Break
            </label>
            <input
              type="number"
              className="input"
              defaultValue={5}
              min={1}
              max={30}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Break
            </label>
            <input
              type="number"
              className="input"
              defaultValue={15}
              min={1}
              max={60}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="primary" className="flex-1">
              Save Settings
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSettings(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
