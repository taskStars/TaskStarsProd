"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FriendCard from "./FriendCard";
import FriendSearch from "@/components/SearchUser/FriendSearch";
import { API_URL } from "@/config/api";

const FriendsProductivity = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendsProductivity = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/friendsProductivity`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setFriends(data);
        } else {
          setError("Failed to fetch friends' productivity.");
        }
      } catch (error) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsProductivity();
  }, []);

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
      <p className="text-red-600 dark:text-red-400 text-center p-4">{error}</p>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Friends' Productivity List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Friends' Productivity
        </h2>
        {friends.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 dark:text-gray-400 py-8"
          >
            <div className="text-4xl mb-2">👥</div>
            <p>No friends found.</p>
            <p className="text-sm mt-1">
              Add some friends to track their productivity!
            </p>
          </motion.div>
        ) : (
          <ul className="space-y-3">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FriendCard friend={friend} />
              </motion.div>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-dark-700">
        <FriendSearch />
      </div>
    </div>
  );
};

export default FriendsProductivity;
