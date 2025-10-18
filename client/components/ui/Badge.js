"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  primary: "badge-primary",
  success: "badge-success",
  warning: "badge-warning",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  default: "bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300",
};

export default function Badge({
  children,
  variant = "default",
  className,
  pulse = false,
  ...props
}) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "badge inline-flex items-center gap-1",
        variants[variant],
        pulse && "animate-pulse",
        className
      )}
      {...props}
    >
      {children}
    </motion.span>
  );
}
