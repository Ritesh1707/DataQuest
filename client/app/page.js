'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { ArrowRight, Code, Database, Brain, Sparkles, Layers, Trophy } from 'lucide-react';

export default function Home() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const users = await api.getLeaderboard();
        // Take top 3
        const mapped = users.slice(0, 3).map((u, i) => ({
          name: u.name,
          xp: u.xp, // Keep raw for now, format in render
          role: i === 0 ? 'ArchLegend' : 'ArchMaster',
          color: i === 0 ? 'text-yellow-400' : (i === 1 ? 'text-slate-300' : 'text-orange-400')
        }));
        setTopUsers(mapped);
      } catch (e) {
        // console.warn('Leaderboard API unavailable, using demo data');
        // Fallback for demo if API fails
        setTopUsers([
           { name: 'Alex Rivera', xp: 12450, role: 'ArchLegend', color: 'text-yellow-400' },
           { name: 'Sarah Chen', xp: 11200, role: 'ArchMaster', color: 'text-slate-300' },
           { name: 'Mike Ross', xp: 10800, role: 'ArchMaster', color: 'text-orange-400' },
        ]);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white overflow-hidden selection:bg-brick selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF3621] rounded-full blur-[150px] opacity-10 animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[150px] opacity-10 animate-pulse delay-1000" />
         <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-purple-500 rounded-full blur-[120px] opacity-10 transform -translate-x-1/2" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-32">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in backdrop-blur-sm hover:border-white/20 transition-colors cursor-default">
             <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
             <span className="text-sm text-slate-300 font-medium">The New Standard in Data & AI Learning</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
            Master the <br/>
            <span className="text-gradient-brick">Lakehouse Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up font-light" style={{ animationDelay: '0.2s' }}>
            Gamified, interactive code labs designed for Solution Architects, Data Engineers, and ML Professionals. 
            <span className="md:block mt-2">Level up your career with hands-on practice.</span>
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              href="/dashboard"
              className="px-10 py-5 bg-[#FF3621] hover:bg-[#ff5542] text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,54,33,0.4)] hover:shadow-[0_0_50px_rgba(255,54,33,0.6)] transition-all transform hover:scale-105 flex items-center"
            >
              Start Learning Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/login"
              className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-full font-bold text-lg transition-all backdrop-blur-sm"
            >
              Explore Curriculum
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-slate-500 font-mono animate-slide-up" style={{ animationDelay: '0.5s' }}>
             TRUSTED BY ENGINEERS FROM TOP TECH COMPANIES
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto mb-40">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Choose Your Path</h2>
              <p className="text-slate-400">Tailored curriculums for every role in the data ecosystem.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                 icon={<Layers className="w-8 h-8 text-blue-400" />}
                 title="Solution Architect"
                 desc="Design scalable Medallion Architectures and secure Unity Catalog governance models."
                 delay={0.4}
              />
              <FeatureCard 
                 icon={<Database className="w-8 h-8 text-[#FF3621]" />}
                 title="Data Engineer"
                 desc="Master ELT pipelines, Delta Live Tables, and performance tuning with Z-Ordering."
                 delay={0.5}
              />
              <FeatureCard 
                 icon={<Brain className="w-8 h-8 text-purple-400" />}
                 title="ML Professional"
                 desc="Build end-to-end MLOps lifecycles with Feature Store, AutoML, and Model Serving."
                 delay={0.6}
              />
           </div>
        </div>

        {/* Value Prop Section 1: Interactive Labs */}
        <div className="max-w-7xl mx-auto mb-40 grid md:grid-cols-2 gap-16 items-center">
           <div className="order-2 md:order-1 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="glass-panel rounded-2xl p-2 shadow-2xl overflow-hidden border border-slate-700 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                 <div className="bg-[#1e1e1e] rounded-xl overflow-hidden">
                    <div className="flex items-center px-4 py-3 bg-[#252526] border-b border-[#333]">
                       <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"/>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                          <div className="w-3 h-3 rounded-full bg-green-500"/>
                       </div>
                       <div className="ml-4 text-xs text-slate-400 font-mono">spark_optimization.py</div>
                    </div>
                    <div className="p-6 font-mono text-sm text-slate-300">
                       <div className="flex"><span className="text-slate-500 w-8 select-none">1</span><span className="text-purple-400">from</span> spark <span className="text-purple-400">import</span> functions <span className="text-purple-400">as</span> F</div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">2</span></div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">3</span><span className="text-green-600"># Optimize Data Layout</span></div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">4</span>df.write \</div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">5</span>&nbsp;&nbsp;.format(<span className="text-orange-300">"delta"</span>) \</div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">6</span>&nbsp;&nbsp;.option(<span className="text-orange-300">"path"</span>, <span className="text-orange-300">"/mnt/delta/gold/sales"</span>) \</div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">7</span>&nbsp;&nbsp;.save()</div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">8</span></div>
                       <div className="flex"><span className="text-slate-500 w-8 select-none">9</span><span className="text-blue-400">spark</span>.sql(<span className="text-orange-300">"OPTIMIZE sales ZORDER BY (customer_id)"</span>)</div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="order-1 md:order-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                 <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Interactive <br/>Coding Labs</h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                 Stop watching videos. Start writing code. Our in-browser IDE comes pre-configured with Spark and Delta Lake support, giving you instant feedback on your architecture designs.
              </p>
              <ul className="space-y-4">
                 {[
                    'Real-time syntax validation',
                    'Zero-setup environment',
                    'Instant execution & feedback'
                 ].map((item, i) => (
                    <li key={i} className="flex items-center text-slate-300">
                       <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                       </div>
                       {item}
                    </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Value Prop Section 2: Gamification */}
        <div className="max-w-7xl mx-auto mb-40 grid md:grid-cols-2 gap-16 items-center">
           <div>
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20">
                 <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Climb the <br/>Global Ranks</h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                 Prove your skills. Earn XP for every optimized query and secure architecture you design. Compete with architects worldwide for the top spot.
              </p>
              <div className="flex space-x-4">
                 <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex-1">
                    <div className="text-3xl font-bold text-white mb-1">10k+</div>
                    <div className="text-sm text-slate-500">Active Learners</div>
                 </div>
                 <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex-1">
                    <div className="text-3xl font-bold text-brick mb-1">50+</div>
                    <div className="text-sm text-slate-500">Challenges</div>
                 </div>
              </div>
           </div>

           <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full" />
              <div className="relative glass-card p-8 rounded-3xl border border-yellow-500/20">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-xl">Top Architects</h3>
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Live Updates"/>
                    </div>
                    <div className="text-xs font-mono text-yellow-500">LIVE RANKING</div>
                 </div>
                 
                 <div className="space-y-4">
                     {topUsers.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 animate-pulse">Loading rankings...</div>
                     ) : (
                        topUsers.map((user, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                              <div className="flex items-center space-x-4">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold bg-slate-800 ${user.color}`}>
                                    #{i+1}
                                 </div>
                                 <div>
                                    <div className="font-bold text-sm">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.role}</div>
                                 </div>
                              </div>
                              <div className="font-mono font-bold text-slate-300">{typeof user.xp === 'number' ? user.xp.toLocaleString() : user.xp}</div>
                           </div>
                        ))
                     )}
                 </div>
              </div>
           </div>
        </div>

        {/* CTA Footer */}
        <div className="max-w-4xl mx-auto text-center relative mb-32">
           <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full" />
           <div className="relative glass-panel p-12 rounded-3xl border border-white/10">
              <h2 className="text-4xl font-bold mb-6">Ready to become a Lakehouse Legend?</h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                 Join thousands of developers mastering the modern data stack today. No credit card required.
              </p>
              <Link 
                 href="/login"
                 className="inline-flex px-10 py-5 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-lg transition-all transform hover:scale-105"
              >
                 Get Started for Free
              </Link>
           </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div 
      className="glass-card p-8 rounded-2xl animate-slide-up hover:bg-slate-800/50 transition-colors" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="p-3 bg-white/5 w-fit rounded-xl mb-6 border border-white/10">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light">
        {desc}
      </p>
    </div>
  );
}
