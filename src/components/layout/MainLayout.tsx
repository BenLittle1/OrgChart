'use client';

import React, { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { useIsLoaded } from '../../context/DataContext';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        <span className="text-slate-600">Loading organizational data...</span>
      </div>
    </div>
  );
}

/**
 * Main layout component that provides navigation and error boundaries
 */
export function MainLayout({ children }: MainLayoutProps) {
  const isLoaded = useIsLoaded();

  // Show loading state during hydration to prevent mismatches
  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <ErrorBoundary>
        <Navigation />
      </ErrorBoundary>

      {/* Main content */}
      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Optional footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} OrgGraph. Built for organizational excellence.</p>
            </div>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Reset Data
              </button>
              <a 
                href="#" 
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}