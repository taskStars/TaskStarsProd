"use client";
import { useState } from "react";


const UserCard = ({ user, onAddFriend }) => {
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(null);


 const handleAddFriend = async () => {
   setLoading(true);
   setSuccess(null);
   const result = await onAddFriend(user.email); 


   if (result.success) {
     setSuccess("Friend added successfully!");
   } else {
     setSuccess(`Error: ${result.message}`);
   }
   setLoading(false);
 };


 return (
   <li className="bg-white p-4 rounded-lg shadow-md mb-4 text-black">
     <p className="text-lg font-semibold">{user.name}</p>
     <p className="text-sm text-gray-600">{user.email}</p>
     <button
       onClick={handleAddFriend}
       disabled={loading}
       className={`mt-2 py-2 px-4 rounded w-full ${
         loading
           ? "bg-gray-300 cursor-not-allowed"
           : "bg-[#3949AB] text-white px-4 py-2 rounded-full hover:bg-[#1A237E] transition duration-200"
       }`}
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
