'use client';

import Link from 'next/link';
import { useProgress } from '../context/DataContext';
import { formatPercentage } from '../lib/utils';

export default function HomePage() {
  const progress = useProgress();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Organizational Maturity Assessment
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Visualize and track your organization&apos;s operational maturity through 
            interactive dashboards, checklists, and network graphs. Transform complex 
            business processes into clear, actionable insights.
          </p>
          
          {/* Overall progress */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Overall Progress</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-4xl font-bold text-slate-900">
                {formatPercentage(progress.overallPercentage)}
              </div>
              <div className="text-slate-600">
                <div>{progress.completedTasks} of {progress.totalTasks} tasks completed</div>
              </div>
            </div>
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                style={{ width: `${progress.overallPercentage * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/checklist" className="group">
            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-slate-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">Checklist View</h3>
              </div>
              <p className="text-slate-600">Task management with cascading completion logic and hierarchical organization.</p>
            </div>
          </Link>
          
          <Link href="/graph" className="group">
            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-slate-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">Graph View</h3>
              </div>
              <p className="text-slate-600">Interactive network visualization showing organizational structure and relationships.</p>
            </div>
          </Link>
          
          <Link href="/dashboard" className="group">
            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-slate-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">Dashboard View</h3>
              </div>
              <p className="text-slate-600">Progress metrics, analytics, and detailed category breakdowns.</p>
            </div>
          </Link>
        </div>

        {/* Category progress overview */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Category Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.categoryProgress.map((category) => (
              <div key={category.categoryId} className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-900 truncate">
                    {category.categoryName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${category.progress.percentage * 100}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 min-w-0">
                      {formatPercentage(category.progress.percentage)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}