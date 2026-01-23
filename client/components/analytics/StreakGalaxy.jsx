'use client';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';

export default function StreakGalaxy({ streak = 3, activity = [] }) {
  // activity: [{ date: '2023-10-01', count: 5 }]
  // We need last 7 days
  const days = 7;
  const galaxy = [];
  const today = new Date();
  
  // Create mock data if activity empty
  for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const isToday = i === 0;
      
      // Simulate activity logic (replace with real prop check later)
      const isActive = i < streak; 
      
      galaxy.push({ day: dayName, active: isActive, isToday });
  }

  return (
    <div className="relative overflow-hidden glass-panel p-6 rounded-2xl border border-white/5 min-h-[200px] flex items-center justify-center">
       {/* Background Stars (Css animated) */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/50 to-black z-0" />
       
       <div className="absolute top-0 left-0 w-full h-full opacity-30">
          {[...Array(20)].map((_, i) => (
             <div 
               key={`star-${i}`}
               className="absolute bg-white rounded-full animate-twinkle"
               style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 3}s`
               }}
             />
          ))}
       </div>

       <div className="relative z-10 w-full">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <Zap className="w-5 h-5 text-yellow-400" fill="currentColor" />
                   Cosmic Streak
                </h3>
                <p className="text-xs text-slate-400">Keep the constellation alive!</p>
             </div>
             <div className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                {streak} Days
             </div>
          </div>

          <div className="flex justify-between items-end relative">
             {/* Connecting Line */}
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2" />
             
             {galaxy.map((node, i) => (
                <div key={node.day} className="flex flex-col items-center gap-2 group">
                   <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 relative ${
                         node.active 
                           ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                           : node.isToday 
                              ? 'bg-slate-800 border-white/20 animate-pulse'
                              : 'bg-slate-900 border-slate-700'
                      }`}
                   >
                      {node.active ? (
                         <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                      ) : (
                         <div className="w-2 h-2 rounded-full bg-slate-700" />
                      )}
                      
                      {/* Interaction tooltip */}
                      {node.active && (
                         <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
                            XP Earned
                         </div>
                      )}
                   </motion.div>
                   <span className={`text-xs font-mono uppercase ${node.isToday ? 'text-white font-bold' : 'text-slate-500'}`}>
                      {node.day}
                   </span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}
