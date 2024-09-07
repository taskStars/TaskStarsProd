// app/dashboard/page.js
import FriendsProductivity from "@/components/FriendsProductivity";
import FriendSearch from "@/components/SearchUser/FriendSearch";
import TaskManager from "../../components/TaskManager";
import LockInTimer from "@/components/LockInTimer";
import TaskList from "../../components/TaskList";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100"> {/* Light background for contrast */}
      {/* Navbar Component */}
      <Navbar />

      {/* Main Dashboard Content */}
      <div className="container mx-auto mt-6"> {/* Removed extra padding */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard</h1> {/* Kept a margin for title */}

        {/* Grid Layout for Main Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* Reduced gap for tighter layout */}
          {/* Left Column - Timer and Task Manager */}
          <div className="space-y-4">
            {/* Lock-In Timer Component */}
            <div className="rounded-lg shadow bg-gray-50"> {/* Removed padding */}
              <LockInTimer />
            </div>

            {/* Task Manager Component */}
            <div className="rounded-lg shadow bg-gray-50"> {/* Removed padding */}
              <TaskManager />
            </div>
          </div>

          {/* Middle Column - Task List */}
          <div className="rounded-lg shadow bg-gray-50 h-full flex flex-col justify-between"> {/* Removed padding */}
            <TaskList />
          </div>

          {/* Right Column - Friend Search and Productivity */}
          <div className="space-y-4">
            {/* Friend Search Component */}
            <div className="rounded-lg shadow bg-gray-50"> {/* Removed padding */}
              <FriendSearch />
            </div>

            {/* Friends Productivity Component */}
            <div className="rounded-lg shadow bg-gray-50"> {/* Removed padding */}
              <FriendsProductivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
