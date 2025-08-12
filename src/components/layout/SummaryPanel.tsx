'use client';

import React from 'react';
import { useData } from '../../context/DataContext';
import { formatPercentage, getCompletionColor } from '../../lib/utils';

export default function SummaryPanel() {
  const { getProgress, getCategoryProgress, resetAllData } = useData();
  
  const overallProgress = getProgress();
  const categoryProgress = getCategoryProgress();

  return (
    <div className="p-4 border-t border-slate-700">
      {/* Overall Progress */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Overall Progress</h3>
        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Completed Tasks</span>
            <span className="text-slate-200">
              {overallProgress.completed} / {overallProgress.total}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${overallProgress.percentage}%`,
                backgroundColor: getCompletionColor(overallProgress.percentage)
              }}
            />
          </div>
          <div className="text-center mt-1">
            <span 
              className="text-lg font-bold"
              style={{ color: getCompletionColor(overallProgress.percentage) }}
            >
              {formatPercentage(overallProgress.percentage)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Categories</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {categoryProgress.map((category) => (
            <div key={category.id} className="text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 truncate" title={category.name}>
                  {category.name}
                </span>
                <span 
                  className="font-medium"
                  style={{ color: getCompletionColor(category.progress.percentage) }}
                >
                  {formatPercentage(category.progress.percentage)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${category.progress.percentage}%`,
                    backgroundColor: getCompletionColor(category.progress.percentage)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetAllData}
        className="w-full px-3 py-2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors"
      >
        Reset All Progress
      </button>
    </div>
  );
}