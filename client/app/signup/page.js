// app/signup/page.js
"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import React from "react";

function SignUpPage() {
  const handleGoogleLoginSuccess = (response) => {
    const { credential } = response;

    console.log("Login Success:", response);

    // Use API to verify and create users

    // fetch("/api/auth/google", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ token: credential }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("Backend response:", data);
    //     // Handle successful response from the backend
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  };

  const handleGoogleLoginFailure = (error) => {
    console.log("Login Failed:", error);
    // Handle login failure
  };

  return (
    <GoogleOAuthProvider clientId="">
      <div className="flex w-full h-screen bg-white">
        {/*Left side holds some design*/}
        <div className="h-full w-1/2 animate-slide">
          <h2 className="flex justify-center items-center text-white">
            Be the hardest working
          </h2>
          <h3 className="flex justify-center items-center text-white">
            Compete with your friends, win more than respect
          </h3>
        </div>
        {/* Button is just for UI; GoogleLogin handles the sign-in */}
        <div className="flex w-1/2 justify-center items-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default SignUpPage;
