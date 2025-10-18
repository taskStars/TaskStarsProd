"use client";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../ui/Card";
import { useTheme } from "@/contexts/ThemeContext";

// Sample data - replace with real data from your API
const weeklyData = [
  { day: "Mon", tasks: 4, productivity: 2.5 },
  { day: "Tue", tasks: 6, productivity: 3.2 },
  { day: "Wed", tasks: 5, productivity: 4.1 },
  { day: "Thu", tasks: 8, productivity: 5.5 },
  { day: "Fri", tasks: 7, productivity: 4.8 },
  { day: "Sat", tasks: 3, productivity: 2.0 },
  { day: "Sun", tasks: 2, productivity: 1.5 },
];

const priorityData = [
  { name: "High", value: 35, color: "#ef4444" },
  { name: "Medium", value: 45, color: "#f59e0b" },
  { name: "Low", value: 20, color: "#22c55e" },
];

const categoryData = [
  { category: "Work", completed: 24, pending: 8 },
  { category: "Personal", completed: 18, pending: 12 },
  { category: "Learning", completed: 15, pending: 5 },
  { category: "Health", completed: 12, pending: 3 },
];

export default function AnalyticsDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartColors = {
    primary: "#0ea5e9",
    accent: "#a855f7",
    success: "#22c55e",
    text: isDark ? "#f1f5f9" : "#0f172a",
    grid: isDark ? "#334155" : "#e2e8f0",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm text-gray-600 dark:text-gray-400"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Weekly Task Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Weekly Task Completion
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="day" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke={chartColors.primary}
                strokeWidth={3}
                dot={{ fill: chartColors.primary, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Hours */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              Productivity Hours
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartColors.grid}
                />
                <XAxis dataKey="day" stroke={chartColors.text} />
                <YAxis stroke={chartColors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="productivity"
                  fill={chartColors.accent}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Task Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              Task Priority Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Tasks by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="category" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="completed"
                fill={chartColors.success}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="pending"
                fill={chartColors.primary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            This Month Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-500">124</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tasks Completed
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-500">32.5h</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Focus Time
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success-500">94%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Completion Rate
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-500">21</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Day Streak
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
