'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { Trophy, Medal, User } from 'lucide-react';

export default function LeaderboardPage() {
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent inline-flex items-center gap-4">
                <Trophy className="w-10 h-10 text-yellow-500" />
                Champions Leaderboard
            </h1>
            <p className="text-slate-400 mt-2">See who's mastering Databricks the fastest</p>
        </div>
        
        {loading ? (
          <div className="text-center text-slate-500">Loading rankings...</div>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 font-semibold text-slate-400 text-sm uppercase tracking-wider">
               <div className="col-span-2 text-center">Rank</div>
               <div className="col-span-6">User</div>
               <div className="col-span-2 text-center">Level</div>
               <div className="col-span-2 text-right">XP</div>
            </div>
            
            <div className="divide-y divide-slate-800">
                {users.map((user, index) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/50 transition-colors">
                        <div className="col-span-2 flex justify-center">
                            {index === 0 && <Medal className="w-6 h-6 text-yellow-400" />}
                            {index === 1 && <Medal className="w-6 h-6 text-slate-400" />}
                            {index === 2 && <Medal className="w-6 h-6 text-amber-700" />}
                            {index > 2 && <span className="font-mono text-slate-500">#{index + 1}</span>}
                        </div>
                        <div className="col-span-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <span className="font-medium text-slate-200">{user.name || user.email}</span>
                        </div>
                        <div className="col-span-2 text-center text-slate-400 font-mono">
                            {user.level}
                        </div>
                        <div className="col-span-2 text-right font-bold text-blue-400 font-mono">
                            {user.xp.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
