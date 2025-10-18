"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiTrendingUp } from "react-icons/fi";
import Card from "../ui/Card";
import { API_URL } from "@/config/api";

const UserProductivity = () => {
  const [totalProductivityTime, setTotalProductivityTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductivity = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/users/productivity`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

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

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiTrendingUp className="text-success-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Total Productivity Time
            </h2>
          </div>

          {totalProductivityTime !== null ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl font-bold text-gradient mb-6"
              >
                {formatTime(totalProductivityTime)}
              </motion.div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <FiClock className="text-primary-500" />
                You will accomplish your goals!
              </p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No productivity data available yet.
              <br />
              Start a lock-in session to track your time!
            </p>
          )}
        </motion.div>
      </Card>
    </div>
  );
};

export default UserProductivity;
