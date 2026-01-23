'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Trophy, LogOut, LayoutDashboard, Database, Award, Settings, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rank, setRank] = useState(null);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    
    // Check scroll for glass effect
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Fetch Rank & User if logged in
    async function fetchData() {
       if (localStorage.getItem('token')) {
          try {
             const [rankData, userData] = await Promise.all([
                 api.getUserRank().catch(() => ({ rank: '...' })), 
                 api.getMe().catch(() => null)
             ]);
             setRank(rankData.rank);
             setUser(userData);
          } catch(e) { console.error(e); }
       }
    }
    fetchData();

    // Close dropdown on click outside
    const closeDropdown = () => setIsDropdownOpen(false);
    if(isDropdownOpen) window.addEventListener('click', closeDropdown);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('click', closeDropdown);
    };
  }, [pathname, isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    setIsLoggedIn(false);
    setRank(null);
    setUser(null);
  };

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled ? 'h-16 glass-panel shadow-lg bg-slate-900/80' : 'h-24 bg-transparent'
  }`;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3621] to-orange-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-orange-500/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white leading-none group-hover:text-[#FF3621] transition-colors">
              DataQuest
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Masterclass</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center space-x-6 mr-4">
                  <Link href="/dashboard" 
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                      pathname === '/dashboard' ? 'text-[#FF3621]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link href="/leaderboard" 
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                      pathname === '/leaderboard' ? 'text-[#FF3621]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Leaderboard</span>
                  </Link>
                  
                  <Link href="/profile" 
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                      pathname === '/profile' ? 'text-[#FF3621]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Achievements</span>
                  </Link>
              </div>
              
              <div className="h-6 w-px bg-white/10 hidden md:block" />

              <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <Link href="/profile" className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                     <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                     <span className="text-xs font-mono text-yellow-500">
                        {rank ? `Rank #${rank}` : 'Calculating...'}
                     </span>
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative group" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                      >
                         <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center hover:border-slate-500 transition-colors shadow-lg">
                            <span className="font-bold text-sm text-white">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                         </div>
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden animate-fade-in z-50">
                              <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
                                  <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                                  <p className="text-xs text-slate-400">Level {user?.level || 1} Pilot</p>
                              </div>
                              <div className="p-1">
                                  <Link 
                                    href="/profile" 
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center w-full px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-white/5 transition-colors"
                                  >
                                      <User className="w-4 h-4 mr-3 text-slate-400" />
                                      Profile
                                  </Link>
                                  <Link 
                                    href="/settings" 
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center w-full px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-white/5 transition-colors"
                                  >
                                      <Settings className="w-4 h-4 mr-3 text-slate-400" />
                                      Settings
                                  </Link>
                              </div>
                              <div className="p-1 border-t border-slate-700/50">
                                  <button 
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                  >
                                      <LogOut className="w-4 h-4 mr-3" />
                                      Sign Out
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

            </>
          ) : (
            <Link 
              href="/login"
              className="px-6 py-2.5 rounded-full bg-white/10 border border-white/5 hover:bg-white/20 hover:border-white/20 text-white text-sm font-medium transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
