'use client';

import React, { useState } from 'react';
import { OrgNode } from '@/types';
import { useData } from '@/context/DataContext';
import { cn, isLeafNode, getCompletionColor, calculateProgress } from '@/lib/utils';

interface ChecklistTreeProps {
  node: OrgNode;
  level: number;
}

export default function ChecklistTree({ node, level }: ChecklistTreeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const { updateNode } = useData();
  
  const hasChildren = node.children.length > 0;
  const isTask = isLeafNode(node);
  const progress = calculateProgress(node);
  const indentSize = level * 24; // 24px per level

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    updateNode(node.id, checked);
  };

  const getNodeIcon = () => {
    if (isTask) {
      return node.isComplete ? '✅' : '◻️';
    }
    return isExpanded ? '📂' : '📁';
  };

  const getNodeStyles = () => {
    if (isTask) {
      return node.isComplete 
        ? 'text-slate-300 line-through' 
        : 'text-slate-100';
    }
    
    // Parent node styling based on completion
    const baseStyle = 'font-semibold';
    if (progress.percentage === 100) {
      return `${baseStyle} text-emerald-400`;
    } else if (progress.percentage > 0) {
      return `${baseStyle} text-yellow-400`;
    }
    return `${baseStyle} text-red-400`;
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-3 py-2 px-4 hover:bg-slate-700 transition-colors border-b border-slate-700/50',
          hasChildren && 'cursor-pointer'
        )}
        style={{ paddingLeft: `${16 + indentSize}px` }}
        onClick={hasChildren ? handleToggle : undefined}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <button
            className="text-slate-400 hover:text-slate-200 w-4 h-4 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            <span className="text-xs">
              {isExpanded ? '▼' : '▶'}
            </span>
          </button>
        )}
        
        {/* Checkbox for tasks only */}
        {isTask && (
          <input
            type="checkbox"
            checked={node.isComplete}
            onChange={(e) => {
              e.stopPropagation();
              handleCheckboxChange(e.target.checked);
            }}
            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
          />
        )}
        
        {/* Node Icon */}
        <span className="text-sm">{getNodeIcon()}</span>
        
        {/* Node Name */}
        <span className={cn('flex-1', getNodeStyles())}>
          {node.name}
        </span>
        
        {/* Progress Indicator for Parent Nodes */}
        {hasChildren && (
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-400">
              {progress.completed}/{progress.total}
            </div>
            <div 
              className="text-xs font-bold"
              style={{ color: getCompletionColor(progress.percentage) }}
            >
              {progress.percentage}%
            </div>
          </div>
        )}
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="animate-in slide-in-from-top-1">
          {node.children.map((child) => (
            <ChecklistTree
              key={child.id}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}