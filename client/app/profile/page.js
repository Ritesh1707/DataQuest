'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import PilotStatsCard from '@/components/analytics/PilotStatsCard';
import MasteryAttributes from '@/components/analytics/MasteryAttributes';
import StreakGalaxy from '@/components/analytics/StreakGalaxy';
import PeerComparison from '@/components/analytics/PeerComparison';
import JourneyAtlas from '@/components/analytics/JourneyAtlas';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';
import SkillRadar from '@/components/analytics/SkillRadar';
import RecentActivity from '@/components/analytics/RecentActivity';
import AchievementShowcase from '@/components/analytics/AchievementShowcase';
import TechnologyProgress from '@/components/analytics/TechnologyProgress';
import XPProgressRing from '@/components/analytics/XPProgressRing';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Themes (kept for now if needed, though PilotStats handles most)
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

  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white selection:bg-brick selection:text-white pb-20">
      <Navbar />

      <div className="pt-28 px-6 max-w-7xl mx-auto">
         
         {/* Pilot Stats Hero Card */}
         <PilotStatsCard user={user} stats={stats} theme={theme} />

         {/* Analytics Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Heatmap takes 2 cols */}
            <div className="lg:col-span-2 space-y-6">
               <StreakGalaxy streak={3} activity={stats?.heatmap} />
               <JourneyAtlas currentLevel={user?.level} completedCourses={user?.completedCourses} />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TechnologyProgress technologies={stats?.techStack?.technologies} />
                  <PeerComparison />
               </div>

               <ActivityHeatmap data={stats?.heatmap} />
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
               
               <MasteryAttributes courses={courses} />
               
               <RecentActivity activities={[
                   { type: 'quiz', title: 'Lakehouse Architecture Quiz', date: '2 hours ago' },
                   { type: 'lesson', title: 'Medallion Design Pattern', date: 'Yesterday' },
                   { type: 'badge', title: 'First Steps', date: '3 days ago' }
               ]} />
            </div>
         </div>

         {/* Achievements Section - Full Width */}
         <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <AchievementShowcase achievements={stats?.achievements} />
         </div>

      </div>
    </div>
  );
}
