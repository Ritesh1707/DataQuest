'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Trophy, LogOut, LayoutDashboard, Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    
    // Check scroll for glass effect
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Fetch Rank if logged in
    async function fetchRank() {
       if (localStorage.getItem('token')) {
          try {
             const data = await api.getUserRank();
             setRank(data.rank);
          } catch(e) { console.error(e); }
       }
    }
    fetchRank();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    setIsLoggedIn(false);
    setRank(null);
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
        <div className="flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" 
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                  pathname === '/dashboard' ? 'text-[#FF3621]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <div className="h-6 w-px bg-white/10" />

              <Link href="/leaderboard" className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                 <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                 <span className="text-xs font-mono text-yellow-500">
                    Global Rank {rank ? `#${rank}` : '#...'}
                 </span>
              </Link>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
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
