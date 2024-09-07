"use client";
import { useState, useEffect, useRef } from "react";

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

    setTimeRemaining(initialTime); // Reset the timer to initial time
  };

  const saveProductivityData = async (timeElapsed) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/productivity/saveProductivity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
          body: JSON.stringify({ sessionTime: timeElapsed }), // Send sessionTime to backend
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
      <p className="text-6xl mb-6">{formatTime(timeRemaining)}</p>
      <input
        type="range"
        min="0"
        max="7200" // 2 hours in seconds
        value={timeRemaining}
        onChange={handleSliderChange}
        step="5" // Adjust step size to 30 seconds
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

      {showCongratsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-black">
              Congratulations!
            </h2>
            <p className="mb-6 text-black">
              You have been productive for {formatTime(initialTime)}!
            </p>
            <button
              onClick={() => setShowCongratsModal(false)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockInTimer;
