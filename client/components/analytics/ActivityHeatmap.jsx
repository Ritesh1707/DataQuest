"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ data = [] }) => {
  // data: [{ date: '2023-01-01', count: 5 }]
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    // Generate last 365 days (or ~180 for desktop fit)
    const days = 160;
    const today = new Date();
    const newGrid = [];
    
    // Create a map for fast lookup
    const dataMap = new Map();
    data.forEach(d => dataMap.set(d.date, d.count));

    for (let i = days; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      
      let intensity = 'bg-white/5';
      if (count > 0) intensity = 'bg-[#FF3621]/30';
      if (count > 2) intensity = 'bg-[#FF3621]/60';
      if (count > 5) intensity = 'bg-[#FF3621]';
      
      newGrid.push({ date: dateStr, count, intensity });
    }
    setGrid(newGrid);
  }, [data]);

  return (
    <div className="p-6 glass-panel rounded-2xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brick-red animate-pulse"></span>
        Cosmic Activity
      </h3>
      <div className="flex flex-wrap gap-1 justify-center">
        {grid.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.005 }}
            className={`w-3 h-3 rounded-sm ${day.intensity}`}
            title={`${day.date}: ${day.count} contributions`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs text-white/40 font-mono">
        <span>Oldest</span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
