import { OrgNode, ProgressStats, CategoryProgress, GraphNode, GraphLink } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Deep clone function for immutable updates
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Find a node by ID in the hierarchy
export function findNode(data: OrgNode, nodeId: string): OrgNode | null {
  if (data.id === nodeId) return data;
  
  for (const child of data.children) {
    const found = findNode(child, nodeId);
    if (found) return found;
  }
  
  return null;
}

// Update a node's completion status and cascade to children
export function updateNodeCompletion(data: OrgNode, nodeId: string, isComplete: boolean): OrgNode {
  const newData = deepClone(data);
  const node = findNode(newData, nodeId);
  
  if (!node) return newData;
  
  // Update the node itself
  node.isComplete = isComplete;
  
  // If completing, mark all children as complete
  if (isComplete) {
    markAllChildrenComplete(node, true);
  }
  
  // If uncompleting, mark all children as incomplete
  if (!isComplete) {
    markAllChildrenComplete(node, false);
  }
  
  // Update parent nodes based on children completion
  updateParentCompletion(newData, nodeId);
  
  return newData;
}

// Recursively mark all children as complete/incomplete
function markAllChildrenComplete(node: OrgNode, isComplete: boolean): void {
  node.isComplete = isComplete;
  for (const child of node.children) {
    markAllChildrenComplete(child, isComplete);
  }
}

// Update parent completion status based on children
function updateParentCompletion(data: OrgNode, changedNodeId: string): void {
  const parent = findParentNode(data, changedNodeId);
  if (!parent) return;
  
  // Check if all children are complete
  const allChildrenComplete = parent.children.every(child => child.isComplete);
  
  // Parent is complete only if all children are complete
  parent.isComplete = allChildrenComplete;
  
  // Recursively update grandparent
  updateParentCompletion(data, parent.id);
}

// Find the parent node of a given node ID
function findParentNode(data: OrgNode, nodeId: string): OrgNode | null {
  for (const child of data.children) {
    if (child.id === nodeId) return data;
    
    const parent = findParentNode(child, nodeId);
    if (parent) return parent;
  }
  
  return null;
}

// Calculate progress statistics for a node and its subtree
export function calculateProgress(node: OrgNode): ProgressStats {
  const leafNodes = getLeafNodes(node);
  const completed = leafNodes.filter(leaf => leaf.isComplete).length;
  const total = leafNodes.length;
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

// Get all leaf nodes (nodes without children) from a subtree
function getLeafNodes(node: OrgNode): OrgNode[] {
  if (node.children.length === 0) {
    return [node];
  }
  
  const leafNodes: OrgNode[] = [];
  for (const child of node.children) {
    leafNodes.push(...getLeafNodes(child));
  }
  
  return leafNodes;
}

// Calculate progress for each top-level category
export function calculateCategoryProgress(data: OrgNode): CategoryProgress[] {
  return data.children.map(category => ({
    id: category.id,
    name: category.name,
    progress: calculateProgress(category)
  }));
}

// Calculate node weight for graph visualization (1 + sum of children weights)
export function calculateNodeWeight(node: OrgNode): number {
  if (node.children.length === 0) return 1;
  
  return 1 + node.children.reduce((sum, child) => sum + calculateNodeWeight(child), 0);
}

// Convert organizational data to graph nodes and links for D3
export function convertToGraphData(data: OrgNode): { nodes: GraphNode[], links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  
  function traverse(node: OrgNode, level: number = 0) {
    const progress = calculateProgress(node);
    
    nodes.push({
      id: node.id,
      name: node.name,
      isComplete: node.isComplete,
      children: node.children,
      weight: calculateNodeWeight(node),
      completionPercentage: progress.percentage,
      level
    });
    
    // Add links from parent to children
    for (const child of node.children) {
      links.push({
        source: node.id,
        target: child.id
      });
      
      traverse(child, level + 1);
    }
  }
  
  traverse(data);
  
  return { nodes, links };
}

// Get color based on completion percentage
export function getCompletionColor(percentage: number): string {
  if (percentage === 0) return '#ef4444'; // red-500
  if (percentage === 100) return '#10b981'; // emerald-500
  
  // Interpolate between red, yellow, and green
  if (percentage <= 50) {
    // Red to yellow
    const ratio = percentage / 50;
    const red = 239;
    const green = Math.round(68 + (251 - 68) * ratio); // 68 to 185 (yellow)
    return `rgb(${red}, ${green}, 68)`;
  } else {
    // Yellow to green
    const ratio = (percentage - 50) / 50;
    const red = Math.round(251 - (251 - 16) * ratio); // 251 to 16
    const green = Math.round(185 + (185 - 185) * ratio); // Stay at 185
    const blue = Math.round(68 + (129 - 68) * ratio); // 68 to 129
    return `rgb(${red}, ${green}, ${blue})`;
  }
}

// Format percentage for display
export function formatPercentage(percentage: number): string {
  return `${percentage}%`;
}

// Check if a node is a leaf node (task)
export function isLeafNode(node: OrgNode): boolean {
  return node.children.length === 0;
}

// Get all nodes at a specific level
export function getNodesAtLevel(data: OrgNode, targetLevel: number): OrgNode[] {
  const nodes: OrgNode[] = [];
  
  function traverse(node: OrgNode, level: number = 0) {
    if (level === targetLevel) {
      nodes.push(node);
      return;
    }
    
    for (const child of node.children) {
      traverse(child, level + 1);
    }
  }
  
  traverse(data);
  return nodes;
}