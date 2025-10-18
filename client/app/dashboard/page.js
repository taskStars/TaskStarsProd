"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCheckSquare, 
  FiBarChart2, 
  FiAward, 
  FiUsers, 
  FiClock 
} from "react-icons/fi";
import { toast } from "react-hot-toast";

// Main Components
import Navbar from "@/components/Navbar";
import LockInTimer from "@/components/LockInTimer";
import UserProductivity from "@/components/CurrentUserProductivity/UserProductivity";
import TaskManager from "@/components/TaskManager";
import TaskList from "@/components/TaskList";
import FriendsProductivity from "@/components/FriendsProductivity";

// Feature Components
import BadgeGallery from "@/components/gamification/BadgeGallery";
import Leaderboard from "@/components/social/Leaderboard";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import PomodoroTimer from "@/components/productivity/PomodoroTimer";

const TABS = [
  { id: "tasks", label: "Tasks", icon: FiCheckSquare },
  { id: "analytics", label: "Analytics", icon: FiBarChart2 },
  { id: "badges", label: "Badges", icon: FiAward },
  { id: "leaderboard", label: "Leaderboard", icon: FiUsers },
  { id: "pomodoro", label: "Pomodoro", icon: FiClock },
];

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setLoading(false);
      toast.success("Welcome back!");
    } else {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        toast.error("You are not authenticated. Please log in.");
        router.push("/login");
      } else {
        setIsAuthenticated(true);
        setLoading(false);
      }
    }
  }, [router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-[1920px]">
        {/* Top Section: Productivity Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Lock-In Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LockInTimer />
          </motion.div>

          {/* Total Productivity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <UserProductivity />
          </motion.div>

          {/* Task Manager */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <TaskManager />
          </motion.div>
        </div>

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Tabbed Content (2/3 width) */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden"
            >
              {/* Tab Navigation */}
              <div className="flex overflow-x-auto border-b border-gray-200 dark:border-dark-700 scrollbar-hide">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative whitespace-nowrap ${
                        isActive
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6 min-h-[600px]">
                <AnimatePresence mode="wait">
                  {activeTab === "tasks" && (
                    <motion.div
                      key="tasks"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskList />
                    </motion.div>
                  )}

                  {activeTab === "analytics" && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnalyticsDashboard />
                    </motion.div>
                  )}

                  {activeTab === "badges" && (
                    <motion.div
                      key="badges"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BadgeGallery />
                    </motion.div>
                  )}

                  {activeTab === "leaderboard" && (
                    <motion.div
                      key="leaderboard"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Leaderboard />
                    </motion.div>
                  )}

                  {activeTab === "pomodoro" && (
                    <motion.div
                      key="pomodoro"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center min-h-[500px]"
                    >
                      <PomodoroTimer />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right: Friends Section (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="xl:col-span-1"
          >
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6 sticky top-6">
              <FriendsProductivity />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
