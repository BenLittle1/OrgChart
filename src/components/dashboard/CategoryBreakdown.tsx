'use client';

import React from 'react';
import { useData } from '../../context/DataContext';
import { getCompletionColor, formatPercentage, calculateProgress } from '../../lib/utils';

export default function CategoryBreakdown() {
  const { data } = useData();
  
  const categories = data.children;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100">Category Breakdown</h2>
        <p className="text-slate-400 text-sm mt-1">
          Detailed progress for each business function
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {categories.map((category) => {
            const progress = calculateProgress(category);
            
            return (
              <div key={category.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-100">{category.name}</h3>
                  <span 
                    className="font-bold text-lg"
                    style={{ color: getCompletionColor(progress.percentage) }}
                  >
                    {formatPercentage(progress.percentage)}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${progress.percentage}%`,
                        backgroundColor: getCompletionColor(progress.percentage)
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-sm text-slate-400 mb-3">
                  {progress.completed} of {progress.total} tasks completed
                </div>
                
                {/* Subcategories */}
                <div className="space-y-2">
                  {category.children.map((subcategory) => {
                    const subProgress = calculateProgress(subcategory);
                    
                    return (
                      <div key={subcategory.id} className="bg-slate-600 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-200">
                            {subcategory.name}
                          </span>
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: getCompletionColor(subProgress.percentage) }}
                          >
                            {formatPercentage(subProgress.percentage)}
                          </span>
                        </div>
                        
                        <div className="w-full bg-slate-500 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${subProgress.percentage}%`,
                              backgroundColor: getCompletionColor(subProgress.percentage)
                            }}
                          />
                        </div>
                        
                        <div className="text-xs text-slate-400 mt-1">
                          {subProgress.completed}/{subProgress.total} tasks
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}