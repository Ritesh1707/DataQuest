"use client";
import { CheckCircle, Trophy, Star, Zap, Radio } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities.length) {
      return (
          <div className="p-6 glass-panel rounded-2xl h-full flex flex-col items-center justify-center text-slate-500 border border-white/5 min-h-[200px]">
              <Radio className="w-8 h-8 mb-3 opacity-20 animate-pulse" />
              <p className="text-xs uppercase tracking-widest">No recent transmissions</p>
          </div>
      )
  }

  return (
    <div className="p-5 glass-panel rounded-2xl h-full border border-white/5">
       <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
         <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
         </div>
         <span className="font-mono tracking-tight uppercase text-slate-200">Mission Log</span>
       </h3>
       
       <div className="space-y-3">
          {activities.map((act, i) => (
              <div key={i} className="group relative pl-3 border-l-2 border-white/5 hover:border-white/20 transition-colors pb-1 last:pb-0">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-600 group-hover:bg-white group-hover:border-white transition-all" />
                  
                  <div className="flex gap-2 items-start">
                      <div className="mt-0.5 p-1 rounded-md bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                          {act.type === 'quiz' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                          {act.type === 'badge' && <Trophy className="w-3 h-3 text-amber-400" />}
                          {act.type === 'lesson' && <Star className="w-3 h-3 text-blue-400" />}
                      </div>
                      <div className="flex-1">
                          <div className="text-xs text-slate-200 font-medium leading-tight group-hover:text-white transition-colors line-clamp-1">{act.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{act.date}</div>
                      </div>
                  </div>
              </div>
          ))}
       </div>
    </div>
  );
};

export default RecentActivity;
