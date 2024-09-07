// app/dashboard/page.js
import FriendsProductivity from "@/components/FriendsProductivity";
import FriendSearch from "@/components/SearchUser/FriendSearch";
import TaskManager from "../../components/TaskManager";
import LockInTimer from "@/components/LockInTimer";
import TaskList from "../../components/TaskList";
import Navbar from "@/components/Navbar";
import AIModal from "@/components/OpenAITaskCreator/AIModal";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Navbar */}

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
            <AIModal></AIModal>
          </div>
          </div>

          {/* Middle Column */}
          <div className="rounded-lg shadow bg-gray-50 h-full flex flex-col lg:col-span-2">
            <TaskList />
          </div>
          

          {/* Right Column */}
          {/* <div className="rounded-lg shadow bg-gray-50"> */}
            <FriendsProductivity />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
