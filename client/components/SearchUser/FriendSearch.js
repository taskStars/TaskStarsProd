"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiUserPlus } from "react-icons/fi";
import SearchBar from "./SearchBar";
import UserList from "./UserList";
import { API_URL } from "@/config/api";

const FriendSearch = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/api/users/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users.");
      }
    } catch (err) {
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/users/addFriend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (err) {
      return { success: false, message: "Error adding friend." };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FiUserPlus className="text-primary-500" size={18} />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Add Friends
        </h3>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      {loading && (
        <div className="flex justify-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full"
          />
        </div>
      )}
      
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}
      
      {!loading && users.length > 0 && (
        <div className="max-h-48 overflow-y-auto">
          <UserList users={users} onAddFriend={handleAddFriend} />
        </div>
      )}
      
      {!loading && users.length === 0 && !error && (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
          Search for users to add as friends
        </p>
      )}
    </div>
  );
};

export default FriendSearch;
