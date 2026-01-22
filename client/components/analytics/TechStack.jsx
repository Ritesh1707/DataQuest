'use client';
import { motion } from 'framer-motion';
import { Code, Database, Server, Cpu, Cloud, Terminal, Zap, Brain, Layout, Cog } from 'lucide-react';

const icons = {
  Python: <img src="https://simpleicons.org/icons/python.svg" className="w-5 h-5 filter invert" alt="Python" />,
  SQL: <Database className="w-5 h-5 text-blue-400" />,
  Scala: <img src="https://simpleicons.org/icons/scala.svg" className="w-5 h-5 filter invert" alt="Scala" />,
  R: <span className="font-bold text-lg text-blue-500">R</span>,
  Java: <img src="https://simpleicons.org/icons/openjdk.svg" className="w-5 h-5 filter invert" alt="Java" />,
  'Delta Lake': <div className="w-5 h-5 bg-cyan-500 rounded-sm transform rotate-45" />,
  'Unity Catalog': <Server className="w-5 h-5 text-orange-400" />,
  'Spark': <Zap className="w-5 h-5 text-orange-500" />,
  'PySpark': <Zap className="w-5 h-5 text-orange-500" />,
  'MLflow': <img src="https://simpleicons.org/icons/mlflow.svg" className="w-5 h-5 filter invert" alt="MLflow" />,
  'Machine Learning': <Brain className="w-5 h-5 text-purple-400" />,
  'Data Engineering': <Database className="w-5 h-5 text-green-400" />,
  'Architecture': <Layout className="w-5 h-5 text-sky-400" />,
  'MLOps': <Cog className="w-5 h-5 text-slate-400" />,
  'Feature Store': <Database className="w-5 h-5 text-pink-400" />,
};

export default function TechStack({ languages = [], technologies = [] }) {
  
  const renderProgressBar = (item, color = 'bg-blue-500') => (
    <div key={item.name} className="mb-4 group">
      <div className="flex justify-between items-center mb-1 text-sm">
        <div className="flex items-center gap-2">
            {icons[item.name] || <Terminal className="w-4 h-4 text-slate-500" />}
            <span className="font-medium text-slate-200">{item.name}</span>
        </div>
        <span className="text-slate-500 text-xs font-mono">{item.score} XP</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(item.score, 100)}%` }} // Simple normalization for now
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color} relative`}
        >
            <div className={`absolute top-0 right-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]`} />
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Languages Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Code className="w-5 h-5 text-green-400" /> Languages
        </h3>
        <div className="space-y-1">
            {languages.filter(l => l.score > 0 || ['Python', 'SQL'].includes(l.name)).length > 0 ? (
                languages.map(lang => {
                    let color = 'bg-slate-500';
                    if (lang.name === 'Python') color = 'bg-yellow-500';
                    if (lang.name === 'SQL') color = 'bg-blue-500';
                    if (lang.name === 'Scala') color = 'bg-red-500';
                    return renderProgressBar(lang, color);
                })
            ) : (
                <div className="text-sm text-slate-500 italic pb-4">Start learning to unlock language stats.</div>
            )}
        </div>
      </div>

      {/* Technologies Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" /> Technologies
        </h3>
        <div>
            {technologies.length > 0 ? (
                technologies.slice(0, 6).map(tech => renderProgressBar(tech, 'bg-purple-500'))
            ) : (
                <div className="text-sm text-slate-500 italic">Complete modules to track technology expertise.</div>
            )}
        </div>
      </div>

    </div>
  );
}
