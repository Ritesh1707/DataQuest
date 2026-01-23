'use client';
import { Trophy } from 'lucide-react';

export default function MasteryAttributes({ courses = [] }) {
  // Calculate Levels
  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  
  const attrData = levels.map(level => {
      const count = courses.filter(c => c.difficulty === level).length;
      // Mock progress calculation based on a "Max" of 10 courses for visual scaling
      const progress = Math.min((count / 10) * 100, 100); 
      
      let colorClass = 'bg-slate-500';
      if (level === 'BEGINNER') colorClass = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
      if (level === 'INTERMEDIATE') colorClass = 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
      if (level === 'ADVANCED') colorClass = 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]';

      return { level, count, progress, colorClass };
  });

  return (
    <div className="p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
       
       <div className="relative z-10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
             <Trophy className="w-5 h-5 text-yellow-500" /> 
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Mastery Attributes</span>
          </h3>

          <div className="space-y-6">
             {attrData.map((attr) => (
                <div key={attr.level} className="group">
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors duration-300">
                         {attr.level}
                      </span>
                      <span className="font-mono text-xs text-white bg-slate-800 px-2 py-0.5 rounded border border-white/5">
                         LVL {attr.count}
                      </span>
                   </div>
                   
                   {/* Segmented Progress Bar */}
                   <div className="flex gap-1 h-2">
                      {[...Array(10)].map((_, i) => (
                         <div 
                           key={i} 
                           className={`flex-1 rounded-sm transition-all duration-500 ${
                              (i / 10) * 100 < attr.progress 
                                 ? attr.colorClass 
                                 : 'bg-slate-800'
                           } ${
                              (i / 10) * 100 < attr.progress 
                                 ? 'opacity-100 group-hover:shadow-lg' 
                                 : 'opacity-50'
                           }`}
                         />
                      ))}
                   </div>
                </div>
             ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono text-center uppercase tracking-widest">
             System Analysis: Balanced Growth Recommended
          </div>
       </div>
    </div>
  );
}
