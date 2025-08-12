'use client';

import React from 'react';
import { useProgress, useNodeOperations } from '../../context/DataContext';
import { ProgressMetrics } from '../../components/dashboard/ProgressMetrics';
import { CategoryBreakdown } from '../../components/dashboard/CategoryBreakdown';
import { formatPercentage } from '../../lib/utils';

export default function DashboardPage() {
  const progress = useProgress();
  const { resetAllData, saveData } = useNodeOperations();

  const handleExportData = () => {
    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orgraph-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      resetAllData();
    }
  };

  // Calculate additional insights
  const insights = {
    averageCompletionRate: progress.categoryProgress.reduce((sum, cat) => sum + cat.progress.percentage, 0) / progress.categoryProgress.length,
    highestCategory: progress.categoryProgress.reduce((max, cat) => cat.progress.percentage > max.progress.percentage ? cat : max),
    lowestCategory: progress.categoryProgress.reduce((min, cat) => cat.progress.percentage < min.progress.percentage ? cat : min),
    tasksPerCategory: Math.round(progress.totalTasks / progress.categoryProgress.length),
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Progress Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                Comprehensive analytics and insights into your organizational maturity progress.
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={saveData}
                className="btn-secondary"
              >
                Save Progress
              </button>
              <button
                onClick={handleExportData}
                className="btn-secondary"
              >
                Export Data
              </button>
              <button
                onClick={handleResetData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* Main metrics */}
        <div className="mb-8">
          <ProgressMetrics progress={progress} />
        </div>

        {/* Insights cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-800">Average Progress</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatPercentage(insights.averageCompletionRate)}
                </p>
                <p className="text-xs text-blue-700">Across all categories</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-800">Top Category</p>
                <p className="text-lg font-bold text-green-900 truncate">
                  {insights.highestCategory.categoryName}
                </p>
                <p className="text-xs text-green-700">
                  {formatPercentage(insights.highestCategory.progress.percentage)} complete
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-800">Focus Area</p>
                <p className="text-lg font-bold text-orange-900 truncate">
                  {insights.lowestCategory.categoryName}
                </p>
                <p className="text-xs text-orange-700">
                  {formatPercentage(insights.lowestCategory.progress.percentage)} complete
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-800">Avg Tasks</p>
                <p className="text-2xl font-bold text-purple-900">{insights.tasksPerCategory}</p>
                <p className="text-xs text-purple-700">Per category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Progress Overview</h3>
          <div className="space-y-4">
            {progress.categoryProgress.map((category) => (
              <div key={category.categoryId}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-slate-900">
                      {category.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">
                      {category.progress.completedCount}/{category.progress.totalCount}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatPercentage(category.progress.percentage)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${category.progress.percentage * 100}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed category breakdown */}
        <CategoryBreakdown categories={progress.categoryProgress} />

        {/* Summary stats */}
        <div className="mt-8 bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{progress.totalTasks}</p>
              <p className="text-sm text-slate-600">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{progress.categoryProgress.length}</p>
              <p className="text-sm text-slate-600">Business Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {new Date(progress.lastUpdated).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-600">Last Updated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}