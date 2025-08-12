import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DataProvider } from '../context/DataContext';
import { MainLayout } from '../components/layout/MainLayout';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OrgGraph - Organizational Maturity Assessment',
  description: 'Visualize and track your organization\'s operational maturity through interactive dashboards, checklists, and network graphs.',
  keywords: ['organizational assessment', 'business maturity', 'process visualization', 'startup tools'],
  authors: [{ name: 'OrgGraph Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ErrorBoundary>
          <DataProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </DataProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}