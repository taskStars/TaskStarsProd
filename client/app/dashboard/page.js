// app/dashboard/page.js

import FriendsProductivity from "@/components/FriendsProductivity";
import TaskManager from "../../components/TaskManager";
import LockInTimer from "@/components/LockInTimer";
import TaskList from "../../components/TaskList";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-white"> {/* Full height, white background */}
      {/* Line above Navbar */}
      {/* Navbar */}
      <Navbar />

      {/* Main Dashboard Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-4rem)]"> {/* Full height grid layout without gaps */}

        {/* Left Column: Lock-In Timer and Task Manager */}
        <div className="flex flex-col h-full lg:col-span-1 border-r border-gray-300"> {/* Left column with right border */}
          {/* Lock-In Timer Component */}
          <div className="flex-1 border-b border-gray-300 flex items-center justify-center bg-white"> {/* Full height with bottom border */}
            <LockInTimer />
          </div>

          {/* Task Manager Component */}
          <div className="flex-1 flex items-center justify-center bg-white"> {/* Full height */}
            <TaskManager />
          </div>
        </div>

        {/* Middle Column: Task List */}
        <div className="lg:col-span-2 h-full border-r border-gray-300 flex items-center justify-center bg-white"> {/* Middle column with right border */}
          <TaskList />
        </div>

        {/* Right Column: Friends Productivity */}
        <div className="lg:col-span-1 h-full flex items-center justify-center bg-white"> {/* Right column */}
          <FriendsProductivity />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
