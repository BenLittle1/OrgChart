'use client';

import React, { useState } from 'react';
import GraphVisualization from '../../components/graph/GraphVisualization';
import { useOrgData, useProgress, useNodeOperations } from '../../context/DataContext';
import { GraphNode } from '../../types';
import { formatPercentage, findNodeById } from '../../lib/utils';

export default function GraphPage() {
  const orgData = useOrgData();
  const progress = useProgress();
  const { updateNode } = useNodeOperations();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeClick = (graphNode: GraphNode) => {
    setSelectedNodeId(graphNode.id);
  };

  const selectedNode = selectedNodeId ? findNodeById(orgData, selectedNodeId) : null;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Network Visualization
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Interactive network graph showing your organizational structure and progress. 
            Larger nodes represent categories with more tasks, and colors indicate completion status.
          </p>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Nodes</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(() => {
                    // Count all nodes in the tree
                    const countNodes = (node: any): number => {
                      return 1 + node.children.reduce((sum: number, child: any) => sum + countNodes(child), 0);
                    };
                    return countNodes(orgData);
                  })()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Overall Progress</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatPercentage(progress.overallPercentage)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <p className="text-2xl font-bold text-slate-900">
                  {progress.categoryProgress.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Graph visualization */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="relative" style={{ height: '700px' }}>
                <GraphVisualization
                  onNodeClick={handleNodeClick}
                />
              </div>
            </div>
          </div>

          {/* Node details sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-24">
              {selectedNode ? (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Node Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-600">Name</h4>
                      <p className="text-slate-900 mt-1">{selectedNode.name}</p>
                    </div>
                    
                    {selectedNode.description && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-600">Description</h4>
                        <p className="text-slate-700 text-sm mt-1">{selectedNode.description}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-600">Type</h4>
                      <p className="text-slate-900 mt-1">
                        {selectedNode.children.length > 0 ? 'Category' : 'Task'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-600">Status</h4>
                      <div className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          checked={selectedNode.isComplete}
                          onChange={(e) => updateNode(selectedNode.id, e.target.checked)}
                          className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                        />
                        <span className="ml-2 text-slate-900">
                          {selectedNode.isComplete ? 'Complete' : 'Incomplete'}
                        </span>
                      </div>
                    </div>
                    
                    {selectedNode.priority && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-600">Priority</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          selectedNode.priority === 'high' ? 'bg-red-100 text-red-800' :
                          selectedNode.priority === 'low' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedNode.priority}
                        </span>
                      </div>
                    )}
                    
                    {selectedNode.children.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-600">Progress</h4>
                        <div className="mt-2">
                          {(() => {
                            const leafNodes = (node: any): any[] => {
                              if (node.children.length === 0) return [node];
                              return node.children.flatMap((child: any) => leafNodes(child));
                            };
                            const leaves = leafNodes(selectedNode);
                            const completed = leaves.filter(n => n.isComplete).length;
                            const total = leaves.length;
                            const percentage = total > 0 ? completed / total : 0;
                            
                            return (
                              <>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{completed} of {total} tasks</span>
                                  <span>{formatPercentage(percentage)}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div
                                    className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage * 100}%` }}
                                  />
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                    
                    {selectedNode.children.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-600">Children</h4>
                        <p className="text-slate-900 mt-1">{selectedNode.children.length} items</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No Node Selected
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Click on a node in the graph to view details and update its status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">How to Use the Graph</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2">Navigation</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>Click and drag</strong> to move nodes around</li>
                <li>• <strong>Scroll</strong> to zoom in and out</li>
                <li>• <strong>Click</strong> on any node to select it</li>
                <li>• <strong>Hover</strong> over nodes for quick details</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2">Visual Encoding</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>Node size</strong> indicates number of subtasks</li>
                <li>• <strong>Node color</strong> shows completion percentage</li>
                <li>• <strong>Red</strong> = Not started, <strong>Yellow</strong> = In progress, <strong>Green</strong> = Complete</li>
                <li>• <strong>Lines</strong> connect related categories and tasks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}