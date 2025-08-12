'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { OrgNode, DataContextType } from '@/types';
import { initialData } from '@/lib/data';
import { 
  updateNodeCompletion, 
  calculateProgress, 
  calculateCategoryProgress 
} from '@/lib/utils';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OrgNode>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('orggraph-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData(parsed);
      }
    } catch (error) {
      console.error('Failed to parse saved data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('orggraph-data', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const updateNode = useCallback((nodeId: string, isComplete: boolean) => {
    setData(currentData => updateNodeCompletion(currentData, nodeId, isComplete));
  }, []);

  const getProgress = useCallback((nodeId?: string) => {
    if (!nodeId || nodeId === 'root') {
      return calculateProgress(data);
    }
    
    const findNodeById = (node: OrgNode, id: string): OrgNode | null => {
      if (node.id === id) return node;
      
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
      
      return null;
    };
    
    const targetNode = findNodeById(data, nodeId);
    return targetNode ? calculateProgress(targetNode) : { completed: 0, total: 0, percentage: 0 };
  }, [data]);

  const getCategoryProgress = useCallback(() => {
    return calculateCategoryProgress(data);
  }, [data]);

  const resetAllData = useCallback(() => {
    setData(initialData);
    localStorage.removeItem('orggraph-data');
  }, []);

  const value: DataContextType = {
    data,
    updateNode,
    getProgress,
    getCategoryProgress,
    resetAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}