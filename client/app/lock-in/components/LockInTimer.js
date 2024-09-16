"use client";
import { useState, useEffect, useRef } from "react";

const LockInTimer = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1500); // Default to 25 minutes (1500 seconds)
  const [initialTime, setInitialTime] = useState(1500); // Initial time set for the timer (25 minutes)
  const [showModal, setShowModal] = useState(false);
  const timerId = useRef(null); 
  const isSessionEnded = useRef(false); 

  // Timer effect
  useEffect(() => {
    if (isLockedIn && timeRemaining > 0) {
      timerId.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId.current); 
            endSession(prevTime); 
            return 0; 
          }
          return prevTime - 1; 
        });
      }, 1000);

      return () => clearInterval(timerId.current);
    }
  }, [isLockedIn, timeRemaining]);

  const handleStart = () => {
    setIsLockedIn(true);
    isSessionEnded.current = false; 
  };

  const handlePause = () => {
    setIsLockedIn(false);
    clearInterval(timerId.current); 
  };

  const handleEnd = () => {
    setShowModal(true);
  };

  const confirmEndSession = () => {
    setShowModal(false);
    endSession(timeRemaining, false); 
  };

  const cancelEndSession = () => setShowModal(false);

  const endSession = (remainingTime, isNaturalEnd = true) => {
    if (isSessionEnded.current) return; 
    isSessionEnded.current = true; 
    setIsLockedIn(false);
    clearInterval(timerId.current);

    if (isNaturalEnd) {
      const timeElapsed = initialTime - remainingTime; 
      if (token && timeElapsed > 0) {
        saveProductivityData(timeElapsed); 
      } else {
        console.error("Invalid session or time elapsed is zero.");
      }
      alert("Session completed! Your progress has been saved.");
    }

    setTimeRemaining(initialTime); 
  };

  const saveProductivityData = async (timeElapsed) => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/saveProductivity`,
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
      <h1 className="text-4xl font-bold mb-4">Lock-In Mode</h1>
      <p className="text-6xl mb-6">
        Time Remaining: {formatTime(timeRemaining)}
      </p>
      <input
        type="range"
        min="0"
        max="7200" // 2 hours in seconds
        value={timeRemaining}
        onChange={handleSliderChange}
        className="w-full max-w-lg mb-6"
      />
      <div className="space-x-4">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLockedIn}
        >
          Start
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          disabled={!isLockedIn}
        >
          Pause
        </button>
        <button
          onClick={handleEnd}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          End
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-black">
              Are you sure you want to quit?
            </h2>
            <p className="mb-6 text-black">
              All progress from this current timer will be lost.
            </p>
            <button
              onClick={confirmEndSession}
              className="px-4 py-2 bg-red-500 text-white rounded mr-4"
            >
              Yes, Quit
            </button>
            <button
              onClick={cancelEndSession}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              No, Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockInTimer;
