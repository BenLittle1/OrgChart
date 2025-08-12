'use client';

import Link from 'next/link';
import { useData } from '../context/DataContext';
import { getCompletionColor, formatPercentage } from '../lib/utils';

export default function Home() {
  const { getProgress, getCategoryProgress } = useData();
  
  const overallProgress = getProgress();
  const categoryProgress = getCategoryProgress();

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Organizational Maturity Assessment
        </h1>
        <p className="text-slate-400 text-lg">
          Track your company&apos;s operational progress across all business functions
        </p>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Overall Progress</h2>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Completed Tasks</span>
              <span className="text-slate-200">
                {overallProgress.completed} of {overallProgress.total} tasks
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${overallProgress.percentage}%`,
                  backgroundColor: getCompletionColor(overallProgress.percentage)
                }}
              />
            </div>
          </div>
          <div className="text-right">
            <div 
              className="text-4xl font-bold"
              style={{ color: getCompletionColor(overallProgress.percentage) }}
            >
              {formatPercentage(overallProgress.percentage)}
            </div>
            <div className="text-slate-400 text-sm">Complete</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link 
          href="/graph"
          className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 border border-slate-700 transition-colors group"
        >
          <div className="text-3xl mb-2">🌳</div>
          <h3 className="text-lg font-semibold text-slate-100 mb-1">Graph View</h3>
          <p className="text-slate-400 text-sm">
            Visual network of your organizational structure
          </p>
        </Link>

        <Link 
          href="/checklist"
          className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 border border-slate-700 transition-colors group"
        >
          <div className="text-3xl mb-2">✅</div>
          <h3 className="text-lg font-semibold text-slate-100 mb-1">Checklist</h3>
          <p className="text-slate-400 text-sm">
            Manage and complete your business tasks
          </p>
        </Link>

        <Link 
          href="/dashboard"
          className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 border border-slate-700 transition-colors group"
        >
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-lg font-semibold text-slate-100 mb-1">Dashboard</h3>
          <p className="text-slate-400 text-sm">
            Detailed progress metrics and insights
          </p>
        </Link>
      </div>

      {/* Category Overview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Category Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryProgress.map((category) => (
            <div key={category.id} className="bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-slate-100">{category.name}</h3>
                <span 
                  className="font-bold text-sm"
                  style={{ color: getCompletionColor(category.progress.percentage) }}
                >
                  {formatPercentage(category.progress.percentage)}
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${category.progress.percentage}%`,
                    backgroundColor: getCompletionColor(category.progress.percentage)
                  }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {category.progress.completed} of {category.progress.total} tasks
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
