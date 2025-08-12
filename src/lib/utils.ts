import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrgNode, NodeProgress, CategoryProgress, OrganizationProgress, GraphNode, GraphLink, GraphData } from '../types';

/**
 * Utility function for combining Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get all leaf nodes (tasks with no children) from a tree
 */
export function getLeafNodes(node: OrgNode): OrgNode[] {
  if (node.children.length === 0) {
    return [node];
  }
  
  return node.children.flatMap(child => getLeafNodes(child));
}

/**
 * Calculate the weight of a node (1 + sum of all children weights)
 * Used for visualization sizing
 */
export function calculateWeight(node: OrgNode): number {
  if (node.children.length === 0) {
    return 1;
  }
  
  return 1 + node.children.reduce((sum, child) => sum + calculateWeight(child), 0);
}

/**
 * Calculate progress for a node (completed leaf nodes / total leaf nodes)
 */
export function calculateProgress(node: OrgNode): NodeProgress {
  const leafNodes = getLeafNodes(node);
  const completedLeaves = leafNodes.filter(n => n.isComplete);
  const percentage = leafNodes.length > 0 ? completedLeaves.length / leafNodes.length : 0;
  
  return {
    nodeId: node.id,
    completedCount: completedLeaves.length,
    totalCount: leafNodes.length,
    percentage,
    weight: calculateWeight(node),
  };
}

/**
 * Get completion color based on percentage (Red → Yellow → Green)
 */
export function getCompletionColor(percentage: number): string {
  if (percentage === 0) return '#ef4444'; // red-500
  if (percentage === 1) return '#10b981'; // green-500
  
  // Create gradient from red to green through yellow
  const hue = percentage * 120; // 0 = red (0°), 120 = green (120°)
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage * 100)}%`;
}

/**
 * Find a node by ID in the tree
 */
export function findNodeById(root: OrgNode, targetId: string): OrgNode | null {
  if (root.id === targetId) {
    return root;
  }
  
  for (const child of root.children) {
    const found = findNodeById(child, targetId);
    if (found) {
      return found;
    }
  }
  
  return null;
}

/**
 * Get all parent nodes of a target node
 */
export function getParentPath(root: OrgNode, targetId: string, path: OrgNode[] = []): OrgNode[] | null {
  const currentPath = [...path, root];
  
  if (root.id === targetId) {
    return currentPath;
  }
  
  for (const child of root.children) {
    const result = getParentPath(child, targetId, currentPath);
    if (result) {
      return result;
    }
  }
  
  return null;
}

/**
 * Create a deep clone of an OrgNode tree
 */
export function cloneOrgNode(node: OrgNode): OrgNode {
  return {
    ...node,
    children: node.children.map(child => cloneOrgNode(child)),
  };
}

/**
 * Update a node's completion status with cascading logic
 * - Completing a parent marks all children as complete
 * - Uncompleting a parent marks all children as incomplete
 * - Completing the last child automatically completes the parent
 */
export function updateNodeCompletion(root: OrgNode, nodeId: string, isComplete: boolean): OrgNode {
  const newRoot = cloneOrgNode(root);
  const targetNode = findNodeById(newRoot, nodeId);
  
  if (!targetNode) {
    return newRoot;
  }
  
  // Update the target node
  targetNode.isComplete = isComplete;
  
  // If completing/uncompleting a parent, cascade to all children
  if (targetNode.children.length > 0) {
    cascadeToChildren(targetNode, isComplete);
  }
  
  // Update parent completion status based on children
  updateParentCompletion(newRoot, nodeId);
  
  return newRoot;
}

/**
 * Cascade completion status to all children
 */
function cascadeToChildren(node: OrgNode, isComplete: boolean): void {
  node.children.forEach(child => {
    child.isComplete = isComplete;
    if (child.children.length > 0) {
      cascadeToChildren(child, isComplete);
    }
  });
}

/**
 * Update parent completion status based on children completion
 */
function updateParentCompletion(root: OrgNode, changedNodeId: string): void {
  const parentPath = getParentPath(root, changedNodeId);
  
  if (!parentPath || parentPath.length <= 1) {
    return; // No parent or is root
  }
  
  // Start from the immediate parent and work up
  for (let i = parentPath.length - 2; i >= 0; i--) {
    const parent = parentPath[i];
    
    if (parent.children.length === 0) continue;
    
    // Check if all children are complete
    const allChildrenComplete = parent.children.every(child => child.isComplete);
    const anyChildComplete = parent.children.some(child => child.isComplete);
    
    // Update parent completion
    if (allChildrenComplete) {
      parent.isComplete = true;
    } else if (!anyChildComplete) {
      parent.isComplete = false;
    } else {
      // Some children complete, some not - parent remains incomplete
      parent.isComplete = false;
    }
  }
}

/**
 * Get progress for all main categories (direct children of root)
 */
export function getCategoryProgress(root: OrgNode): CategoryProgress[] {
  return root.children.map(category => {
    const progress = calculateProgress(category);
    const color = getCompletionColor(progress.percentage);
    
    return {
      categoryId: category.id,
      categoryName: category.name,
      progress,
      color,
    };
  });
}

/**
 * Calculate overall organization progress
 */
export function calculateOrganizationProgress(root: OrgNode): OrganizationProgress {
  const overallProgress = calculateProgress(root);
  const categoryProgress = getCategoryProgress(root);
  
  return {
    overallPercentage: overallProgress.percentage,
    totalTasks: overallProgress.totalCount,
    completedTasks: overallProgress.completedCount,
    categoryProgress,
    lastUpdated: new Date(),
  };
}

/**
 * Convert hierarchical OrgNode data to flat graph structure for D3.js
 */
export function convertToGraphData(root: OrgNode): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  
  function traverse(node: OrgNode, level: number, parentId?: string): void {
    const progress = calculateProgress(node);
    
    // Create graph node
    const graphNode: GraphNode = {
      id: node.id,
      name: node.name,
      level,
      completion: progress.percentage,
      weight: progress.weight,
      isLeaf: node.children.length === 0,
      originalNode: node,
    };
    
    nodes.push(graphNode);
    
    // Create link to parent (if not root)
    if (parentId) {
      links.push({
        source: parentId,
        target: node.id,
        strength: 1 / (level + 1), // Weaker links for deeper levels
      });
    }
    
    // Traverse children
    node.children.forEach(child => {
      traverse(child, level + 1, node.id);
    });
  }
  
  traverse(root, 0);
  
  return { nodes, links };
}

/**
 * Search nodes by name (case-insensitive)
 */
export function searchNodes(root: OrgNode, searchTerm: string): OrgNode[] {
  const results: OrgNode[] = [];
  const term = searchTerm.toLowerCase().trim();
  
  if (!term) return results;
  
  function traverse(node: OrgNode): void {
    if (node.name.toLowerCase().includes(term) || 
        node.description?.toLowerCase().includes(term)) {
      results.push(node);
    }
    
    node.children.forEach(child => traverse(child));
  }
  
  traverse(root);
  return results;
}

/**
 * Filter nodes by completion status
 */
export function filterNodesByCompletion(root: OrgNode, showCompleted: boolean): OrgNode {
  function filterNode(node: OrgNode): OrgNode | null {
    const filteredChildren = node.children
      .map(child => filterNode(child))
      .filter(Boolean) as OrgNode[];
    
    // Include if matches filter criteria or has matching children
    const matchesFilter = showCompleted ? node.isComplete : !node.isComplete;
    const hasMatchingChildren = filteredChildren.length > 0;
    
    if (matchesFilter || hasMatchingChildren) {
      return {
        ...node,
        children: filteredChildren,
      };
    }
    
    return null;
  }
  
  return filterNode(root) || cloneOrgNode(root);
}

/**
 * Get node hierarchy level (0 = root, 1 = category, 2 = subcategory, etc.)
 */
export function getNodeLevel(nodeId: string): number {
  const parts = nodeId.split('.');
  return parts.length - 1;
}

/**
 * Sort nodes by priority and completion status
 */
export function sortNodesByPriority(nodes: OrgNode[]): OrgNode[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  
  return [...nodes].sort((a, b) => {
    // Incomplete tasks first
    if (a.isComplete !== b.isComplete) {
      return a.isComplete ? 1 : -1;
    }
    
    // Then by priority
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Finally by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Validate OrgNode structure
 */
export function validateOrgNode(node: OrgNode): string[] {
  const errors: string[] = [];
  
  function validate(node: OrgNode, path: string): void {
    // Check required fields
    if (!node.id) errors.push(`${path}: Missing ID`);
    if (!node.name) errors.push(`${path}: Missing name`);
    if (typeof node.isComplete !== 'boolean') errors.push(`${path}: Invalid isComplete`);
    if (!Array.isArray(node.children)) errors.push(`${path}: Invalid children array`);
    
    // Validate children
    node.children.forEach((child, index) => {
      validate(child, `${path}.children[${index}]`);
    });
  }
  
  validate(node, 'root');
  return errors;
}