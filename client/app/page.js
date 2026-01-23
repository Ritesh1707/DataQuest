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
      {/* Dynamic Background with Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF3621] rounded-full blur-[150px] opacity-10 animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[150px] opacity-10 animate-pulse delay-1000" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Pilot Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-32 relative">
           
           <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in backdrop-blur-sm hover:border-white/20 transition-colors cursor-default">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
             <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold">System Online</span>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
             DATAQUEST <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3621] to-orange-500">MASTERCLASS</span>
           </h1>
           
           <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up font-light" style={{ animationDelay: '0.2s' }}>
             Interactive simulation labs for Data Architects. <br/>
             <span className="text-slate-500">Deploy medallion architectures, optimize Spark clusters, and secure governance models in a gamified environment.</span>
           </p>
           
           <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
             <Link 
               href="/dashboard"
               className="group relative px-8 py-4 bg-[#FF3621] text-white rounded-lg font-bold text-lg overflow-hidden transition-all hover:scale-105"
             >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <span className="relative flex items-center">
                 INITIATE SEQUENCE <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </span>
             </Link>
             <Link 
               href="/login"
               className="px-8 py-4 bg-transparent text-slate-300 border border-white/10 hover:border-white/30 rounded-lg font-bold text-lg transition-all hover:bg-white/5 flex items-center"
             >
               <Code className="w-5 h-5 mr-2 text-slate-500" />
               VIEW CURRICULUM
             </Link>
           </div>
           
           <div className="mt-16 grid grid-cols-3 md:grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-white/5 pt-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-center">
                 <div className="text-2xl font-black text-white">10k+</div>
                 <div className="text-[10px] uppercase tracking-widest text-slate-500">Pilots Active</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-black text-white">50+</div>
                 <div className="text-[10px] uppercase tracking-widest text-slate-500">Simulations</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-black text-white">99%</div>
                 <div className="text-[10px] uppercase tracking-widest text-slate-500">Job Ready</div>
              </div>
           </div>
        </div>

        {/* Feature Grid - Glass Panels */}
        <div className="max-w-7xl mx-auto mb-40">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-6">
              <div>
                 <h2 className="text-3xl font-bold mb-2">Detailed Career Paths</h2>
                 <p className="text-slate-400">Select your specialization module.</p>
              </div>
              <div className="text-right hidden md:block">
                 <div className="text-xs font-mono text-slate-500">MODULE_SELECT // V.2.0</div>
              </div>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                 icon={<Layers className="w-8 h-8 text-blue-400" />}
                 title="Solution Architect"
                 desc="Design scalable Medallion Architectures and secure Unity Catalog governance models."
                 delay={0.4}
                 color="border-blue-500/30"
              />
              <FeatureCard 
                 icon={<Database className="w-8 h-8 text-[#FF3621]" />}
                 title="Data Engineer"
                 desc="Master ELT pipelines, Delta Live Tables, and performance tuning with Z-Ordering."
                 delay={0.5}
                 color="border-orange-500/30"
              />
              <FeatureCard 
                 icon={<Brain className="w-8 h-8 text-purple-400" />}
                 title="ML Professional"
                 desc="Build end-to-end MLOps lifecycles with Feature Store, AutoML, and Model Serving."
                 delay={0.6}
                 color="border-purple-500/30"
              />
           </div>
        </div>

        {/* Value Prop Section 1: Interactive Labs */}
        <div className="max-w-7xl mx-auto mb-40 grid md:grid-cols-2 gap-16 items-center">
           <div className="order-2 md:order-1 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="glass-panel rounded-xl p-1 shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/50 relative group">
                 <div className="absolute top-0 left-0 right-0 h-8 bg-slate-950 flex items-center px-3 border-b border-white/5">
                    <div className="flex space-x-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"/>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"/>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"/>
                    </div>
                    <div className="ml-4 text-[10px] text-slate-500 font-mono tracking-widest">spark_optimization.py — Edited</div>
                 </div>
                 <div className="p-6 pt-12 font-mono text-sm text-slate-300 relative bg-black/40 h-[300px]">
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">1</span><span className="text-purple-400">from</span> spark <span className="text-purple-400">import</span> functions <span className="text-purple-400">as</span> F</div>
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">2</span></div>
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">3</span><span className="text-slate-500"># Optimize Data Layout via Z-Order</span></div>
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">4</span>df.write \</div>
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">5</span>&nbsp;&nbsp;.format(<span className="text-orange-300">"delta"</span>) \</div>
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">6</span>&nbsp;&nbsp;.option(<span className="text-orange-300">"path"</span>, <span className="text-orange-300">"/mnt/gold/sales"</span>) \</div>
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">7</span>&nbsp;&nbsp;.save()</div>
                    <div className="flex"><span className="text-slate-600 w-8 select-none text-right mr-4">8</span></div>
                    <div className="flex items-center"><span className="text-slate-600 w-8 select-none text-right mr-4">9</span>
                        <div className="bg-blue-500/20 text-blue-300 px-1 rounded border border-blue-500/30">
                           spark.sql(<span className="text-orange-300">"OPTIMIZE sales ZORDER BY (id)"</span>)
                        </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="order-1 md:order-2">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                 <Code className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Live Simulation <br/>Environment</h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                 Command line access to real Spark clusters. Execute optimizations and see immediate performance feedback. No video tutorials—only mission-critical practice.
              </p>
              <ul className="space-y-3">
                 {[
                    'Instant Syntax Analysis',
                    'Zero-Latency Environment',
                    'Real-time Performance Metrics'
                 ].map((item, i) => (
                    <li key={i} className="flex items-center text-slate-300 font-mono text-sm">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 animate-pulse" />
                       {item}
                    </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Value Prop Section 2: Gamification */}
        <div className="max-w-7xl mx-auto mb-40 grid md:grid-cols-2 gap-16 items-center">
           <div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20">
                 <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Global <br/>Leaderboards</h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                 Compete against fellow architects. Earn badges like "Data Lake Defender" and "Spark Specialist" as you solve architectural challenges.
              </p>
              <div className="flex space-x-4">
                 <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 flex-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl"/>
                    <div className="text-2xl font-black text-white mb-1">Top 1%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Elite Tier</div>
                 </div>
                 <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 flex-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brick/10 rounded-full -mr-8 -mt-8 blur-xl"/>
                    <div className="text-2xl font-black text-brick mb-1">Daily</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Challenges</div>
                 </div>
              </div>
           </div>

           <div className="relative">
              <div className="absolute inset-x-0 top-10 bg-yellow-500/10 blur-[80px] h-40 rounded-full" />
              <div className="relative glass-panel p-1 rounded-2xl border border-yellow-500/20 bg-black/40">
                 <div className="rounded-xl overflow-hidden bg-slate-950/80 p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                       <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg uppercase tracking-wider">Top Pilots</h3>
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                       </div>
                       <div className="text-[10px] font-mono text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded bg-yellow-500/5">LIVE FEED</div>
                    </div>
                    
                    <div className="space-y-3">
                        {topUsers.length === 0 ? (
                           <div className="p-8 text-center text-slate-500 animate-pulse font-mono text-xs">ESTABLISHING UPLINK...</div>
                        ) : (
                           topUsers.map((user, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                 <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs bg-black ${user.color}`}>
                                       {i+1}
                                    </div>
                                    <div>
                                       <div className="font-bold text-sm text-slate-200">{user.name}</div>
                                       <div className="text-[10px] text-slate-500 font-mono tracking-wider">{user.role}</div>
                                    </div>
                                 </div>
                                 <div className="font-mono font-bold text-xs text-slate-400">{typeof user.xp === 'number' ? user.xp.toLocaleString() : user.xp} XP</div>
                              </div>
                           ))
                        )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* CTA Footer - Mission Brief */}
        <div className="max-w-4xl mx-auto text-center relative mb-32">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-[100px] rounded-full opacity-50" />
           <div className="relative glass-panel p-10 md:p-16 rounded-3xl border border-white/10 overflow-hidden">
              <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent left-0" />
              
              <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">Mission Briefing</h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                 Your objective is clear. Master the Data Lakehouse architecture. Secure your future in the data galaxy.
              </p>
              <Link 
                 href="/login"
                 className="inline-flex px-10 py-5 bg-white text-black hover:bg-slate-200 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
              >
                 ACCEPT MISSION
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
