'use client';

import React, { useState } from 'react';
import { CategoryProgress } from '../../types';
import { formatPercentage, cn } from '../../lib/utils';

interface CategoryBreakdownProps {
  categories: CategoryProgress[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'tasks'>('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort categories
  const sortedCategories = [...categories].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.categoryName.localeCompare(b.categoryName);
        break;
      case 'progress':
        comparison = a.progress.percentage - b.progress.percentage;
        break;
      case 'tasks':
        comparison = a.progress.totalCount - b.progress.totalCount;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Category Breakdown</h3>
        <p className="text-sm text-slate-600 mt-1">
          Progress details for each business category
        </p>
      </div>

      {/* Table header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <button
            onClick={() => handleSort('name')}
            className={cn(
              'col-span-5 flex items-center space-x-1 text-left hover:text-slate-700 transition-colors',
              sortBy === 'name' && 'text-slate-700'
            )}
          >
            <span>Category</span>
            <SortIcon field="name" />
          </button>
          
          <button
            onClick={() => handleSort('progress')}
            className={cn(
              'col-span-3 flex items-center space-x-1 text-left hover:text-slate-700 transition-colors',
              sortBy === 'progress' && 'text-slate-700'
            )}
          >
            <span>Progress</span>
            <SortIcon field="progress" />
          </button>
          
          <button
            onClick={() => handleSort('tasks')}
            className={cn(
              'col-span-2 flex items-center space-x-1 text-left hover:text-slate-700 transition-colors',
              sortBy === 'tasks' && 'text-slate-700'
            )}
          >
            <span>Tasks</span>
            <SortIcon field="tasks" />
          </button>
          
          <div className="col-span-2 text-left">
            <span>Status</span>
          </div>
        </div>
      </div>

      {/* Table body */}
      <div className="divide-y divide-slate-200">
        {sortedCategories.map((category) => {
          const statusInfo = {
            complete: category.progress.percentage === 1,
            inProgress: category.progress.percentage > 0 && category.progress.percentage < 1,
            notStarted: category.progress.percentage === 0,
          };

          const statusLabel = statusInfo.complete ? 'Complete' : 
                             statusInfo.inProgress ? 'In Progress' : 
                             'Not Started';

          const statusColor = statusInfo.complete ? 'text-green-600 bg-green-100' :
                             statusInfo.inProgress ? 'text-orange-600 bg-orange-100' :
                             'text-slate-500 bg-slate-100';

          return (
            <div key={category.categoryId} className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Category name */}
                <div className="col-span-5">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">
                        {category.categoryName}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="col-span-3">
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
                    <span className="text-sm font-medium text-slate-900 min-w-fit">
                      {formatPercentage(category.progress.percentage)}
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="col-span-2">
                  <div className="text-sm text-slate-900">
                    <span className="font-medium">{category.progress.completedCount}</span>
                    <span className="text-slate-500">/{category.progress.totalCount}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusColor
                  )}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex justify-between items-center text-sm">
          <div className="text-slate-600">
            {categories.length} total categories
          </div>
          <div className="text-slate-900">
            <span className="font-medium">
              {categories.filter(c => c.progress.percentage === 1).length} complete
            </span>
            <span className="text-slate-500 ml-2">
              {categories.filter(c => c.progress.percentage > 0 && c.progress.percentage < 1).length} in progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}