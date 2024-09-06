"use client";
import { useState } from "react";

const UserCard = ({ user, onAddFriend }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleAddFriend = async () => {
    setLoading(true);
    setSuccess(null);
    const result = await onAddFriend(user.email); // Calls the onAddFriend function passed from parent

    if (result.success) {
      setSuccess("Friend added successfully!");
    } else {
      setSuccess(`Error: ${result.message}`);
    }
    setLoading(false);
  };

  return (
    <li className="mb-2 border-b border-gray-200 pb-2">
      <p className="text-lg font-semibold">{user.name}</p>
      <p className="text-sm text-gray-600">{user.email}</p>
      <button
        onClick={handleAddFriend}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2 w-full"
      >
        {loading ? "Adding..." : "Add Friend"}
      </button>
      {success && (
        <p
          className={`mt-2 ${
            success.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {success}
        </p>
      )}
    </li>
  );
};

export default UserCard;
