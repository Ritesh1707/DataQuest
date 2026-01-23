'use client';
import { motion } from 'framer-motion';
import { Shield, Sparkles, TrendingUp, Zap } from 'lucide-react';

export default function PilotStatsCard({ user, stats, theme }) {
  // Enhanced "Holographic" ID Card look
  return (
    <div className={`relative p-1 rounded-3xl bg-gradient-to-br ${theme.bg} overflow-hidden mb-12 animate-fade-in group`}>
       {/* Animated Border Glow */}
       <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-0 pointer-events-none`} />
       
       <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-[22px] p-8 border border-white/10">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
             {/* Holographic Avatar Frame */}
             <div className="relative">
                <div className={`w-32 h-32 rounded-2xl border-2 ${theme.border} flex items-center justify-center bg-slate-900/80 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                   <img 
                      src={`https://api.dicebear.com/9.x/dylan/svg?seed=${user?.name || 'User'}&backgroundColor=1e293b`} 
                      alt="Pilot" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                   />
                   {/* Scanline effect */}
                   <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,255,0,0.1)_50%,transparent_100%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                </div>
                {/* Level Badge */}
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-brick rounded-lg rotate-12 flex items-center justify-center font-black text-white shadow-lg border-2 border-[#1e293b]">
                   {user?.level}
                </div>
             </div>

             <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                   <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                      <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">
                         {user?.name}
                      </h1>
                      <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border ${theme.border} ${theme.text} bg-black/50`}>
                         ID-{user?.id?.substring(0,6) || '0000'}
                      </div>
                   </div>
                   <p className={`text-sm font-mono tracking-widest uppercase ${theme.text} opacity-80 flex items-center gap-2 justify-center md:justify-start`}>
                      <Shield className="w-3 h-3" /> Class: {stats?.identity?.topSkill || 'Novice'} // {user?.xp.toLocaleString()} XP
                   </p>
                </div>

                {/* Status Hexagons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                   <StatusHex label="Streak" value="3 Days" icon={<Zap className="w-3 h-3" />} color="text-yellow-400" border="border-yellow-500/30" />
                   <StatusHex label="Rank" value={stats?.rank ? `#${stats.rank}` : '#--'} icon={<TrendingUp className="w-3 h-3" />} color="text-brick" border="border-brick/30" />
                   <StatusHex label="Badges" value={stats?.achievements?.filter(a => a.unlocked)?.length || 0} icon={<Sparkles className="w-3 h-3" />} color="text-purple-400" border="border-purple-500/30" />
                </div>
             </div>

             {/* Dynamic Status Effects (Right Side) */}
             <div className="hidden md:block w-48 space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Active Protocols</div>
                {/* Theme Effect */}
                <div className={`p-2 rounded border ${theme.border} bg-${theme.text}/5 flex items-center gap-3`}>
                   <div className={`w-1.5 h-1.5 rounded-full bg-${theme.text.split('-')[1]}-500 animate-pulse`} /> 
                   <div className="text-xs">
                      <div className={`font-bold ${theme.text}`}>Aura: {theme?.bg.split('-')[1]}</div>
                      <div className="text-[10px] text-slate-400 opacity-70">+5% XP Gain</div>
                   </div>
                </div>
                {/* Focus Effect (Mock) */}
                <div className="p-2 rounded border border-blue-500/30 bg-blue-500/5 flex items-center gap-3 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <div className="text-xs">
                       <div className="font-bold text-blue-400">Focus Mode</div>
                       <div className="text-[10px] text-slate-400 opacity-70">Inactive</div>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function StatusHex({ label, value, icon, color, border }) {
   return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${border} bg-slate-900/50 backdrop-blur w-fit`}>
         <div className={`${color}`}>{icon}</div>
         <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{label}</span>
            <span className={`text-sm font-bold text-white font-mono`}>{value}</span>
         </div>
      </div>
   )
}
