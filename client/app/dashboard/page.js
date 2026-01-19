'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Link from 'next/link';
import { PlayCircle, CheckCircle, Lock } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function load() {
      try {
        const data = await api.getCourses();
        setCourses(data);
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
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Learning Path</h1>
        
        {loading ? (
          <div className="text-center text-slate-500">Loading courses...</div>
        ) : (
          <div className="grid gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
                    <p className="text-slate-400">{course.description}</p>
                  </div>
                  <div className="text-xs font-mono bg-blue-900/30 text-blue-300 px-2 py-1 rounded">START</div>
                </div>

                <div className="space-y-3">
                  {course.modules?.map(module => (
                    <div key={module.id} className="border-t border-slate-800 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">{module.title}</h3>
                      <div className="space-y-2">
                        {/* Assuming we can fetch lessons separately or they are included. 
                            If not included in list, we might need a separate call. 
                            Assuming simplified structure for now. */}
                         <Link 
                            href={`/learn/${module.id}`} // TBD: Link usually goes to a lesson, picking first available or listing them
                            className="flex items-center p-3 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800/50 transition-colors group"
                          >
                            <PlayCircle className="w-5 h-5 text-blue-500 mr-3 group-hover:text-blue-400" />
                            <span className="text-slate-200">Start Module</span>
                          </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
