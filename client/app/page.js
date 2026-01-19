'use client';
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
          Gamify Your Data Journey
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          Master Databricks & Spark through interactive coding challenges. 
          Compete on leaderboards, earn badges, and build real-world skills.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/25"
          >
            Start Learning Now
          </Link>
          <Link 
            href="/about"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold text-lg transition-all"
          >
            How it Works
          </Link>
        </div>
      </main>
    </div>
  );
}
