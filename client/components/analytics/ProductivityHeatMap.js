"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Card from "../ui/Card";

// Generate last 365 days of data
const generateHeatMapData = () => {
  const data = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate random activity level (0-4)
    const level = Math.floor(Math.random() * 5);

    data.push({
      date: date.toISOString().split("T")[0],
      level,
      count: level * 3, // Tasks completed
    });
  }

  return data;
};

const getColorForLevel = (level) => {
  const colors = [
    "bg-gray-100 dark:bg-dark-800",
    "bg-success-200 dark:bg-success-900/30",
    "bg-success-400 dark:bg-success-700/50",
    "bg-success-600 dark:bg-success-600/70",
    "bg-success-800 dark:bg-success-500",
  ];
  return colors[level] || colors[0];
};

const getMonthLabel = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short" });
};

const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  return date.getDay();
};

export default function ProductivityHeatMap() {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [data] = useState(generateHeatMapData());

  // Group data by weeks
  const weeks = [];
  let currentWeek = [];

  data.forEach((day, index) => {
    const dayOfWeek = getDayOfWeek(day.date);

    // Start new week on Sunday
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(day);

    // Push last week
    if (index === data.length - 1) {
      weeks.push(currentWeek);
    }
  });

  // Get month labels
  const monthLabels = [];
  let lastMonth = "";

  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0];
    const month = getMonthLabel(firstDay.date);

    if (month !== lastMonth) {
      monthLabels.push({ week: weekIndex, label: month });
      lastMonth = month;
    }
  });

  const totalContributions = data.reduce((sum, day) => sum + day.count, 0);
  const currentStreak = calculateStreak(data);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Productivity Heat Map
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {totalContributions} tasks in the last year
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current Streak
          </p>
          <p className="text-2xl font-bold text-gradient-fire">
            {currentStreak} days 🔥
          </p>
        </div>
      </div>

      {/* Heat Map */}
      <div className="overflow-x-auto hide-scrollbar">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex gap-1 mb-2 ml-6">
            {monthLabels.map((month, index) => (
              <div
                key={index}
                style={{ marginLeft: `${month.week * 12}px` }}
                className="text-xs text-gray-600 dark:text-gray-400 absolute"
              >
                {month.label}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400 mr-1">
              <div className="h-2.5"></div>
              <div>Mon</div>
              <div className="h-2.5"></div>
              <div>Wed</div>
              <div className="h-2.5"></div>
              <div>Fri</div>
              <div className="h-2.5"></div>
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                  const day = week.find(
                    (d) => getDayOfWeek(d.date) === dayIndex
                  );

                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                      whileHover={{ scale: 1.5, zIndex: 10 }}
                      onHoverStart={() => day && setHoveredDay(day)}
                      onHoverEnd={() => setHoveredDay(null)}
                      className={`w-2.5 h-2.5 rounded-sm cursor-pointer transition-all ${
                        day ? getColorForLevel(day.level) : "bg-transparent"
                      }`}
                      title={day ? `${day.date}: ${day.count} tasks` : ""}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getColorForLevel(level)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 glass rounded-xl"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-50">
                {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {hoveredDay.count} tasks completed
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl ${getColorForLevel(
                hoveredDay.level
              )} flex items-center justify-center text-2xl`}
            >
              {hoveredDay.level === 0
                ? "😴"
                : hoveredDay.level === 1
                ? "😊"
                : hoveredDay.level === 2
                ? "😄"
                : hoveredDay.level === 3
                ? "🚀"
                : "🔥"}
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}

function calculateStreak(data) {
  let streak = 0;

  // Start from today and go backwards
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].level > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
