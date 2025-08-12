export interface OrgNode {
  id: string;
  name: string;
  isComplete: boolean;
  children: OrgNode[];
}

export interface ProgressStats {
  completed: number;
  total: number;
  percentage: number;
}

export interface CategoryProgress {
  id: string;
  name: string;
  progress: ProgressStats;
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  isComplete: boolean;
  children: OrgNode[];
  weight: number;
  completionPercentage: number;
  level: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export interface DataContextType {
  data: OrgNode;
  updateNode: (nodeId: string, isComplete: boolean) => void;
  getProgress: (nodeId?: string) => ProgressStats;
  getCategoryProgress: () => CategoryProgress[];
  resetAllData: () => void;
}

export interface ViewMode {
  GRAPH: 'graph';
  CHECKLIST: 'checklist';
  DASHBOARD: 'dashboard';
}

export type ViewType = 'graph' | 'checklist' | 'dashboard';