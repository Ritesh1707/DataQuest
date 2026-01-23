'use client';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export default function PeerComparison({ 
  userStats = { speed: 80, accuracy: 65, consistency: 90, breadth: 40 },
  globalAvg = { speed: 60, accuracy: 70, consistency: 50, breadth: 55 }
}) {
  const data = [
    { subject: 'Speed', A: userStats.speed, B: globalAvg.speed, fullMark: 100 },
    { subject: 'Accuracy', A: userStats.accuracy, B: globalAvg.accuracy, fullMark: 100 },
    { subject: 'Consistency', A: userStats.consistency, B: globalAvg.consistency, fullMark: 100 },
    { subject: 'Breadth', A: userStats.breadth, B: globalAvg.breadth, fullMark: 100 },
    { subject: 'Complexity', A: 75, B: 60, fullMark: 100 },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full min-h-[300px] flex flex-col">
       <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-white">Pilot vs Fleet</h3>
           <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-cyan-500" />
                 <span className="text-slate-400">You</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-slate-500" />
                 <span className="text-slate-400">Global Avg</span>
              </div>
           </div>
       </div>

       <div className="flex-1 w-full h-full min-h-[250px] -ml-4">
         <ResponsiveContainer width="100%" height="100%">
           <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
             <PolarGrid stroke="rgba(255,255,255,0.1)" />
             <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
             <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
             
             {/* Global Average */}
             <Radar
               name="Global Avg"
               dataKey="B"
               stroke="#64748b"
               strokeWidth={2}
               fill="#64748b"
               fillOpacity={0.1}
             />
             
             {/* User Stats - overlay with glow */}
             <Radar
               name="You"
               dataKey="A"
               stroke="#06b6d4"
               strokeWidth={3}
               fill="#06b6d4"
               fillOpacity={0.3}
             />
             <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
             />
           </RadarChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
}
