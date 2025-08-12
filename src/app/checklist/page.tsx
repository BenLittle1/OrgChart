'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import ChecklistTree from '@/components/checklist/ChecklistTree';

export default function ChecklistPage() {
  const { data } = useData();

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Task Checklist</h1>
        <p className="text-slate-400">
          Complete tasks to track your organizational maturity progress
        </p>
      </div>
      
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <ChecklistTree node={data} level={0} />
      </div>
    </div>
  );
}