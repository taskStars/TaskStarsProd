"use client";
import { useState } from "react";
import SearchBar from "./SearchBar";
import UserList from "./UserList";


const FriendSearch = () => {
 const [users, setUsers] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);


 const handleSearch = async (query) => {
   setLoading(true);
   setError(null);
   try {
     const response = await fetch(
       `http://localhost:8080/api/users/search?query=${query}`,
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
     const response = await fetch(
       "http://localhost:8080/api/users/addFriend",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         body: JSON.stringify({ email }),
       }
     );
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
   <div className="p-2 h-60 overflow-y-auto bg-white border-t border-gray-200"> {/* Added height and scroll styles */}
     <h2 className="text-lg font-bold mb-2 text-gray-800">Search for Users</h2>
     <SearchBar onSearch={handleSearch} />
     {loading && <p>Loading users...</p>}
     {error && <p className="text-red-500">{error}</p>}
     {!loading && users.length > 0 && (
       <UserList users={users} onAddFriend={handleAddFriend} />
     )}
     {!loading && users.length === 0 && !error && (
       <p className="text-gray-600">No users found.</p>
     )}
   </div>
 );
};


export default FriendSearch;
