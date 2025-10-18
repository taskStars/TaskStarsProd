"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ui/ThemeToggle";
import { FiLogOut, FiGithub, FiStar } from "react-icons/fi";
import Button from "./ui/Button";

const Navbar = ({ showAuthLinks = true, showGitHubLink = true }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-dark-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <FiStar className="text-primary-500 text-2xl" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              <span className="text-gradient">TaskStars</span>
            </h1>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {showGitHubLink && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com/taskStars/TaskStarsProd.git"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <FiGithub className="text-xl text-gray-700 dark:text-gray-300" />
              </motion.a>
            )}

            <ThemeToggle />

            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <FiLogOut />
                Logout
              </Button>
            ) : (
              showAuthLinks && (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
