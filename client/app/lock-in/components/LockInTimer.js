"use client";
import { useState, useEffect, useRef } from "react";

const LockInTimer = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1500); // Default to 25 minutes (1500 seconds)
  const [initialTime, setInitialTime] = useState(1500); // Initial time set for the timer (25 minutes)
  const [showModal, setShowModal] = useState(false);
  const timerId = useRef(null); // Use a ref to store timerId to avoid re-renders
  const isSessionEnded = useRef(false); // Flag to prevent multiple calls to endSession

  // Timer effect
  useEffect(() => {
    if (isLockedIn && timeRemaining > 0) {
      timerId.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            // Check if prevTime is 1
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
      alert("Session completed! Your progress has been saved.");
    }

    setTimeRemaining(initialTime); // Reset the timer to initial time
  };

  const saveProductivityData = async (timeElapsed) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/saveProductivity",
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

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    let numericValue = parseInt(value, 10);

    if (isNaN(numericValue) || numericValue < 0) numericValue = 0; // Validate input to avoid NaN and negative values

    if (name === "hours") {
      const newTime = numericValue * 3600 + (timeRemaining % 3600); // Convert hours to seconds and add to remaining minutes and seconds
      setInitialTime(newTime);
      setTimeRemaining(newTime);
    } else if (name === "minutes") {
      const newTime =
        Math.floor(timeRemaining / 3600) * 3600 + // Keep current hours
        numericValue * 60 + // Convert minutes to seconds
        (timeRemaining % 60); // Keep current seconds
      setInitialTime(newTime);
      setTimeRemaining(newTime);
    } else if (name === "seconds") {
      const newTime =
        Math.floor(timeRemaining / 60) * 60 + Math.min(numericValue, 59); // Ensure seconds don't exceed 59
      setInitialTime(newTime);
      setTimeRemaining(newTime);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
      <h1 className="text-4xl font-bold mb-4">Lock-In Mode</h1>
      <div className="flex items-center mb-4">
        <input
          type="text" // Changed to text to allow free typing
          name="hours"
          value={Math.floor(initialTime / 3600) || ""}
          onChange={handleTimeChange}
          className="w-20 p-2 mr-2 border border-gray-300 rounded"
          placeholder="Hours"
        />
        <span className="text-2xl mr-2">:</span>
        <input
          type="text" // Changed to text to allow free typing
          name="minutes"
          value={Math.floor((initialTime % 3600) / 60) || ""}
          onChange={handleTimeChange}
          className="w-20 p-2 mr-2 border border-gray-300 rounded"
          placeholder="Minutes"
        />
        <span className="text-2xl mr-2">:</span>
        <input
          type="text" // Changed to text to allow free typing
          name="seconds"
          value={initialTime % 60 || ""}
          onChange={handleTimeChange}
          className="w-20 p-2 border border-gray-300 rounded"
          placeholder="Seconds"
        />
      </div>
      <p className="text-2xl mb-6">
        Time Remaining: {formatTime(timeRemaining)}
      </p>
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
