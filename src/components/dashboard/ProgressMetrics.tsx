'use client';

import React from 'react';
import { OrganizationProgress } from '../../types';
import { formatPercentage, getCompletionColor } from '../../lib/utils';

interface ProgressMetricsProps {
  progress: OrganizationProgress;
}

export function ProgressMetrics({ progress }: ProgressMetricsProps) {
  const completionPercentage = progress.overallPercentage;
  const remainingTasks = progress.totalTasks - progress.completedTasks;
  
  // Calculate category statistics
  const categoryStats = {
    completed: progress.categoryProgress.filter(cat => cat.progress.percentage === 1).length,
    inProgress: progress.categoryProgress.filter(cat => cat.progress.percentage > 0 && cat.progress.percentage < 1).length,
    notStarted: progress.categoryProgress.filter(cat => cat.progress.percentage === 0).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Completion */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: getCompletionColor(completionPercentage) }}
            >
              {Math.round(completionPercentage * 100)}%
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Overall Progress</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatPercentage(completionPercentage)}
            </p>
            <p className="text-xs text-slate-500">
              {progress.completedTasks} of {progress.totalTasks} tasks
            </p>
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Completed</p>
            <p className="text-2xl font-bold text-slate-900">{progress.completedTasks}</p>
            <p className="text-xs text-slate-500">
              {formatPercentage(progress.completedTasks / progress.totalTasks)} of total
            </p>
          </div>
        </div>
      </div>

      {/* Remaining Tasks */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Remaining</p>
            <p className="text-2xl font-bold text-slate-900">{remainingTasks}</p>
            <p className="text-xs text-slate-500">
              {formatPercentage(remainingTasks / progress.totalTasks)} of total
            </p>
          </div>
        </div>
      </div>

      {/* Categories Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Categories</p>
            <p className="text-2xl font-bold text-slate-900">{progress.categoryProgress.length}</p>
            <div className="text-xs text-slate-500">
              <span className="text-green-600">{categoryStats.completed} complete</span>
              {categoryStats.inProgress > 0 && (
                <span className="ml-2 text-orange-600">{categoryStats.inProgress} in progress</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}