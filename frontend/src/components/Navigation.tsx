'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, BarChart3, Search, Users, Home } from 'lucide-react';

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
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Mutual Fund AI
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              TechNEX Hackathon
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;