'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Link from 'next/link';
import { PlayCircle, Award, BookOpen, Layout, Star } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'User', xp: 0, level: 1 });
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [tagFilter, setTagFilter] = useState('ALL');

  // Extract unique tags and sort them
  const allTags = ['ALL', ...Array.from(new Set(courses.flatMap(c => c.tags || []))).sort()];

  const filteredCourses = courses.filter(c => {
    const matchDiff = difficultyFilter === 'ALL' || c.difficulty === difficultyFilter;
    const matchTag = tagFilter === 'ALL' || (c.tags && c.tags.includes(tagFilter));
    return matchDiff && matchTag;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    async function load() {
      try {
        const [coursesData, userData] = await Promise.all([
          api.getCourses(),
          api.getMe()
        ]);
        setCourses(coursesData);
        setUser(userData);
      } catch (e) {
        console.error('Dashboard Load Error:', e);
        if (e.message && (e.message.includes('401') || e.message.includes('403'))) {
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
        
        {/* ... Welcome Section unchanged ... */}

        {/* Courses Header & Filters */}
        <div className="flex flex-col gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-brick" />
                  <h2 className="text-xl font-semibold tracking-tight text-slate-200">Available Courses</h2>
               </div>
               
               <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
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

           {/* Tag Filters */}
           <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        tagFilter === tag 
                        ? 'bg-white/10 border-brick text-brick' 
                        : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                     {tag === 'ALL' ? 'All Technologies' : tag}
                  </button>
              ))}
           </div>
        </div>
        
        {loading ? (
          <div className="space-y-6">
             {[1, 2, 3].map(i => (
                 <div key={i} className="glass-panel rounded-2xl p-8 border border-white/5 animate-pulse">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                       <div className="space-y-3 w-full max-w-2xl">
                          <div className="flex gap-2">
                             <div className="h-4 w-20 bg-slate-800 rounded-full" />
                             <div className="h-4 w-16 bg-slate-800 rounded-full" />
                          </div>
                          <div className="h-8 w-3/4 bg-slate-700/50 rounded-lg" />
                          <div className="h-4 w-full bg-slate-800/50 rounded" />
                          <div className="h-4 w-2/3 bg-slate-800/50 rounded" />
                       </div>
                       <div className="hidden md:block space-y-2">
                          <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
                          <div className="h-6 w-16 bg-slate-700 rounded ml-auto" />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {[1, 2, 3].map(j => (
                          <div key={j} className="h-32 bg-slate-800/30 rounded-xl border border-white/5" />
                       ))}
                    </div>
                 </div>
             ))}
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
                    <p className="text-slate-400 max-w-2xl text-base font-light leading-relaxed mb-4">{course.description}</p>
                    
                    {/* Render Course Tags */}
                    <div className="flex flex-wrap gap-2">
                       {course.tags?.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-white/5">
                             {tag}
                          </span>
                       ))}
                    </div>
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
