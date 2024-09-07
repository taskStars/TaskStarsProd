"use client"; // Mark this as a Client Component
import { useState, useEffect } from "react";
import FriendCard from "./FriendCard"; // Import the new FriendCard component

const FriendsProductivity = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch friends productivity times
  useEffect(() => {
    const fetchFriendsProductivity = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/users/friendsProductivity",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure JWT token is included
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
  }, []); // Empty dependency array to fetch once on mount

  if (loading) return <p>Loading friends...</p>;
  if (error) return <p>{error}</p>;

  // Edge case: When there are no friends in the list
  if (friends.length === 0) {
    return (
      <div className="absolute right-0 top-20 max-h-[calc(100vh-5rem)] w-64 p-4 bg-white shadow-lg rounded-lg overflow-y-auto m-4"> {/* Adjusted styles */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Friends' Productivity
        </h2>
        <p className="text-gray-600">No friends found. Add some friends to track their productivity!</p>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-20 max-h-[calc(100vh-5rem)] w-64 p-4 bg-white shadow-lg rounded-lg overflow-y-auto m-4"> {/* Adjusted styles */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Friends' Productivity
      </h2>
      <ul className="space-y-4">
        {friends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </ul>
    </div>
  );
};

export default FriendsProductivity;
