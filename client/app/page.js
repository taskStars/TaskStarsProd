"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FiCheckCircle, FiUsers, FiTrendingUp, FiZap } from "react-icons/fi";

export default function Home() {
  const features = [
    {
      icon: <FiCheckCircle className="w-12 h-12 text-primary-500" />,
      title: "Organize Tasks Efficiently",
      description:
        "Plan, organize, and complete tasks efficiently while competing with friends.",
      image: "/business-presentation.svg",
    },
    {
      icon: <FiUsers className="w-12 h-12 text-accent-500" />,
      title: "Compete with Friends",
      description:
        "Weekly competitions with friends to see who can be the most productive.",
      image: "/facetime-meeting.svg",
    },
    {
      icon: <FiTrendingUp className="w-12 h-12 text-success-500" />,
      title: "Transform Productivity",
      description:
        "Track your progress, challenge friends, and use AI to boost your productivity.",
      image: "/designer-desk.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800">
      {/* Navbar */}
      <Navbar showAuthLinks={true} showGitHubLink={true} />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent-200/30 dark:bg-accent-900/20 rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-gradient">Welcome to TaskStars</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Complete tasks and compete with friends to build competition
                through productivity.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex justify-center mb-12"
              >
                <Image
                  src="/document-sign.svg"
                  alt="welcome"
                  width={120}
                  height={60}
                  className="animate-float"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex gap-4 justify-center flex-wrap"
              >
                <Link href="/signup">
                  <Button variant="primary" size="lg" className="gap-2">
                    <FiZap /> Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                <span className="text-gradient">Why TaskStars?</span>
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                Discover the power of productivity gamification
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Card className="text-center p-8 h-full">
                    <div className="mb-6 flex justify-center">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={100}
                        height={100}
                        className="mx-auto"
                      />
                    </div>
                    <div className="mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-900/20 dark:to-accent-900/20" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-gradient">Level Up</span> Your
                Productivity?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join thousands of users who are already crushing their goals
              </p>
              <Link href="/signup">
                <Button variant="accent" size="lg" className="gap-2">
                  <FiZap /> Join the Community
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
