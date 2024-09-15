"use client";
import React, { useEffect, useState } from "react";

const UserProductivity = () => {
  const [totalProductivityTime, setTotalProductivityTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user productivity time when component mounts
    const fetchProductivity = async () => {
      try {
        setLoading(true);

        // Get token from localStorage (or context, or wherever you store it)
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8080/api/users/productivity",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch productivity data");
        }

        const data = await response.json();
        setTotalProductivityTime(data.totalProductivityTime);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching productivity:", err);
        setError("Failed to load productivity data.");
        setLoading(false);
      }
    };

    fetchProductivity();
  }, []);

  // Helper function to format time in seconds to HH:mm:ss
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div>Loading your productivity...</div>;
  }

  if (error) {
    return <div className="text-black text-center">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-black">
        {" "}
        Total Productivity Time!
      </h1>
      {totalProductivityTime !== null ? (
        <>
          <p className="text-lg font-medium mb-6 text-center text-black">
            {" "}
            {formatTime(totalProductivityTime)}
          </p>
          <p className="text-xl font-bold text-center text-black ">
            You will accomplish your goals!
          </p>{" "}
          {/* New Line */}
        </>
      ) : (
        <p>No productivity data available.</p>
      )}
    </div>
  );
};

export default UserProductivity;
