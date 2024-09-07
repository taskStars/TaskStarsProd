"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; // Import Navbar component

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
      const response = await fetch("http://localhost:8080/api/auth/login", {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <div className="relative bg-white bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 p-8 rounded-xl shadow-2xl w-full max-w-md text-black">
          {/* Adjusted Heading */}
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 transition duration-200 font-bold shadow-md"
            >
              Log In
            </button>
          </form>
          {/* Sign in with Google/GitHub buttons */}
          <div className="mt-6">
            <p className="text-center text-sm mb-4 text-white">Or sign in with:</p>
            <button
              onClick={() => router.push("http://localhost:3000/api/auth/signin")}
              className="w-full py-2 px-4 mb-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded hover:from-red-600 hover:to-pink-700 transition duration-200 font-bold shadow-md"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => router.push("http://localhost:3000/api/auth/signin")}
              className="w-full py-2 px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded hover:from-gray-900 hover:to-black transition duration-200 font-bold shadow-md"
            >
              Sign in with GitHub
            </button>
          </div>
          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
