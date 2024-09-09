// app/dashboard/page.js
import FriendsProductivity from "@/components/FriendsProductivity";
import FriendSearch from "@/components/SearchUser/FriendSearch";
import TaskManager from "../../components/TaskManager";
import LockInTimer from "@/components/LockInTimer";
import TaskList from "../../components/TaskList";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Navbar */}

      {/* Main Dashboard Content */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="space-y-4 flex flex-col items-start"> {/* Updated styles */}
            {/* Lock-In Timer Component */}
            <div className="w-full">
              <LockInTimer />
            </div>

            {/* Task Manager Component */}
            <div className="w-full">
              <TaskManager />
            </div>
          </div>

          {/* Middle Column */}
          <div className="shadow h-full flex flex-col lg:col-span-2">
            <TaskList />
          </div>

          {/* Right Column */}
          <div className="w-1/4 h-full fixed right-0 top-17 flex flex-col p-0">
            {/* Friends list */}
            <FriendsProductivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
