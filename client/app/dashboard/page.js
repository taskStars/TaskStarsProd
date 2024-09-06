// app/dashboard/page.js
import TaskManager from "../../components/TaskManager"; // Path to TaskManager component

const Dashboard = () => {
  return (
    <div>
      {/* TaskManager will handle the interactive logic */}
      <TaskManager />
    </div>
  );
};

export default Dashboard;
