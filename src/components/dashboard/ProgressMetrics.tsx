'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { getCompletionColor, formatPercentage, getNodesAtLevel } from '@/lib/utils';

export default function ProgressMetrics() {
  const { data, getProgress } = useData();
  
  const overallProgress = getProgress();
  const categories = getNodesAtLevel(data, 1); // Top-level categories
  const subcategories = getNodesAtLevel(data, 2); // Second-level subcategories
  const tasks = getNodesAtLevel(data, 3); // Individual tasks
  
  const completedTasks = tasks.filter(task => task.isComplete).length;
  const completedCategories = categories.filter(cat => cat.isComplete).length;
  const completedSubcategories = subcategories.filter(sub => sub.isComplete).length;

  const metrics = [
    {
      title: 'Overall Progress',
      value: formatPercentage(overallProgress.percentage),
      subtitle: `${overallProgress.completed} of ${overallProgress.total} tasks completed`,
      color: getCompletionColor(overallProgress.percentage),
      icon: '📊'
    },
    {
      title: 'Categories Completed',
      value: `${completedCategories}/${categories.length}`,
      subtitle: `${Math.round((completedCategories / categories.length) * 100)}% of main business areas`,
      color: getCompletionColor((completedCategories / categories.length) * 100),
      icon: '📂'
    },
    {
      title: 'Subcategories Completed', 
      value: `${completedSubcategories}/${subcategories.length}`,
      subtitle: `${Math.round((completedSubcategories / subcategories.length) * 100)}% of process areas`,
      color: getCompletionColor((completedSubcategories / subcategories.length) * 100),
      icon: '📋'
    },
    {
      title: 'Tasks Completed',
      value: `${completedTasks}/${tasks.length}`,
      subtitle: `${Math.round((completedTasks / tasks.length) * 100)}% of individual tasks`,
      color: getCompletionColor((completedTasks / tasks.length) * 100),
      icon: '✅'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{metric.icon}</span>
            <h3 className="text-sm font-semibold text-slate-300">{metric.title}</h3>
          </div>
          
          <div className="mb-2">
            <div 
              className="text-2xl font-bold"
              style={{ color: metric.color }}
            >
              {metric.value}
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            {metric.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}