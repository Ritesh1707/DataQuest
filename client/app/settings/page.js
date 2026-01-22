'use client';
import Navbar from '@/components/Navbar';
import { Settings, Construction } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      <Navbar />
      <div className="pt-32 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800/50 mb-8 ring-1 ring-white/10">
          <Settings className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          Manage your account preferences, notifications, and privacy settings.
        </p>
        
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col items-center">
           <Construction className="w-8 h-8 text-brick mb-4" />
           <h3 className="text-xl font-semibold mb-2">Work in Progress</h3>
           <p className="text-slate-500">
             The Engineering team is currently calibrating this module. Check back soon!
           </p>
        </div>
      </div>
    </div>
  );
}
