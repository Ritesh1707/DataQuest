'use client';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Award, Sparkles } from 'lucide-react';

const rarityColors = {
  common: 'from-slate-600 to-slate-700',
  rare: 'from-blue-600 to-blue-700',
  epic: 'from-purple-600 to-purple-700',
  legendary: 'from-yellow-500 to-orange-600'
};

const rarityBorders = {
  common: 'border-slate-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500'
};

const rarityGlows = {
  common: 'shadow-slate-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/50'
};

export default function AchievementShowcase({ achievements = [] }) {
  // Ensure we have at least some placeholder achievements
  const displayAchievements = achievements.length > 0 ? achievements : [
    { name: 'First Contact', description: 'Complete your first lesson', unlocked: false, rarity: 'common' },
    { name: 'Python Prodigy', description: 'Complete 5 Python lessons', unlocked: false, rarity: 'rare' },
    { name: 'Master Architect', description: 'Complete an ADVANCED course', unlocked: false, rarity: 'epic' }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>
        <div className="text-sm text-slate-400">
          {displayAchievements.filter(a => a.unlocked).length} / {displayAchievements.length}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayAchievements.map((achievement, idx) => {
          const rarity = achievement.rarity || 'common';
          const isUnlocked = achievement.unlocked;

          return (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative group cursor-pointer`}
            >
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isUnlocked
                    ? `bg-gradient-to-br ${rarityColors[rarity]} ${rarityBorders[rarity]} ${rarityGlows[rarity]} shadow-lg hover:scale-105`
                    : 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-80'
                }`}
              >
                {/* Badge Icon */}
                {/* Badge Icon */}
                <div className="flex justify-center mb-3 h-14 items-center">
                  {isUnlocked ? (
                    <div className="relative">
                      {achievement.imageUrl ? (
                         <img src={achievement.imageUrl} className="w-12 h-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] filter brightness-110" alt={achievement.name} />
                      ) : (
                         <Award className="w-12 h-12 text-white" />
                      )}
                      
                      {rarity === 'legendary' && (
                        <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                      )}
                    </div>
                  ) : (
                    <div className="relative"> 
                        <Lock className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Badge Name */}
                <h4 className={`text-sm font-bold text-center mb-1 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {achievement.name}
                </h4>

                {/* Rarity Indicator */}
                <div className="flex justify-center mb-2">
                  {[...Array(rarity === 'legendary' ? 4 : rarity === 'epic' ? 3 : rarity === 'rare' ? 2 : 1)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        isUnlocked ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {achievement.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Achievement Progress</span>
          <span>{Math.round((displayAchievements.filter(a => a.unlocked).length / displayAchievements.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(displayAchievements.filter(a => a.unlocked).length / displayAchievements.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
          />
        </div>
      </div>
    </div>
  );
}
