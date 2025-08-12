'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

const navigationItems = [
  {
    name: 'Overview',
    href: '/',
    icon: '🏠',
    description: 'Home dashboard'
  },
  {
    name: 'Graph View',
    href: '/graph',
    icon: '🌳',
    description: 'Visual network view'
  },
  {
    name: 'Checklist',
    href: '/checklist', 
    icon: '✅',
    description: 'Task management'
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    description: 'Progress metrics'
  }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-100 mb-2">OrgGraph</h1>
        <p className="text-sm text-slate-400">Organizational Maturity</p>
      </div>
      
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-slate-400">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}