'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';
import SkillRadar from '@/components/analytics/SkillRadar';
import ProgressConstellation from '@/components/analytics/ProgressConstellation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Link from 'next/link';
import { PlayCircle, Award, Zap, BookOpen, Lock, Layout, Star } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'User', xp: 0, level: 1 });
  const [stats, setStats] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');

  const filteredCourses = courses.filter(c => {
    if (difficultyFilter === 'ALL') return true;
    return c.difficulty === difficultyFilter;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    async function load() {
      try {
        const [coursesData, userData, statsData] = await Promise.all([
          api.getCourses(),
          api.getMe(),
          api.getStats()
        ]);
        setCourses(coursesData);
        setUser(userData);
        setStats(statsData);
      } catch (e) {
        console.error(e);
        if (e.message.includes('401') || e.message.includes('403')) {
           router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white selection:bg-brick selection:text-white">
      <Navbar />
      
      <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        
        {/* User Stats Hero */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-fade-in">
          <div className="md:col-span-3 p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brick/10 rounded-full blur-3xl transform translate-x-12 -translate-y-12" />
            
            <div className="relative z-10">
              <h1 className="text-3xl font-semibold mb-2 text-white">Welcome back, Architect!</h1>
              <p className="text-slate-400 mb-6 font-light">You're on a 3-day streak. Keep pushing to unlock the 'Lakehouse Legend' badge.</p>
              
              <div className="flex items-center space-x-8">
                <div>
                   <div className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Current Level</div>
                   <div className="text-4xl font-light text-white flex items-center tracking-tight">
                      {user.level} <span className="text-sm font-medium text-brick ml-2 tracking-normal">Novice</span>
                   </div>
                </div>
                <div>
                   <div className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Total XP</div>
                   <div className="text-4xl font-light text-white flex items-center tracking-tight">
                      <Zap className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" />
                      {user.xp}
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900/50 border border-slate-700/50 flex flex-col items-center justify-center relative backdrop-blur-sm">
             <div className="text-center p-6">
                <div className="w-14 h-14 mx-auto bg-brick/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-brick/20">
                  <Award className="w-7 h-7 text-brick" />
                </div>
                <div className="font-semibold text-base mb-1 text-slate-200">Daily Quest</div>
                <div className="text-sm text-slate-500 mb-4 font-light">Complete 2 Modules</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-brick h-full w-[0%]" /> 
                </div>
             </div>
          </div>
        </div>

        {/* Analytics Section */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="lg:col-span-1">
              <ActivityHeatmap data={stats.heatmap} />
            </div>
            <div className="lg:col-span-1">
               <ProgressConstellation />
            </div>
            <div className="lg:col-span-1 h-full">
              <SkillRadar data={stats.radar} />
            </div>
          </div>
        )}

        {/* Courses Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
           <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-brick" />
              <h2 className="text-xl font-semibold tracking-tight text-slate-200">Available Courses</h2>
           </div>
           
           <div className="flex items-center space-x-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
              {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    difficultyFilter === level 
                      ? 'bg-brick text-white shadow-lg shadow-brick/20' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {level}
                </button>
              ))}
           </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brick"></div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {filteredCourses.map((course, idx) => (
              <div key={course.id} className="glass-panel rounded-2xl p-8 border border-white/5 hover:border-slate-600/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                       <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">
                          Career Path
                       </span>
                       {course.difficulty && (
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-widest ${
                            course.difficulty === 'BEGINNER' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            course.difficulty === 'INTERMEDIATE' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {course.difficulty}
                          </span>
                       )}
                       {idx === 0 && <span className="flex items-center text-[10px] uppercase tracking-widest font-bold text-yellow-500"><Star className="w-3 h-3 mr-1" fill="currentColor"/> Popular</span>}
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">{course.title}</h2>
                    <p className="text-slate-400 max-w-2xl text-base font-light leading-relaxed">{course.description}</p>
                  </div>
                  
                  <div className="text-right hidden md:block">
                     <div className="text-[10px] text-slate-600 font-mono mb-1 uppercase tracking-widest">Progress</div>
                     <div className="text-xl font-light text-slate-300">0%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.modules?.map((module, mIdx) => {
                    const firstLessonId = module.lessons?.[0]?.id;
                    const isLocked = false; 

                    return (
                      <div 
                        key={module.id}
                        className={`group relative p-5 bg-slate-900/30 rounded-xl border border-white/5 hover:bg-slate-800/50 hover:border-white/10 transition-all duration-200`}
                      >
                         <Link href={firstLessonId ? `/learn/${firstLessonId}` : '#'} className={`block ${!firstLessonId ? 'pointer-events-none opacity-50' : ''}`}>
                             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                                <PlayCircle className="w-5 h-5 text-brick" />
                             </div>
                             
                             <div className="mb-2">
                               <div className="text-[10px] font-mono text-slate-600 mb-1.5 uppercase tracking-widest">Module {mIdx + 1}</div>
                               <h3 className="font-medium text-slate-200 leading-snug group-hover:text-white transition-colors pr-6">
                                  {module.title}
                               </h3>
                             </div>
                             
                             {module.description && (
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light mb-3">
                                   {module.description}
                                </p>
                             )}
                         </Link>

                         {module.quizzes && module.quizzes.length > 0 && (
                             <div className="mt-3 pt-3 border-t border-white/5">
                                {module.quizzes.map(q => (
                                    <Link key={q.id} href={`/quiz/${q.id}`} className="flex items-center text-xs text-brick hover:text-white transition-colors font-medium">
                                        <Award className="w-3 h-3 mr-1.5" /> Quiz: {q.title}
                                    </Link>
                                ))}
                             </div>
                         )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
