'use client';
import { Trophy, Star, TrendingUp } from 'lucide-react';

export default function MasteryAttributes({ courses = [] }) {
  // Calculate Levels
  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  
  const attrData = levels.map(level => {
      const count = courses.filter(c => c.difficulty === level).length;
      // Mock progress calculation based on a "Max" of 10 courses for visual scaling
      const progress = Math.min((count / 10) * 100, 100); 
      
      let theme = { bg: 'bg-slate-500', text: 'text-slate-400', border: 'border-slate-500' };
      if (level === 'BEGINNER') theme = { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      if (level === 'INTERMEDIATE') theme = { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' };
      if (level === 'ADVANCED') theme = { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30' };

      return { level, count, progress, theme };
  });

  return (
    <div className="p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden h-full flex flex-col">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
       
       <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-white">
             <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <Trophy className="w-4 h-4 text-yellow-500" /> 
             </div>
             <span className="font-mono tracking-tight text-sm">Mastery Attributes</span>
          </h3>

          <div className="space-y-3">
             {attrData.map((attr) => (
                <div key={attr.level} className="group relative">
                   <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${attr.theme.bg}`} />
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${attr.theme.text}`}>
                            {attr.level}
                         </span>
                      </div>
                      <span className="font-mono text-[10px] text-white">
                         {attr.count} <span className="text-slate-500">Modules</span>
                      </span>
                   </div>
                   
                   {/* Segmented Progress Bar */}
                   <div className="flex gap-1 h-2 bg-slate-900/50 p-0.5 rounded-full border border-white/5">
                      {[...Array(10)].map((_, i) => {
                         const isActive = (i / 10) * 100 < attr.progress;
                         return (
                            <div 
                              key={i} 
                              className={`flex-1 rounded-sm transition-all duration-500 ${
                                 isActive ? attr.theme.bg : 'bg-transparent'
                              } ${isActive ? 'shadow-[0_0_8px_currentColor] opacity-100' : 'opacity-0'}`}
                           />
                         );
                      })}
                   </div>
                </div>
             ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                <span>Growth Rate: +12%</span>
             </div>
             <span>System: Optimal</span>
          </div>
       </div>
    </div>
  );
}
