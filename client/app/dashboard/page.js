"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckSquare,
  FiBarChart2,
  FiAward,
  FiUsers,
  FiClock,
  FiTarget,
  FiZap,
  FiTrendingUp,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { toast } from "react-hot-toast";

// Main Components
import Navbar from "@/components/Navbar";
import FocusTimer from "@/components/FocusTimer";
import UserProductivity from "@/components/CurrentUserProductivity/UserProductivity";
import TaskManager from "@/components/TaskManager";
import TaskList from "@/components/TaskList";
import FriendsProductivity from "@/components/FriendsProductivity";

// Feature Components
import BadgeGallery from "@/components/gamification/BadgeGallery";
import Leaderboard from "@/components/social/Leaderboard";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import StreakCounter from "@/components/ui/StreakCounter";
import { API_URL } from "@/config/api";

const TABS = [
  { id: "tasks", label: "Tasks", icon: FiCheckSquare },
  { id: "analytics", label: "Analytics", icon: FiBarChart2 },
  { id: "badges", label: "Badges", icon: FiAward },
  { id: "leaderboard", label: "Leaderboard", icon: FiUsers },
];

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setLoading(false);
      fetchUserName(token);
      toast.success("Welcome back!");
    } else {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        toast.error("You are not authenticated. Please log in.");
        router.push("/login");
      } else {
        setIsAuthenticated(true);
        setLoading(false);
        fetchUserName(storedToken);
      }
    }
  }, [router]);

  const fetchUserName = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserName(data.name || data.email?.split("@")[0] || "there");
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      setUserName("there");
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
      <Navbar />

      {/* Hero Section with Key Metrics */}
      <div className="border-b border-gray-200/50 dark:border-dark-700/50 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-purple-500/5 dark:from-primary-500/10 dark:via-accent-500/10 dark:to-purple-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back{userName && `, ${userName}`}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Let's make today productive
            </p>
          </motion.div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                    <FiTarget className="text-white text-2xl" />
                  </div>
                  <span className="text-sm font-medium text-green-500">
                    +12%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  24
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tasks Completed
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                    <FiZap className="text-white text-2xl" />
                  </div>
                  <StreakCounter streak={7} compact />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  7 Days
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current Streak
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg">
                    <FiTrendingUp className="text-white text-2xl" />
                  </div>
                  <span className="text-sm font-medium text-green-500">
                    +8%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  92%
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completion Rate
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <FiAward className="text-white text-2xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  12
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Badges Earned
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px]">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Sidebar - Quick Actions & Timers */}
          <div className="xl:col-span-4 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <HiSparkles className="text-accent-500" />
                Quick Actions
              </h3>
              <TaskManager />
            </motion.div>

            {/* Focus Timer (Combined Pomodoro + Lock-In) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FocusTimer />
            </motion.div>
          </div>

          {/* Center - Main Content with Sidebar Navigation */}
          <div className="xl:col-span-5 space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                        : "bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-dark-700"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden min-h-[600px]"
            >
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "tasks" && (
                    <motion.div
                      key="tasks"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Your Tasks
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-base">
                          Stay organized and get things done
                        </p>
                      </div>
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
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Analytics
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-base">
                          Track your productivity over time
                        </p>
                      </div>
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
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Badges & Achievements
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-base">
                          Celebrate your accomplishments
                        </p>
                      </div>
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
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Leaderboard
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-base">
                          Compete with your friends
                        </p>
                      </div>
                      <Leaderboard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Friends & Social */}
          <div className="xl:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6 sticky top-6"
            >
              <FriendsProductivity />
            </motion.div>

            {/* Total Productivity Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <UserProductivity />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Task Add */}
      <FloatingActionButton />

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
