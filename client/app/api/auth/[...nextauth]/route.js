// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"; // Import GitHub provider

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID, // Use GitHub client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Use GitHub client secret
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT strategy for stateless authentication
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
  },
  secret: process.env.JWT_SECRET, // JWT secret
};

// Use named exports for each HTTP method
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
