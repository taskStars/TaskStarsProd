"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    <nav className="bg-[#2C3E50] shadow-md p-4"> 
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <Image
            src="/icon.svg"
            alt="Star Icon"
            width={30}
            height={30}
            aria-label="TaskStars Logo"
          />
          <h1 className="text-2xl font-bold text-white">
            <Link href="/">TaskStars</Link>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {showGitHubLink && (
            <a
              href="https://github.com/taskStars/TaskStarsProd.git"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <Image src="/github.svg" alt="GitHub" width={24} height={24} />
            </a>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-[#E3F2FD] text-black px-4 py-2 rounded hover:bg-[#3949AB] transition duration-200"
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            showAuthLinks && (
              <div className="flex space-x-4">
                <Link href="/signup">
                  <span className="text-white hover:text-blue-300 transition-colors duration-200"> {/* Text color updated for better visibility */}
                    Signup
                  </span>
                </Link>
                <Link href="/login">
                  <span className="text-white hover:text-blue-300 transition-colors duration-200"> {/* Text color updated for better visibility */}
                    Login
                  </span>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
