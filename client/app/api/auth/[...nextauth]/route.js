// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
// import mongoose from "mongoose";
import User from "../../../../../server/models/User"; // Import User model

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login, // Use `login` if `name` is not available
          email: profile.email, // GitHub email
          image: profile.avatar_url, // GitHub avatar URL
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for stateless sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Add user ID to session
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        // Check if user exists in the database
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user if not found
          const newUser = new User({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider, // Store provider info
          });

          await newUser.save();
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error("Error checking or creating user:", error);
        return false; // Deny sign-in
      }
    },
  },
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
