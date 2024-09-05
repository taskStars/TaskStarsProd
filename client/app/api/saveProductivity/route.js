import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../server/config/db"; // Corrected path to DB connection
import Productivity from "../../../../server/models/Productivity"; // Corrected path to Productivity model
import passport from "../../../../server/config/passportConfig"; // Import your passport configuration

export async function POST(req) {
  await dbConnect(); // Ensure the database connection is established

  return new Promise((resolve) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err || !user) {
          // Return unauthorized if the user is not authenticated
          resolve(
            NextResponse.json({ message: "Unauthorized" }, { status: 401 })
          );
          return;
        }

        // Extract data from the request body
        const { sessionTime } = await req.json();

        try {
          // Use the authenticated user's ID from req.user
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
