"use client";
import { motion } from 'framer-motion';

const XPProgressRing = ({ level, xp, nextLevelXp = 1000, theme = 'brick' }) => {
  const progress = Math.min((xp / nextLevelXp) * 100, 100);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colors = {
    orange: '#f97316', // orange-500
    blue: '#3b82f6',   // blue-500
    purple: '#a855f7', // purple-500
    green: '#22c55e',  // green-500
    red: '#ef4444',    // red-500
    slate: '#64748b'   // slate-500
  };
  
  const activeColor = colors[theme] || colors.red;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Background Circle */}
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="6"
          className="text-white/10"
        />
        {/* Progress Circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={activeColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      {/* Text */}
      <div className="absolute flex flex-col items-center">
         <span className="text-xl font-bold text-white">{level}</span>
         <span className="text-[8px] uppercase tracking-wider text-slate-400">Level</span>
      </div>
    </div>
  );
};

export default XPProgressRing;
