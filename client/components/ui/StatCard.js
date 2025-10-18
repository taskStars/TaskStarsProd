"use client";
import { motion } from "framer-motion";
import Card from "./Card";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
  delay = 0,
}) {
  const colors = {
    primary: "text-primary-500 bg-primary-100 dark:bg-primary-900/30",
    success: "text-success-500 bg-success-100 dark:bg-success-900/30",
    warning: "text-warning-500 bg-warning-100 dark:bg-warning-900/30",
    accent: "text-accent-500 bg-accent-100 dark:bg-accent-900/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="p-6 hover:shadow-glow-md transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: delay + 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="text-3xl font-bold text-gray-900 dark:text-gray-50"
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 }}
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                  trend > 0
                    ? "text-success-600 dark:text-success-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <span>{trend > 0 ? "↑" : "↓"}</span>
                <span>{Math.abs(trend)}%</span>
              </motion.div>
            )}
          </div>
          {Icon && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-3 rounded-xl ${colors[color]}`}
            >
              <Icon className="text-xl" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
