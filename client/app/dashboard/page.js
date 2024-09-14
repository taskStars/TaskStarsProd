import FriendsProductivity from "@/components/FriendsProductivity";
import TaskManager from "../../components/TaskManager";
import LockInTimer from "@/components/LockInTimer";
import TaskList from "../../components/TaskList";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
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
          <div className="flex-1 flex items-center justify-center bg-white">
            <TaskManager />
          </div>
        </div>

        {/* Middle Column: Task List - Extend to Full Width/Height with Padding */}
        <div className="lg:col-span-2 h-full bg-white flex items-center justify-center border-r border-gray-300"> {/* Added border-r */}
          <div className="w-full h-full p-4"> {/* Added padding */}
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

export default Dashboard;
