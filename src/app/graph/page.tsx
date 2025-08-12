'use client';

import React from 'react';
import GraphVisualization from '../../components/graph/GraphVisualization';
import ErrorBoundary from '../../components/ui/ErrorBoundary';

export default function GraphPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Graph View</h1>
        <p className="text-slate-400">
          Interactive visualization of your organizational structure and progress
        </p>
      </div>
      
      <div className="flex-1">
        <ErrorBoundary>
          <GraphVisualization />
        </ErrorBoundary>
      </div>
    </div>
  );
}