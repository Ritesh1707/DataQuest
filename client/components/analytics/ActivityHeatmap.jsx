"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ data = [] }) => {
  // data: [{ date: '2023-01-01', count: 5 }]
  // derived state - no need for useEffect if calculation is cheap
  const days = 160; 
  const today = new Date();
  
  // Create a map for fast lookup
  const dataMap = new Map();
  data.forEach(d => dataMap.set(d.date, d.count));

  const grid = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = dataMap.get(dateStr) || 0;
      
    let intensity = 'bg-white/5';
    if (count > 0) intensity = 'bg-[#FF3621]/30';
    if (count > 2) intensity = 'bg-[#FF3621]/60';
    if (count > 5) intensity = 'bg-[#FF3621]';
      
    grid.push({ date: dateStr, count, intensity });
  }

  return (
    <div className="p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden group">
      {/* Scan line animation overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-10 w-full animate-scan pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black tracking-widest uppercase text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-cyan-500 animate-pulse box-shadow-[0_0_10px_#06b6d4]"></span>
          Safe Harbor Log
        </h3>
        <div className="flex gap-2 text-[10px] uppercase font-mono text-slate-500">
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-800 rounded-sm"/> Idle</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-900 rounded-sm"/> Active</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.5)]"/> Peak</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
        {grid.map((day, i) => {
           // Improved intensity logic
           let color = 'bg-slate-900 border border-slate-800'; 
           if (day.count > 0) color = 'bg-cyan-900/40 border border-cyan-800/50';
           if (day.count > 2) color = 'bg-cyan-600/60 border border-cyan-500/50 shadow-[0_0_5px_rgba(8,145,178,0.3)]';
           if (day.count > 5) color = 'bg-cyan-400 border border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.6)] animate-pulse-slow';
           
           return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.002 }}
              className={`w-3 h-3 rounded-[1px] ${color} hover:scale-150 transition-transform duration-200 cursor-crosshair relative group/cell`}
            >
               {/* Tooltip */}
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:block z-20">
                  <div className="bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap border border-white/20">
                     {day.date}: {day.count} Ops
                  </div>
               </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] text-slate-600 font-mono uppercase tracking-widest border-t border-white/5 pt-2">
         <span>t-{days} days</span>
         <span>System Time: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
