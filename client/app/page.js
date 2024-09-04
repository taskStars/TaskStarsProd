import Image from "next/image";
import Link from "next/link";
import APIMessage from "@/components/apitest";

export default function Home() {
  return (
    <>
      <header>
        <nav className="bg-white p-4 shadow-md">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center space-x-2">
              {/* Star icon in front of TaskStars */}
              <Image src="/icon.svg" alt="Star Icon" width={30} height={30} />
              <h1 className="text-2xl font-bold text-black">
                <Link href="/">TaskStars</Link>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* GitHub Icon Link */}
              <a
                href="https://github.com/taskStars/TaskStarsProd.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/github.svg" alt="GitHub" width={24} height={24} />
              </a>
              {/* Login and Signup Links */}
              <Link href="/signup" className="text-black">
                Signup
              </Link>
              <Link href="/login" className="text-black">
                Login
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main>
        {/* Increased padding for the blue section */}
        <section className="bg-mainBlue py-16 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-black">
              Welcome to TaskStars
            </h2>
            <p className="mt-4 text-lg text-black">
              Complete tasks and compete with friends to build competition
              through productivity.
            </p>
            {/* Three stars icon under the description */}
            <div className="mt-4 flex justify-center">
              <Image
                src="/document-sign.svg" // Adjust the path if necessary
                alt="welcome"
                width={150}
                height={70}
              />
            </div>
            <div className="mt-8 space-x-4">
              <Link
                href="/Login"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </section>

        {/* Adjusted Section to be slightly more in height */}
        <section className="py-8 bg-white">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              Why TaskStars?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Image
                  src="/business-presentation.svg"
                  alt="Organize Tasks Efficiently"
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-black mb-2">
                  Organize Tasks Efficiently
                </h3>
                <p className="text-black">
                  TaskStars helps you plan, organize, and complete tasks
                  efficiently while competing with friends to make productivity
                  fun.
                </p>
              </div>
              <div className="text-center">
                <Image
                  src="/facetime-meeting.svg"
                  alt="Compete with Friends"
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-black mb-2">
                  Compete with Friends
                </h3>
                <p className="text-black">
                  Compete weekly with friends to see who can be the most
                  productive, using our integrated OpenAI-powered assistant to
                  help with task planning and execution.
                </p>
              </div>
              <div className="text-center">
                <Image
                  src="/designer-desk.svg"
                  alt="Transform Productivity"
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-black mb-2">
                  Transform Productivity
                </h3>
                <p className="text-black">
                  Track your progress, challenge friends, and use AI to boost
                  your productivity like never before.
                </p>
              </div>
            </div>
          </div>
        </section>
        <APIMessage />
      </main>
    </>
  );
}
