"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; // Import Navbar component

const BACKEND_URL = "https://taskstars.onrender.com"; // Use production URL directly

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store the JWT token in localStorage
        setMessage("Login successful!");
        router.push("/dashboard"); // Redirect to dashboard or home page after successful login
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      {/* Navbar Component */}
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative bg-[#1C2331] p-8 rounded-xl shadow-2xl w-full max-w-md text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-[#0A1F44] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-[#0A1F44] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0A1F44] text-white rounded hover:bg-[#1C2331] transition duration-200 font-bold shadow-md"
            >
              Log In
            </button>
          </form>

          {/* Sign in with Google/GitHub buttons */}
          <div className="mt-6">
            <p className="text-center text-sm mb-4 text-white">
              Or sign in with:
            </p>
            {/* OAuth login for Google */}
            <a
              href={`${BACKEND_URL}/api/auth/google`}
              className="w-full block py-2 px-4 mb-2 bg-[#3B5998] text-white rounded hover:bg-[#1C2331] transition duration-200 font-bold shadow-md text-center"
            >
              Sign in with Google
            </a>
            {/* OAuth login for GitHub */}
            <a
              href={`${BACKEND_URL}/api/auth/github`}
              className="w-full block py-2 px-4 bg-[#1C2331] text-white rounded hover:bg-[#0A1F44] transition duration-200 font-bold shadow-md text-center"
            >
              Sign in with GitHub
            </a>
          </div>
          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
