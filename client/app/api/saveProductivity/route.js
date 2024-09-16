import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../server/config/db"; 
import Productivity from "../../../../server/models/Productivity"; 
import passport from "../../../../server/config/passportConfig"; 

export async function POST(req) {
  await dbConnect(); 

  return new Promise((resolve) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err || !user) {
          resolve(
            NextResponse.json({ message: "Unauthorized" }, { status: 401 })
          );
          return;
        }

        const { sessionTime } = await req.json();

        try {
          const productivityData = new Productivity({
            userId: user._id, // Use logged-in user's ID
            sessionTime,
          });

          await productivityData.save();
          resolve(
            NextResponse.json(
              { message: "Productivity data saved successfully!" },
              { status: 201 }
            )
          );
        } catch (error) {
          console.error("Failed to save productivity data:", error);
          resolve(
            NextResponse.json(
              { message: "Failed to save productivity data", error },
              { status: 500 }
            )
          );
        }
      }
    )(req); // Pass the request to the passport middleware
  });
}
