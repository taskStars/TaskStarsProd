"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
  hover = true,
  glass = false,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={cn(glass ? "glass" : "card", hover && "card-hover", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
