'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, BarChart3, Search, Users, Home, Globe } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/recommend', label: 'Recommendations', icon: TrendingUp },
    { href: '/analysis', label: 'Analysis', icon: Search },
    { href: '/funds', label: 'Fund Explorer', icon: Users },
  ];

  return (
    <nav className="sticky top-0 z-50 px-4 pt-4">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-100/20 to-transparent blur-3xl opacity-50" />

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto bg-white/60 backdrop-blur-md border border-white/50 shadow-2xl shadow-amber-900/5 rounded-[2rem]">
        <div className="px-6">
          <div className="flex h-18 items-center justify-between py-3">

            {/* Logo - Matching the Pearl/Gold theme */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Globe className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-950">
                MUTUAL.<span className="text-amber-600">AI</span>
              </span>
            </Link>

            {/* Nav Items - Floating Pill Style */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300
                      ${isActive
                        ? 'bg-white text-amber-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-950 hover:bg-white/50'}
                    `}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-950'
                      }`}
                    />
                    <span className="tracking-tight">{item.label}</span>
                    
                    {/* Active Underline Dot */}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Hackathon Badge - Luxury Style */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-700 shadow-[inset_0_1px_2px_rgba(251,191,36,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                TechNEX 2025
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;