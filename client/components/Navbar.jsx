'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, User, Trophy, BookOpen } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simple verification - just check if user string exists
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              DatabricksMaster
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn
                </Link>
                <Link href="/leaderboard" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Link>
                <div className="flex items-center px-3 py-2 text-sm text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  {user.name} (Lvl {user.level || 1})
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-900/20 text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
