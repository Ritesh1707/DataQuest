"use client";
import { CheckCircle, Trophy, Star, Zap } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities.length) {
      return (
          <div className="p-6 glass-panel rounded-2xl h-full flex flex-col items-center justify-center text-slate-500">
              <Zap className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">No recent activity</p>
          </div>
      )
  }

  return (
    <div className="p-6 glass-panel rounded-2xl h-full">
       <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
         Safe Harbor Log
       </h3>
       
       <div className="space-y-4">
          {activities.map((act, i) => (
              <div key={i} className="flex gap-3 items-start">
                  <div className="mt-1">
                      {act.type === 'quiz' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {act.type === 'badge' && <Trophy className="w-4 h-4 text-yellow-400" />}
                      {act.type === 'lesson' && <Star className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div>
                      <div className="text-sm text-slate-200 font-medium">{act.title}</div>
                      <div className="text-xs text-slate-500">{act.date}</div>
                  </div>
              </div>
          ))}
       </div>
    </div>
  );
};

export default RecentActivity;
