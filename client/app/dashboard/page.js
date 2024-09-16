"use client";
import { useRouter } from "next/navigation"; // Correct import for app directory in Next.js 13
import { useEffect, useState } from "react"; // Import useState for force re-render
import FriendsProductivity from "@/components/FriendsProductivity";
import TaskManager from "@/components/TaskManager";
import LockInTimer from "@/components/LockInTimer";
import TaskList from "@/components/TaskList";
import Navbar from "@/components/Navbar";
import AIModal from "@/components/OpenAITaskCreator/AIModal";
import FriendSearch from "@/components/SearchUser/FriendSearch";
import UserProductivity from "@/components/CurrentUserProductivity/UserProductivity";

const DashboardPage = () => {
  const router = useRouter(); // Ensure this is correctly imported from 'next/navigation'
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to trigger re-render

  useEffect(() => {
    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage:", token);
      setIsAuthenticated(true); 
    } else {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        alert("You are not authenticated. Please log in.");
        router.push("/login"); 
      } else {
        setIsAuthenticated(true); 
      }
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-white">
      {/* Navbar */}
      <Navbar />
      {/* Main Dashboard Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-4rem)]">
        {/* Left Column: Lock-In Timer and Task Manager */}
        <div className="flex flex-col h-full lg:col-span-1 border-r border-gray-300">
          <div className="flex-1 border-b border-gray-300 flex items-center justify-center bg-white">
            <LockInTimer />
          </div>
          <div className="flex-1 border-b border-gray-300 flex items-center justify-center bg-white">
            <UserProductivity />
          </div>
          <div className="flex-1 flex items-center justify-center bg-white">
            <TaskManager />
          </div>
        </div>

        {/* Middle Column: Task List - Extend to Full Width/Height with Padding */}
        <div className="lg:col-span-2 h-full bg-white flex items-center justify-center border-r border-gray-300">
          <div className="w-full h-full p-4">
            <TaskList />
          </div>
        </div>

        {/* Right Column: Friends Productivity */}
        <div className="lg:col-span-1 h-full flex items-center justify-center bg-white">
          <FriendsProductivity />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
