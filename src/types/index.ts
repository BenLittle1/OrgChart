/**
 * Core data structure for the organizational hierarchy
 * Each node represents either a category, subcategory, or individual task
 */
export interface OrgNode {
  /** Unique identifier in hierarchical format (e.g., "2.1.3") */
  id: string;
  
  /** Display name for the node */
  name: string;
  
  /** Completion status of this node */
  isComplete: boolean;
  
  /** Child nodes - empty array for leaf tasks */
  children: OrgNode[];
  
  /** Optional description for additional context */
  description?: string;
  
  /** Optional priority level for task ordering */
  priority?: 'low' | 'medium' | 'high';
  
  /** Optional due date for time-sensitive tasks */
  dueDate?: string;
}

/**
 * Progress information for a node and its descendants
 */
export interface NodeProgress {
  /** The node this progress refers to */
  nodeId: string;
  
  /** Number of completed leaf nodes in this subtree */
  completedCount: number;
  
  /** Total number of leaf nodes in this subtree */
  totalCount: number;
  
  /** Completion percentage (0.0 to 1.0) */
  percentage: number;
  
  /** Weight of this node for visualization purposes */
  weight: number;
}

/**
 * Category-level progress summary
 */
export interface CategoryProgress {
  /** Category node ID */
  categoryId: string;
  
  /** Category name */
  categoryName: string;
  
  /** Progress information */
  progress: NodeProgress;
  
  /** Color for visualization */
  color: string;
}

/**
 * Overall organization progress summary
 */
export interface OrganizationProgress {
  /** Overall completion percentage */
  overallPercentage: number;
  
  /** Total number of tasks */
  totalTasks: number;
  
  /** Number of completed tasks */
  completedTasks: number;
  
  /** Progress by main category */
  categoryProgress: CategoryProgress[];
  
  /** Last updated timestamp */
  lastUpdated: Date;
}

/**
 * Data context state shape
 */
export interface DataContextState {
  /** Root organizational data */
  orgData: OrgNode;
  
  /** Whether data has been loaded from localStorage */
  isLoaded: boolean;
  
  /** Current overall progress */
  progress: OrganizationProgress;
  
  /** Update a node's completion status with cascading logic */
  updateNode: (nodeId: string, isComplete: boolean) => void;
  
  /** Get progress information for a specific node */
  getNodeProgress: (nodeId: string) => NodeProgress | null;
  
  /** Get progress for all main categories */
  getCategoryProgress: () => CategoryProgress[];
  
  /** Reset all data to initial state */
  resetAllData: () => void;
  
  /** Manually trigger data save to localStorage */
  saveData: () => void;
}

/**
 * Graph node data for D3.js visualization
 */
export interface GraphNode {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Node level in hierarchy (0 = root, 1 = category, etc.) */
  level: number;
  
  /** Completion percentage for coloring */
  completion: number;
  
  /** Weight for node sizing */
  weight: number;
  
  /** Whether this is a leaf node */
  isLeaf: boolean;
  
  /** Reference to original OrgNode */
  originalNode: OrgNode;
}

/**
 * Graph link data for D3.js visualization
 */
export interface GraphLink {
  /** Source node ID */
  source: string;
  
  /** Target node ID */
  target: string;
  
  /** Link strength for force simulation */
  strength?: number;
}

/**
 * Complete graph data structure
 */
export interface GraphData {
  /** All nodes in the graph */
  nodes: GraphNode[];
  
  /** All links between nodes */
  links: GraphLink[];
}

/**
 * View state for navigation and UI
 */
export interface ViewState {
  /** Currently active view */
  currentView: 'home' | 'checklist' | 'graph' | 'dashboard';
  
  /** Whether mobile menu is open */
  isMobileMenuOpen: boolean;
  
  /** Currently selected node ID for details */
  selectedNodeId: string | null;
  
  /** Search filter text */
  searchFilter: string;
  
  /** Whether to show completed tasks */
  showCompleted: boolean;
}