'use client';
import { motion } from 'framer-motion';
import { Code, Database, Zap, Brain, Layers, Server } from 'lucide-react';

const techIcons = {
  Python: <Code className="w-6 h-6" />,
  SQL: <Database className="w-6 h-6" />,
  PySpark: <Zap className="w-6 h-6" />,
  Spark: <Zap className="w-6 h-6" />,
  'Machine Learning': <Brain className="w-6 h-6" />,
  'Data Engineering': <Layers className="w-6 h-6" />,
  Architecture: <Server className="w-6 h-6" />
};

const techColors = {
  Python: { ring: 'stroke-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
  SQL: { ring: 'stroke-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
  PySpark: { ring: 'stroke-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-500' },
  Spark: { ring: 'stroke-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-500' },
  'Machine Learning': { ring: 'stroke-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-500' },
  'Data Engineering': { ring: 'stroke-green-500', bg: 'bg-green-500/10', text: 'text-green-500' },
  Architecture: { ring: 'stroke-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-500' }
};

export default function TechnologyProgress({ technologies = [] }) {
  // Filter to show only top technologies or those with progress
  const displayTechs = technologies
    .filter(t => t.score > 0)
    .slice(0, 6);

  if (displayTechs.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4">Technology Mastery</h3>
        <p className="text-sm text-slate-400">Complete lessons to track your technology progress</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5">
      <h3 className="text-lg font-bold text-white mb-6">Technology Mastery</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {displayTechs.map((tech, idx) => {
          const percentage = Math.min((tech.score / 100) * 100, 100);
          const colors = techColors[tech.name] || techColors.Python;
          const Icon = techIcons[tech.name] || <Code className="w-6 h-6" />;
          
          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              {/* Circular Progress */}
              <div className="relative w-24 h-24 mb-3">
                <svg className="transform -rotate-90 w-24 h-24">
                  {/* Background circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-slate-800"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    className={colors.ring}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      strokeDasharray: 251.2
                    }}
                  />
                </svg>
                
                {/* Center Icon */}
                <div className={`absolute inset-0 flex items-center justify-center ${colors.text}`}>
                  {Icon}
                </div>
              </div>

              {/* Tech Name */}
              <h4 className="text-sm font-semibold text-white text-center mb-1">
                {tech.name}
              </h4>
              
              {/* Score */}
              <div className="text-xs text-slate-400">
                {tech.score} XP
              </div>
              
              {/* Progress Percentage */}
              <div className={`text-xs font-mono mt-1 ${colors.text}`}>
                {Math.round(percentage)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
