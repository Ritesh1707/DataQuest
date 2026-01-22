"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const SkillRadar = ({ data = [] }) => {
  // data: [{ subject: 'Python', A: 120, fullMark: 150 }]
  
  if (!data || data.length === 0) return null;

  return (
    <div className="p-6 glass-panel rounded-2xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-brick-red">◈</span>
        Pilot Stats
      </h3>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
            />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#FF3621"
              strokeWidth={2}
              fill="#FF3621"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillRadar;
