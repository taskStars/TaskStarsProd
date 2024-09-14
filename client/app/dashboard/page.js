// app/dashboard/page.js

import FriendsProductivity from "@/components/FriendsProductivity";
import TaskManager from "../../components/TaskManager";
import LockInTimer from "@/components/LockInTimer";
import TaskList from "../../components/TaskList";
import Navbar from "@/components/Navbar";
import AIModal from "@/components/OpenAITaskCreator/AIModal";
import FriendSearch from "@/components/FriendSearch"; // Assuming this component exists

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-white"> {/* Full height, white background */}
      {/* Navbar */}
      <Navbar />

      {/* Main Dashboard Content */}
      <div className="container mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="rounded-lg shadow bg-gray-50">
              <LockInTimer />
            </div>
            <div className="rounded-lg shadow bg-gray-50">
              <TaskManager />
            </div>
            <div className="rounded-lg shadow bg-gray-50">
              <FriendSearch />
            </div>
            <div>
              <AIModal />
            </div>
          </div>

          {/* Middle Column: Task List */}
          <div className="lg:col-span-2 h-full border-r border-gray-300 flex items-center justify-center bg-white">
            <TaskList />
          </div>

          {/* Right Column: Friends Productivity */}
          <div className="lg:col-span-1 h-full flex items-center justify-center bg-white">
            <FriendsProductivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
