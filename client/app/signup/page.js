"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import Navbar from "@/components/Navbar"; // Import Navbar component

export default function SignupPage() {
  const router = useRouter(); // Initialize the useRouter hook
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("User registered successfully!");
        router.push("/login"); // Redirect to the login page after successful registration
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Component */}
      <Navbar /> {/* Add Navbar at the top */}
      
      <div className="min-h-screen flex items-center justify-center bg-white"> {/* Updated background color */}
        <div className="relative bg-[#1C2331] p-8 rounded-xl shadow-2xl w-full max-w-md text-white"> {/* Updated box color */}
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-4 left-4 text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-[#1C2331] transition duration-200"
          >
            Back
          </button>
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1> {/* Adjusted Heading */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-[#0A1F44] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
              />
            </div>
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
                className="mt-1 p-2 w-full border border-[#0A1F44] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
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
                className="mt-1 p-2 w-full border border-[#0A1F44] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5998] text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0A1F44] text-white rounded hover:bg-[#3B5998] transition duration-200 font-bold shadow-md"
            >
              Register
            </button>
          </form>
          {/* Sign in with Google/GitHub buttons */}
          <div className="mt-6">
            <p className="text-center text-sm mb-4 text-white">Or sign up with:</p>
            <button
              onClick={() => router.push("http://localhost:3000/api/auth/signin")}
              className="w-full py-2 px-4 mb-2 bg-[#3B5998] text-white rounded hover:bg-[#5A6FA9] transition duration-200 font-bold shadow-md"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => router.push("http://localhost:3000/api/auth/signin")}
              className="w-full py-2 px-4 bg-[#1C2331] text-white rounded hover:bg-[#2F3E56] transition duration-200 font-bold shadow-md"
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
