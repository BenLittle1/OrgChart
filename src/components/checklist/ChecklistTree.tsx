'use client';

import React, { useState } from 'react';
import { OrgNode } from '../../types';
import { useNodeOperations } from '../../context/DataContext';
import { cn, formatPercentage, calculateProgress, getCompletionColor } from '../../lib/utils';

interface ChecklistTreeProps {
  node: OrgNode;
  level?: number;
  searchTerm?: string;
}

interface ChecklistNodeProps {
  node: OrgNode;
  level: number;
  onToggle: (nodeId: string, isComplete: boolean) => void;
  searchTerm?: string;
}

/**
 * Individual checklist node component
 */
function ChecklistNode({ node, level, onToggle, searchTerm }: ChecklistNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = node.children.length > 0;
  const isLeaf = !hasChildren;
  const progress = calculateProgress(node);
  const completionColor = getCompletionColor(progress.percentage);

  // Highlight search terms
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Priority badge
  const PriorityBadge = ({ priority }: { priority?: string }) => {
    if (!priority || priority === 'medium') return null;
    
    const colors = {
      high: 'bg-red-100 text-red-800',
      low: 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={cn('text-xs px-2 py-1 rounded-full font-medium ml-2', colors[priority as keyof typeof colors])}>
        {priority}
      </span>
    );
  };

  return (
    <div className="relative">
      <div 
        className={cn(
          'flex items-center py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors duration-150',
          node.isComplete && 'opacity-75'
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        {/* Expand/collapse button for parent nodes */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-5 h-5 flex items-center justify-center mr-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg 
              className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-90')}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Checkbox */}
        <div className="flex items-center mr-3">
          <input
            type="checkbox"
            checked={node.isComplete}
            onChange={(e) => onToggle(node.id, e.target.checked)}
            className={cn(
              'w-4 h-4 rounded border-2 transition-colors duration-200',
              'focus:ring-2 focus:ring-slate-500 focus:ring-offset-1',
              node.isComplete 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'border-slate-300 hover:border-slate-400'
            )}
          />
        </div>

        {/* Node icon */}
        <div className="flex items-center mr-3">
          {isLeaf ? (
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          )}
        </div>

        {/* Node content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className={cn(
              'text-sm font-medium truncate',
              node.isComplete ? 'line-through text-slate-500' : 'text-slate-900'
            )}>
              {highlightText(node.name)}
            </h3>
            <PriorityBadge priority={node.priority} />
          </div>
          
          {/* Description */}
          {node.description && (
            <p className="text-xs text-slate-500 mt-1 truncate">
              {highlightText(node.description)}
            </p>
          )}
          
          {/* Progress for parent nodes */}
          {hasChildren && (
            <div className="flex items-center mt-2 space-x-2">
              <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progress.percentage * 100}%`,
                    backgroundColor: completionColor
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 min-w-fit">
                {formatPercentage(progress.percentage)} ({progress.completedCount}/{progress.totalCount})
              </span>
            </div>
          )}
        </div>

        {/* Completion indicator */}
        {node.isComplete && (
          <div className="ml-2 text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children.map((child) => (
            <ChecklistNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Main checklist tree component with search and filtering
 */
export default function ChecklistTree({ node, level = 0, searchTerm }: ChecklistTreeProps) {
  const { updateNode } = useNodeOperations();
  const [showCompleted, setShowCompleted] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const effectiveSearchTerm = searchTerm || localSearchTerm;

  // Filter nodes based on search and completion status
  const filterNode = (node: OrgNode): OrgNode | null => {
    const matchesSearch = !effectiveSearchTerm || 
      node.name.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
      node.description?.toLowerCase().includes(effectiveSearchTerm.toLowerCase());
    
    const matchesCompletion = showCompleted || !node.isComplete;
    
    const filteredChildren = node.children
      .map(child => filterNode(child))
      .filter(Boolean) as OrgNode[];
    
    if (matchesSearch && matchesCompletion) {
      return { ...node, children: filteredChildren };
    }
    
    if (filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
    
    return null;
  };

  const filteredNode = filterNode(node);
  
  if (!filteredNode) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No items match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      {level === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>

            {/* Filter toggle */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                />
                <span>Show completed</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tree */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4">
          <ChecklistNode
            node={filteredNode}
            level={level}
            onToggle={updateNode}
            searchTerm={effectiveSearchTerm}
          />
        </div>
      </div>
    </div>
  );
}