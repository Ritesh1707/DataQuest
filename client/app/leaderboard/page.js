'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { Trophy, Medal, Crown, Zap, Shield, Star } from 'lucide-react';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getLeaderboard();
        setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-bounce" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-300 fill-slate-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-orange-400 fill-orange-400" />;
    return <span className="font-mono text-slate-500 text-lg font-bold">#{index + 1}</span>;
  };

  const getRankStyle = (index) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-500";
    if (index === 1) return "bg-gradient-to-r from-slate-300/10 to-transparent border-l-4 border-slate-300";
    if (index === 2) return "bg-gradient-to-r from-orange-400/10 to-transparent border-l-4 border-orange-400";
    return "hover:bg-white/5 border-b border-white/5";
  };

  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      <Navbar />
      
      <div className="pt-28 pb-12 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-bold mb-4 flex justify-center items-center">
             <Trophy className="w-10 h-10 text-brick mr-4" />
             Global Leaderboard
           </h1>
           <p className="text-slate-400">Top Architects competing for glory.</p>
        </div>

        {loading ? (
           <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brick"></div>
           </div>
        ) : (
           <div className="glass-panel rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-6 bg-slate-900/50 border-b border-slate-700 text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
                 <div className="col-span-2 text-center">Rank</div>
                 <div className="col-span-6">User</div>
                 <div className="col-span-2 text-center">Level</div>
                 <div className="col-span-2 text-right">Total XP</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-800">
                 {users.map((user, idx) => (
                    <div 
                      key={user.id} 
                      className={`grid grid-cols-12 gap-4 p-6 items-center transition-all ${getRankStyle(idx)}`}
                    >
                       <div className="col-span-2 flex justify-center">
                          {getRankIcon(idx)}
                       </div>
                       
                       <div className="col-span-6 flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                              ${idx === 0 ? 'bg-yellow-500 text-black' : 
                                idx === 1 ? 'bg-slate-300 text-black' : 
                                idx === 2 ? 'bg-orange-400 text-black' : 'bg-slate-800 text-slate-400'}
                          `}>
                             {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <div className="font-bold text-white flex items-center">
                               {user.name}
                               {idx < 3 && <Star className="w-3 h-3 ml-2 text-yellow-500 fill-yellow-500" />}
                             </div>
                             <div className="text-xs text-slate-500 font-mono">
                                Arch{idx === 0 ? 'Legend' : idx < 5 ? 'Master' : 'Associate'}
                             </div>
                          </div>
                       </div>

                       <div className="col-span-2 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300">
                             Lvl {user.level || 1}
                          </div>
                       </div>

                       <div className="col-span-2 text-right font-bold font-mono text-brick flex items-center justify-end">
                          <Zap className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" />
                          {user.xp.toLocaleString()}
                       </div>
                    </div>
                 ))}
                 
                 {users.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                       No data available. Start solving to appear here!
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
