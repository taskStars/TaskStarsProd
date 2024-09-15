"use client"; // Mark this as a Client Component
import { useState, useEffect } from "react";
import FriendCard from "./FriendCard"; // Import the new FriendCard component
import FriendSearch from "@/components/SearchUser/FriendSearch"; // Import SearchUser component

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
  if (error) return <p className="text-black text-center">{error}</p>;

  return (
    <div className="flex flex-col h-full bg-white ">
      {/* Friends' Productivity List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Friends' Productivity
        </h2>
        {friends.length === 0 ? (
          <p className="text-black">
            No friends found. Add some friends to track their productivity!
          </p>
        ) : (
          <ul className="space-y-4">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </ul>
        )}
      </div>

      <div
        className="p-4 border-t border-gray-200 flex flex-col flex-shrink-0"
        style={{ marginTop: "auto" }}
      >
        {" "}
        {/* Adjusted container styles */}
        <FriendSearch />
      </div>
    </div>
  );
};

export default FriendsProductivity;
