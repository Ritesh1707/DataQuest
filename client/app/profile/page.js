"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';
import SkillRadar from '@/components/analytics/SkillRadar';
import ProgressConstellation from '@/components/analytics/ProgressConstellation';
import XPProgressRing from '@/components/analytics/XPProgressRing';
import RecentActivity from '@/components/analytics/RecentActivity';
import TechStack from '@/components/analytics/TechStack';
import { api } from '@/lib/api';
import { User, Shield, Zap, Award, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const themes = {
    slate: { border: 'border-slate-500', text: 'text-slate-400', bg: 'from-slate-900/50 to-slate-800/50', glow: 'shadow-slate-500/20' },
    green: { border: 'border-emerald-500', text: 'text-emerald-400', bg: 'from-emerald-900/50 to-emerald-800/50', glow: 'shadow-emerald-500/20' },
    purple: { border: 'border-violet-500', text: 'text-violet-400', bg: 'from-violet-900/50 to-violet-800/50', glow: 'shadow-violet-500/20' },
    orange: { border: 'border-amber-500', text: 'text-amber-400', bg: 'from-amber-900/50 to-amber-800/50', glow: 'shadow-amber-500/20' },
    red: { border: 'border-rose-500', text: 'text-rose-400', bg: 'from-rose-900/50 to-rose-800/50', glow: 'shadow-rose-500/20' },
    blue: { border: 'border-sky-500', text: 'text-sky-400', bg: 'from-sky-900/50 to-sky-800/50', glow: 'shadow-sky-500/20' },
  };

  useEffect(() => {
    async function load() {
       try {
          const [u, s, c] = await Promise.all([api.getMe(), api.getStats(), api.getCourses()]);
          setUser(u);
          setStats(s);
          setCourses(c);
       } catch (e) {
          console.error('Profile Load Error', e);
          if (e.message && (e.message.includes('401') || e.message.includes('403'))) {
             router.push('/login');
          }
       } finally {
          setLoading(false);
       }
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-[var(--deep-space)] flex items-center justify-center text-white">Initializing Profile...</div>;

  const themeKey = stats?.identity?.themeColor || 'slate';
  const theme = themes[themeKey] || themes.slate;

  // Determine Avatar Type based on Level
  const getAvatarType = (level) => {
     if (level < 5) return 'Drone';
     if (level < 10) return 'Rover';
     if (level < 20) return 'Mecha';
     return 'Starship';
  };

  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white selection:bg-brick selection:text-white pb-20">
      <Navbar />

      <div className="pt-28 px-6 max-w-7xl mx-auto">
         
         {/* Dynamic Profile Header */}
         <div className={`relative p-8 rounded-3xl border ${theme.border} bg-gradient-to-r ${theme.bg} overflow-hidden mb-12 animate-fade-in`}>
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 bg-white mix-blend-overlay`} />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
               {/* Evolving Avatar */}
               <div className={`w-32 h-32 rounded-full border-4 ${theme.border} flex items-center justify-center bg-black/40 shadow-2xl ${theme.glow}`}>
                  <User className={`w-16 h-16 ${theme.text}`} />
               </div>

               <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                     <h1 className="text-4xl font-bold tracking-tight text-white">{user?.name}</h1>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${theme.border} ${theme.text} bg-black/20`}>
                        {stats?.identity?.topSkill || 'Novice'}
                     </span>
                  </div>
                  
                  <p className="text-slate-300 mb-6 font-light text-lg">
                     Level {user?.level} {getAvatarType(user?.level)} Pilot • {user?.xp} XP
                  </p>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                     <div className="p-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Total XP</div>
                        <div className="text-xl font-bold text-white flex items-center gap-2">
                           <Zap className="w-4 h-4 text-yellow-500" /> {user?.xp}
                        </div>
                     </div>
                     <div className="p-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Badges</div>
                        <div className="text-xl font-bold text-white flex items-center gap-2">
                           <Award className="w-4 h-4 text-purple-500" /> {stats?.achievements?.filter(a => a.unlocked)?.length || 0}
                        </div>
                     </div>
                     <div className="p-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Streak</div>
                        <div className="text-xl font-bold text-white flex items-center gap-2">
                           <Zap className="w-4 h-4 text-orange-500" /> 3 Days
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Analytics Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Heatmap takes 2 cols */}
            <div className="lg:col-span-2 space-y-6">
               <ActivityHeatmap data={stats?.heatmap} />
               <TechStack 
                  languages={stats?.techStack?.languages} 
                  technologies={stats?.techStack?.technologies} 
               />
               <ProgressConstellation courses={courses} />
            </div>

            {/* Radar & Skills */}
            <div className="lg:col-span-1 space-y-6">
               <div className="flex gap-4">
                  <div className="flex-1 p-4 glass-panel rounded-2xl flex items-center justify-center">
                      <XPProgressRing level={user?.level} xp={user?.xp} theme={themeKey} />
                  </div>
                  <div className="flex-1 p-4 glass-panel rounded-2xl flex flex-col justify-center">
                     <div className="text-xs text-slate-500 uppercase">Next Level</div>
                     <div className="text-xl font-bold text-white">1000 XP</div>
                  </div>
               </div>

               <SkillRadar data={stats?.radar} />
               
               <div className="p-6 glass-panel rounded-2xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <Trophy className="w-5 h-5 text-yellow-500" /> Mastery Levels
                  </h3>
                  <div className="space-y-4">
                     {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => {
                         const count = courses.filter(c => c.difficulty === level).length;
                         const color = level === 'BEGINNER' ? 'bg-green-500' : level === 'INTERMEDIATE' ? 'bg-yellow-500' : 'bg-red-500';
                         // Mock progress for now to show visual differentiation
                         const percentage = level === 'BEGINNER' ? 75 : level === 'INTERMEDIATE' ? 30 : 5;
                         
                         return (
                            <div key={level}>
                               <div className="flex justify-between text-xs uppercase tracking-widest text-slate-400 mb-1">
                                  <span>{level}</span>
                                  <span>{count} Courses</span>
                               </div>
                               <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                  <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
                               </div>
                            </div>
                         )
                     })}
                  </div>
               </div>
               
               <RecentActivity activities={[
                   { type: 'quiz', title: 'Lakehouse Architecture Quiz', date: '2 hours ago' },
                   { type: 'lesson', title: 'Medallion Design Pattern', date: 'Yesterday' },
                   { type: 'badge', title: 'First Steps', date: '3 days ago' }
               ]} />

               <div className="p-6 glass-panel rounded-2xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <Shield className="w-5 h-5 text-brick" /> Status Effects
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-white/5">
                        <div className={`w-2 h-2 rounded-full ${theme.bg.split(' ')[0].replace('/50', '')}`} />
                        <div>
                           <div className="text-sm font-bold text-slate-200">Aura: {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}</div>
                           <div className="text-xs text-slate-500">Active Theme Bonus</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
