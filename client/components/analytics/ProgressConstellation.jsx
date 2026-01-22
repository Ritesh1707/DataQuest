"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProgressConstellation = ({ courses = [] }) => {
  // Mock data simulation if real structure is complex
  // Convert courses -> modules -> lessons into nodes
  const nodes = [];
  const lines = [];

  // Generate constellation layout
  // Simple spiral or random placement for "Star Map" feel
  courses.forEach((course, cIdx) => {
      course.modules?.forEach((mod, mIdx) => {
          mod.lessons?.forEach((lesson, lIdx) => {
              const angle = (cIdx * 50 + mIdx * 20 + lIdx * 10);
              const radius = 30 + (lIdx * 15);
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              
              const id = `${course.id}-${mod.id}-${lesson.id}`;
              nodes.push({
                  id, 
                  x, 
                  y, 
                  title: lesson.title,
                  completed: false, // Need actual status passed in props
                  type: 'lesson'
              });

              if (lIdx > 0) {
                  const prevId = `${course.id}-${mod.id}-${mod.lessons[lIdx-1].id}`;
                  lines.push({ from: prevId, to: id });
              }
          });
      });
  });

  // Placeholder static data for visual if empty
  const [stars, setStars] = useState([
     { id: 1, x: 20, y: 50, active: true, title: "Origin" },
     { id: 2, x: 35, y: 30, active: true, title: "Bronze Layer" },
     { id: 3, x: 50, y: 50, active: false, title: "Silver Transformation" },
     { id: 4, x: 65, y: 20, active: false, title: "Gold Aggregates" },
     { id: 5, x: 80, y: 60, active: false, title: "Analysis" },
  ]);

  return (
    <div className="p-6 glass-panel rounded-2xl h-full relative overflow-hidden group">
       <div className="absolute inset-0 bg-[url('/assets/constellation_bg.png')] opacity-20 bg-cover" />
       
       <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
        <span className="text-brick-red">★</span>
        Learning Path
      </h3>

      <div className="relative w-full h-[300px] border border-white/5 rounded-xl bg-slate-900/40">
         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Connecting Lines */}
            <path d="M 20 50 L 35 30 L 50 50 L 65 20 L 80 60" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
            <path d="M 20 50 L 35 30" stroke="#FF3621" strokeWidth="0.5" fill="none" className="motion-safe:animate-draw" />
            
            {/* Stars */}
            {stars.map((star) => (
                <g key={star.id} className="cursor-pointer group/star">
                    <circle 
                        cx={star.x} 
                        cy={star.y} 
                        r={star.active ? 2 : 1.5} 
                        fill={star.active ? "#FF3621" : "#475569"} 
                        className="transition-all duration-300"
                    />
                    <circle 
                        cx={star.x} 
                        cy={star.y} 
                        r={star.active ? 4 : 0} 
                        fill="#FF3621" 
                        opacity="0.3" 
                        className="animate-pulse"
                    />
                    
                    {/* Tooltip */}
                    <text 
                        x={star.x} 
                        y={star.y - 5} 
                        fontSize="3" 
                        fill="white" 
                        textAnchor="middle" 
                        className="opacity-0 group-hover/star:opacity-100 transition-opacity"
                    >
                        {star.title}
                    </text>
                </g>
            ))}
         </svg>
      </div>
    </div>
  );
};

export default ProgressConstellation;
