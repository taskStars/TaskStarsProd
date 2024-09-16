"use client"; 

import { useEffect, useState } from "react";

export default function APIMessage() {
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    // Fetch from backend API
    fetch("https://taskstars.onrender.com/test") 
      .then((response) => response.json())
      .then((data) => setApiMessage(data.message))
      .catch((error) => console.error("Error fetching API:", error));
  }, []);

  return (
    <div>
      <h1>Next.js and Express Integration Test (App Router)</h1>
      <p>API Response: {apiMessage}</p> 
    </div>
  );
}
