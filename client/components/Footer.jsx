'use client';
import Link from 'next/link';
import { Database, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#05090e] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brick to-orange-600 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Data<span className="text-brick">Quest</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-sm font-light">
              The premier interactive learning platform for the modern Data Lakehouse.
              Master Spark, Delta Lake, and Unity Catalog through hands-on practice.
            </p>
            <div className="flex space-x-4">
               <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
               <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
               <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
               <SocialIcon icon={<Youtube className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold text-white mb-6">Platform</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/dashboard" className="hover:text-brick transition-colors">Courses</Link></li>
              <li><Link href="/leaderboard" className="hover:text-brick transition-colors">Leaderboard</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold text-white mb-6">Resources</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-brick transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">Bitbucket</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-bold text-white mb-6">Company</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-brick transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">Legal</Link></li>
              <li><Link href="#" className="hover:text-brick transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-light">
           <div className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} DataQuest Inc. All rights reserved.
           </div>
           <div className="flex space-x-8">
              <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">Cookie Settings</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-brick hover:text-white hover:border-brick transition-all duration-300"
    >
      {icon}
    </a>
  );
}
