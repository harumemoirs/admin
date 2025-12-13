import React from "react";
import GoToDashboard from "../buttons/goToDashboard";
import Image from "next/image";
import Footer from "./footer";
import Navbar from "./navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen font-[Inter]">
      <Navbar />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SECTION */}
        <div className="flex flex-col justify-center px-6 md:px-14 py-12 space-y-12">
          <div className="max-w-2xl space-y-8">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
              font-black tracking-tight text-gray-900 leading-tight"
            >
              Manage your{" "}
              <span className="text-green-main">Content Smarter</span>
            </h1>

            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600">
              Haru Memoirs — Admin Console
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
              Your centralized hub to create, organize, and publish content
              effortlessly. Gain full control of your CMS with real-time
              insights, streamlined workflows, and a beautifully crafted
              management experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <GoToDashboard />
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="relative w-full min-h-[350px] lg:min-h-full">
          <Image
            src="/login.jpg"
            alt="Dashboard showcase"
            fill
            className="object-cover"
            priority
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
