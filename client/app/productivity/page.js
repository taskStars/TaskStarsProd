"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductivityPage() {
  const router = useRouter();
  const [sessionTime, setSessionTime] = useState("");

  const handleChange = (e) => {
    setSessionTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/saveProductivity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure JWT token is included
          },
          body: JSON.stringify({
            sessionTime: Number(sessionTime), // Convert sessionTime to a Number
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Productivity data saved successfully!");
      } else {
        console.error(data.message || "Failed to save productivity data.");
      }
    } catch (error) {
      console.error("Error saving productivity data:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={sessionTime}
          onChange={handleChange}
          placeholder="Enter session time in seconds"
        />
        <button type="submit">Save Productivity</button>
      </form>
    </div>
  );
}
