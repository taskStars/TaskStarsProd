"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook

export default function LoginPage() {
  const router = useRouter(); // Initialize the useRouter hook
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
        console.log(
          "Token stored in localStorage:",
          localStorage.getItem("token")
        ); // Debug: Log stored token
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md text-black">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 left-4 text-black border border-black px-4 py-1 rounded hover:bg-black hover:text-white transition duration-200"
        >
          Back
        </button>
        {/* Adjusted Heading */}
        <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Log In
          </button>
        </form>
        {/* Sign in with Google/GitHub buttons */}
        <div className="mt-6">
          <p className="text-center text-sm mb-4">Or sign in with:</p>
          <button
            onClick={() => router.push("http://localhost:3000/api/auth/signin")}
            className="w-full py-2 px-4 mb-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => router.push("http://localhost:3000/api/auth/signin")}
            className="w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 transition duration-200"
          >
            Sign in with GitHub
          </button>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
