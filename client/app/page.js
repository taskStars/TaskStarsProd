import Image from "next/image";
import Link from "next/link";
import APIMessage from "@/components/apitest";
import Navbar from "@/components/Navbar"; // Import Navbar component

export default function Home() {
  return (
    <>
      {/* Navbar with GitHub and auth links */}
      <Navbar showAuthLinks={true} showGitHubLink={true} />
      <main>
        {/* Updated Solid Blue Background Section */}
        <section className="bg-[#E3F2FD] py-10 text-center"> {/* Solid color background */}
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#0A1F44]">
              Welcome to TaskStars
            </h2>
            <p className="mt-2 text-base text-[#0A1F44] max-w-xl mx-auto">
              Complete tasks and compete with friends to build competition through productivity.
            </p>
            {/* Smaller icon under the description */}
            <div className="mt-4 flex justify-center">
              <Image
                src="/document-sign.svg"
                alt="welcome"
                width={100}
                height={50}
                className="mx-auto"
              />
            </div>
            <div className="mt-6">
              <Link
                href="/login"
                className="bg-[#0A1F44] border border-white text-white hover:bg-[#1E3A8A] font-semibold px-4 py-2 rounded-md shadow-md transition duration-200"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </section>

        {/* Why TaskStars Section with updated styles */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-[#0A1F44] text-center">
              Why TaskStars?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="text-center p-4 border border-[#0A1F44] bg-white rounded-lg shadow-lg"> {/* Updated card styles */}
                <Image
                  src="/business-presentation.svg"
                  alt="Organize Tasks Efficiently"
                  width={100}
                  height={100}
                  className="mx-auto mb-3"
                />
                <h3 className="text-lg font-bold text-[#0A1F44] mb-2">
                  Organize Tasks Efficiently
                </h3>
                <p className="text-sm text-[#0A1F44]">
                  Plan, organize, and complete tasks efficiently while competing with friends.
                </p>
              </div>
              {/* Card 2 */}
              <div className="text-center p-4 border border-[#0A1F44] bg-white rounded-lg shadow-lg"> {/* Updated card styles */}
                <Image
                  src="/facetime-meeting.svg"
                  alt="Compete with Friends"
                  width={100}
                  height={100}
                  className="mx-auto mb-3"
                />
                <h3 className="text-lg font-bold text-[#0A1F44] mb-2">
                  Compete with Friends
                </h3>
                <p className="text-sm text-[#0A1F44]">
                  Weekly competitions with friends to see who can be the most productive.
                </p>
              </div>
              {/* Card 3 */}
              <div className="text-center p-4 border border-[#0A1F44] bg-white rounded-lg shadow-lg"> {/* Updated card styles */}
                <Image
                  src="/designer-desk.svg"
                  alt="Transform Productivity"
                  width={100}
                  height={100}
                  className="mx-auto mb-3"
                />
                <h3 className="text-lg font-bold text-[#0A1F44] mb-2">
                  Transform Productivity
                </h3>
                <p className="text-sm text-[#0A1F44]">
                  Track your progress, challenge friends, and use AI to boost your productivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        
      </main>
    </>
  );
}
