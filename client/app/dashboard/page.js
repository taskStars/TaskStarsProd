// app/dashboard/page.js
import FriendsProductivity from "@/components/FriendsProductivity";
import FriendSearch from "@/components/SearchUser/FriendSearch";
import TaskManager from "../../components/TaskManager"; // Path to TaskManager component
import LockInTimer from "@/components/LockInTimer";
import TaskList from "../../components/TaskList"; // Import TaskList component

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* LockIn Timer Component */}
      <LockInTimer />

      {/* TaskManager will handle the interactive logic */}
      <TaskManager />

      {/* Task List Component */}
      <TaskList /> {/* Add TaskList component here */}

      {/* Friends Productivity Component */}
      <FriendsProductivity />

      {/* Friend Search Component */}
      <FriendSearch />
    </div>
  );
};

export default Dashboard;
