'use client';
import { motion } from 'framer-motion';
import { Shield, Sparkles, TrendingUp, Zap, Terminal } from 'lucide-react';

export default function PilotStatsCard({ user, stats, theme }) {
  // Enhanced "Command Center" ID Card look - Optimized for sizing
  return (
    <div className="w-full flex justify-center mb-8 animate-fade-in px-2 sm:px-0">
        <div className={`relative w-full max-w-5xl rounded-3xl bg-slate-900/90 border border-white/10 overflow-hidden group shadow-2xl`}>
           {/* Animated Ambient Glow */}
           <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />
           
           {/* Top Tech-line decoration */}
           <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
           
           <div className="relative z-10 p-6 md:p-8">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                 
                 {/* Left: Avatar Section (Compact Cols) */}
                 <div className="md:col-span-3 flex flex-col items-center">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 group-hover:scale-[1.02] transition-transform duration-500 ease-out">
                       {/* Avatar Frame */}
                       <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border ${theme.border} backdrop-blur-sm p-1 shadow-lg`}>
                          <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 relative">
                             <img 
                                src={`https://api.dicebear.com/9.x/dylan/svg?seed=${user?.name || 'User'}&backgroundColor=1e293b`} 
                                alt="Pilot" 
                                className="w-full h-full object-cover"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                       </div>
                       
                       {/* Level Badge */}
                       <div className="absolute -bottom-3 -right-3 bg-[#0f172a] p-1 rounded-lg border border-white/10 shadow-lg transform rotate-6">
                          <div className={`w-10 h-10 rounded ${theme.bg.replace('/50', '')} flex flex-col items-center justify-center border ${theme.border}`}>
                             <span className="text-[7px] uppercase font-bold tracking-wider text-white/70">Lvl</span>
                             <span className="text-lg font-black text-white leading-none">{user?.level}</span>
                          </div>
                       </div>
                    </div>
                 </div>
    
                 {/* Middle: Identity & Main Stats */}
                 <div className="md:col-span-6 space-y-4 text-center md:text-left">
                    <div>
                       <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-1">
                           <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-lg uppercase">
                              {user?.name}
                           </h1>
                           <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                              <Terminal className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px] font-mono text-emerald-300 tracking-widest">{stats?.identity?.topSkill || 'ROOKIE'}</span>
                           </div>
                       </div>
                       
                       <p className="text-slate-400 font-medium text-sm md:text-sm max-w-md mx-auto md:mx-0 leading-relaxed line-clamp-2">
                          {user?.bio || "Ready to deploy. Preparing metrics for the next mission cycle."}
                       </p>
                    </div>
    
                    {/* Primary Metrics Grid - More Compact */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto md:mx-0">
                       <MetricTile 
                          label="Streak" 
                          value="3 Days" 
                          icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} 
                       />
                       <MetricTile 
                          label="Rank" 
                          value={stats?.rank ? `#${stats.rank}` : 'N/A'} 
                          icon={<TrendingUp className="w-3.5 h-3.5 text-cyan-400" />} 
                       />
                       <MetricTile 
                          label="Badges" 
                          value={stats?.achievements?.filter(a => a.unlocked)?.length || 0} 
                          icon={<Shield className="w-3.5 h-3.5 text-purple-400" />} 
                       />
                    </div>
                 </div>
    
                 {/* Right: Status / Actions (Condensed) */}
                 <div className="hidden md:flex md:col-span-3 flex-col gap-2 justify-center pl-6 border-l border-white/5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">System Status</div>
                    
                    <StatusRow label="NET" value="Stable" color="bg-emerald-500" />
                    <StatusRow label="XP+" value="Active" color="bg-purple-500" animate />
                    
                    <div className="mt-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                       <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-400">XP Progress</span>
                          <span className="text-white font-mono">{user?.xp?.toLocaleString()}</span>
                       </div>
                       <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[70%]" />
                       </div>
                    </div>
                 </div>
    
              </div>
           </div>
        </div>
    </div>
  );
}

function MetricTile({ label, value, icon }) {
    return (
       <div className="flex flex-col p-2.5 rounded-xl bg-slate-950/30 border border-white/5 hover:bg-white/5 transition-colors group/tile text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1 opacity-60 group-hover/tile:opacity-100 transition-opacity">
             {icon}
             <span className="text-[9px] uppercase font-bold tracking-wider">{label}</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">{value}</div>
       </div>
    )
}

function StatusRow({ label, value, color, animate }) {
    return (
       <div className="flex items-center justify-between text-xs py-0.5">
          <span className="text-slate-400">{label}</span>
          <div className="flex items-center gap-2">
             <span className="text-white font-medium text-[10px] uppercase">{value}</span>
             <div className={`w-1 h-1 rounded-full ${color} ${animate ? 'animate-pulse' : ''}`} />
          </div>
       </div>
    )
}
