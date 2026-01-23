'use client';
import { motion } from 'framer-motion';
import { Map, Flag, Ship } from 'lucide-react';

export default function JourneyAtlas({ 
  currentLevel = 5,
  completedCourses = ['databricks-sa-masterclass'], 
  recommended = ['genai-engineer'] 
}) {
  
  const regions = [
    { id: 'foundation', name: 'Foundation Bay', level: '1-3', color: 'bg-emerald-500' },
    { id: 'spark', name: 'Spark Archipelago', level: '4-7', color: 'bg-orange-500' },
    { id: 'ml', name: 'Peak of ML', level: '8-15', color: 'bg-purple-500' },
    { id: 'ai', name: 'AI Stratosphere', level: '15+', color: 'bg-cyan-500' },
  ];

  // Determine current region based on user level
  const activeRegionIndex = currentLevel < 4 ? 0 : currentLevel < 8 ? 1 : currentLevel < 15 ? 2 : 3;

  return (
    <div className="relative w-full h-[400px] bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-700/50 group">
       {/* Ocean Background with Grid */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
       
       <h3 className="absolute top-6 left-6 text-xl font-bold text-white flex items-center gap-2 z-20">
          <Map className="w-5 h-5 text-brick" />
          Journey Atlas
       </h3>

       {/* Floating Islands (CSS Isometric-ish) */}
       <div className="absolute inset-0 flex items-center justify-center perspective-1000">
          <div className="relative w-full max-w-4xl h-full transform rotate-x-12 scale-90">
             
             {/* Connecting Path */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path 
                   d="M 150 300 Q 300 200 500 250 T 800 150" 
                   fill="none" 
                   stroke="#334155" 
                   strokeWidth="4" 
                   strokeDasharray="10 10"
                />
             </svg>

             {regions.map((region, i) => {
                const isActive = i === activeRegionIndex;
                const isPast = i < activeRegionIndex;
                
                // Position logic (hardcoded zigzag for visual intrigue)
                const positions = [
                   { left: '10%', top: '70%' },
                   { left: '35%', top: '50%' },
                   { left: '60%', top: '60%' },
                   { left: '85%', top: '30%' }
                ];
                
                return (
                   <motion.div
                      key={region.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform duration-300 z-10"
                      style={positions[i]}
                   >
                      {/* Island Graphic */}
                      <div className={`relative w-32 h-24 ${isPast ? 'opacity-50 grayscale' : ''}`}>
                         {/* Landmass */}
                         <div className={`absolute bottom-0 w-full h-4/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] ${region.color} shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-b-8 border-black/20`} />
                         
                         {/* Details/Trees (simplified as dots) */}
                         <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-white/30" />
                         <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-white/20" />
                         
                         {/* Flag if Active */}
                         {isActive && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                               <div className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded mb-1 whitespace-nowrap">
                                  You are here
                               </div>
                               <Flag className="w-6 h-6 text-white fill-brick" />
                               <div className="w-0.5 h-6 bg-white" />
                            </div>
                         )}
                      </div>
                      
                      {/* Label */}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center w-40">
                         <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {region.name}
                         </div>
                         <div className="text-[10px] text-slate-500 font-mono">
                            LVL {region.level}
                         </div>
                      </div>
                   </motion.div>
                );
             })}

             {/* Ship animation traveling */}
             <motion.div 
               animate={{ 
                 x: [150, 300, 500, 800], 
                 y: [300, 200, 250, 150] 
               }}
               transition={{ 
                 duration: 20, 
                 times: [0, 0.33, 0.66, 1],
                 repeat: Infinity,
                 ease: "linear" 
               }}
               className="absolute w-8 h-8 z-20 text-white/50"
             >
                <Ship className="w-full h-full transform -rotate-12" />
             </motion.div>

          </div>
       </div>
    </div>
  );
}
