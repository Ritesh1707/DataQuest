'use client';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCw, CheckCircle } from 'lucide-react';

export default function FocusTimerWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            setIsComplete(true);
            setSessionCount(c => c + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (isComplete) {
       resetTimer();
    } else {
       setIsActive(!isActive);
    }
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsComplete(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
       {/* Background Glow */}
       <div className={`absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

       <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest">Focus Mode</h3>
          <div className="flex items-center gap-1 text-xs text-slate-400">
             <CheckCircle className="w-3 h-3 text-green-500" />
             {sessionCount} Sessions
          </div>
       </div>

       <div className="flex items-center justify-between">
          <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="45" stroke="#1e293b" strokeWidth="4" fill="none" />
                <circle 
                   cx="48" cy="48" r="45" 
                   stroke="#a855f7" 
                   strokeWidth="4" 
                   fill="none" 
                   strokeDasharray="283"
                   strokeDashoffset={283 - (283 * progress) / 100}
                   className="transition-all duration-1000 ease-linear"
                />
             </svg>
             <div className="absolute text-2xl font-mono font-bold text-white">
                {formatTime(timeLeft)}
             </div>
          </div>

          <div className="flex flex-col gap-2">
             <button 
               onClick={toggleTimer}
               className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                 isActive 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/30'
               }`}
             >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
             </button>
             
             <button 
               onClick={resetTimer}
               className="w-12 h-12 rounded-full bg-slate-800/50 text-slate-400 hover:bg-slate-700 flex items-center justify-center"
             >
                <RotateCw className="w-4 h-4" />
             </button>
          </div>
       </div>

       <div className="mt-4 text-xs text-center text-slate-500">
          {isActive ? 'Hyper-focus activated. Do not disturb.' : 'Start a 25m sprint to boost XP gain.'}
       </div>
    </div>
  );
}
