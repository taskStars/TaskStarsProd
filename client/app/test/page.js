// app/test/page.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Adjust path as needed
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  // Fetch the session server-side
  const session = await getServerSession(authOptions);

  // If there is no session, redirect to the sign-in page
  if (!session) {
    redirect("/api/auth/signin"); // Use next/navigation for server-side redirect
  }

  return <div>Welcome to the protected page, {session.user.email}!</div>;
}
