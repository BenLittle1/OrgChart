'use client';

import React from 'react';
import ProgressMetrics from '@/components/dashboard/ProgressMetrics';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';

export default function DashboardPage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-400">
          Detailed progress metrics and organizational insights
        </p>
      </div>
      
      <div className="space-y-6">
        <ProgressMetrics />
        <CategoryBreakdown />
      </div>
    </div>
  );
}