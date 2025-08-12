'use client';

import React from 'react';
import ChecklistTree from '../../components/checklist/ChecklistTree';
import { useOrgData, useProgress } from '../../context/DataContext';
import { formatPercentage } from '../../lib/utils';

export default function ChecklistPage() {
  const orgData = useOrgData();
  const progress = useProgress();

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Task Checklist
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Track your organizational maturity by completing tasks across all business categories. 
            Check off items to see your progress update in real-time.
          </p>
          
          {/* Progress summary */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Overall Progress
                </h2>
                <p className="text-slate-600">
                  {progress.completedTasks} of {progress.totalTasks} tasks completed
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-slate-900">
                    {formatPercentage(progress.overallPercentage)}
                  </div>
                  <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                      style={{ width: `${progress.overallPercentage * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{progress.completedTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Remaining</p>
                <p className="text-2xl font-bold text-slate-900">{progress.totalTasks - progress.completedTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <p className="text-2xl font-bold text-slate-900">{progress.categoryProgress.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category progress overview */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Progress by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.categoryProgress.map((category) => (
              <div key={category.categoryId} className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {category.categoryName}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {formatPercentage(category.progress.percentage)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${category.progress.percentage * 100}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main checklist */}
        <ChecklistTree node={orgData} />
      </div>
    </div>
  );
}