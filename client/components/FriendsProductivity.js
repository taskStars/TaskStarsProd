"use client"; 
import { useState, useEffect } from "react";
import FriendCard from "./FriendCard"; 
import FriendSearch from "@/components/SearchUser/FriendSearch"; 

const FriendsProductivity = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendsProductivity = async () => {
      try {
        const response = await fetch(
          "https://taskstars.onrender.com/api/users/friendsProductivity",
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
