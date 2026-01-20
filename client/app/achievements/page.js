'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { Award, Lock, Loader } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white selection:bg-orange-500/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Achievements
            </h1>
            <p className="text-slate-400 max-w-xl">
              Track your journey through the cosmos. Unlock badges by completing courses, maintaining streaks, and mastering the platform.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="font-mono text-sm">
              <span className="text-white font-bold">{achievements.filter(a => a.unlocked).length}</span>
              <span className="text-slate-500"> / {achievements.length} Unlocked</span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-orange-500/30 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20' 
                    : 'bg-white/5 border-white/5 opacity-60 hover:opacity-80'
                }`}
              >
                {/* Glow effect for unlocked */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 rounded-2xl bg-orange-500/10 blur-xl -z-10 group-hover:bg-orange-500/20 transition-all" />
                )}

                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    achievement.unlocked ? 'bg-orange-500/20' : 'bg-white/5'
                  }`}>
                    <img 
                      src={achievement.imageUrl} 
                      alt={achievement.name}
                      className={`w-8 h-8 ${!achievement.unlocked && 'grayscale opacity-50'}`}
                    />
                  </div>
                  {achievement.unlocked ? (
                    <div className="px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30 text-[10px] font-mono text-green-400 uppercase tracking-wider">
                      Unlocked
                    </div>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                  {achievement.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {achievement.description}
                </p>

                {achievement.unlockedAt && (
                  <div className="text-xs text-slate-500 font-mono pt-4 border-t border-white/5">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
                
                {!achievement.unlocked && (
                  <div className="text-xs text-slate-500 font-mono pt-4 border-t border-white/5">
                    Locked
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
