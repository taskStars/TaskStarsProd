// app/dashboard/page.js
import FriendsProductivity from "@/components/FriendsProductivity";
import FriendSearch from "@/components/SearchUser/FriendSearch";
import TaskManager from "../../components/TaskManager"; // Path to TaskManager component
import LockInTimer from "@/components/LockInTimer";

const Dashboard = () => {
  return (
    <div>
      {/* TaskManager will handle the interactive logic */}
      <LockInTimer />
      <TaskManager />
      <FriendsProductivity></FriendsProductivity>
      <FriendSearch></FriendSearch>
    </div>
  );
};

export default Dashboard;
