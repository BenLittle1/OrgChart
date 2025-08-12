'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { OrgNode, DataContextState, NodeProgress, CategoryProgress, OrganizationProgress } from '../types';
import { organizationalData } from '../data/organizationalData';
import {
  updateNodeCompletion,
  calculateProgress,
  calculateOrganizationProgress,
  getCategoryProgress,
  findNodeById,
  cloneOrgNode,
  validateOrgNode,
} from '../lib/utils';

const STORAGE_KEY = 'orgraph-data';

/**
 * React Context for global organizational data state management
 */
const DataContext = createContext<DataContextState | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages organizational data state and localStorage persistence
 */
export function DataProvider({ children }: DataProviderProps) {
  const [orgData, setOrgData] = useState<OrgNode>(organizationalData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState<OrganizationProgress>(
    calculateOrganizationProgress(organizationalData)
  );

  /**
   * Load data from localStorage on component mount
   */
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData) as OrgNode;
        
        // Validate the loaded data structure
        const validationErrors = validateOrgNode(parsedData);
        
        if (validationErrors.length === 0) {
          setOrgData(parsedData);
          setProgress(calculateOrganizationProgress(parsedData));
        } else {
          console.warn('Invalid data structure in localStorage, using default:', validationErrors);
          // Keep default data
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Keep default data
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Save data to localStorage whenever orgData changes
   */
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orgData));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [orgData, isLoaded]);

  /**
   * Update progress whenever orgData changes
   */
  useEffect(() => {
    if (isLoaded) {
      setProgress(calculateOrganizationProgress(orgData));
    }
  }, [orgData, isLoaded]);

  /**
   * Update a node's completion status with cascading logic
   */
  const updateNode = useCallback((nodeId: string, isComplete: boolean) => {
    setOrgData(currentData => {
      try {
        const updatedData = updateNodeCompletion(currentData, nodeId, isComplete);
        return updatedData;
      } catch (error) {
        console.error('Error updating node:', error);
        return currentData; // Return unchanged data on error
      }
    });
  }, []);

  /**
   * Get progress information for a specific node
   */
  const getNodeProgress = useCallback((nodeId: string): NodeProgress | null => {
    try {
      const node = findNodeById(orgData, nodeId);
      
      if (!node) {
        return null;
      }
      
      return calculateProgress(node);
    } catch (error) {
      console.error('Error calculating node progress:', error);
      return null;
    }
  }, [orgData]);

  /**
   * Get progress for all main categories
   */
  const getCategoryProgressData = useCallback((): CategoryProgress[] => {
    try {
      return getCategoryProgress(orgData);
    } catch (error) {
      console.error('Error calculating category progress:', error);
      return [];
    }
  }, [orgData]);

  /**
   * Reset all data to initial state
   */
  const resetAllData = useCallback(() => {
    try {
      const freshData = cloneOrgNode(organizationalData);
      setOrgData(freshData);
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  }, []);

  /**
   * Manually save data to localStorage
   */
  const saveData = useCallback(() => {
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orgData));
    } catch (error) {
      console.error('Error manually saving data:', error);
    }
  }, [orgData, isLoaded]);

  const contextValue: DataContextState = {
    orgData,
    isLoaded,
    progress,
    updateNode,
    getNodeProgress,
    getCategoryProgress: getCategoryProgressData,
    resetAllData,
    saveData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook to access the data context
 * Throws an error if used outside of DataProvider
 */
export function useData(): DataContextState {
  const context = useContext(DataContext);
  
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  
  return context;
}

/**
 * Hook to access organizational data specifically
 */
export function useOrgData() {
  const { orgData } = useData();
  return orgData;
}

/**
 * Hook to access progress data specifically
 */
export function useProgress() {
  const { progress } = useData();
  return progress;
}

/**
 * Hook to check if data is loaded (useful for preventing hydration mismatches)
 */
export function useIsLoaded() {
  const { isLoaded } = useData();
  return isLoaded;
}

/**
 * Hook for node operations
 */
export function useNodeOperations() {
  const { updateNode, getNodeProgress, resetAllData, saveData } = useData();
  
  return {
    updateNode,
    getNodeProgress,
    resetAllData,
    saveData,
  };
}