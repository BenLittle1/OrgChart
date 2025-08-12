import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from '../context/DataContext';
import Navigation from '../components/layout/Navigation';
import SummaryPanel from '../components/layout/SummaryPanel';

export const metadata: Metadata = {
  title: "OrgGraph - Organizational Maturity Assessment",
  description: "Visual tool for tracking company operational maturity and business process completion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        <DataProvider>
          <div className="flex h-screen">
            {/* Navigation Sidebar */}
            <div className="w-64 bg-slate-800 border-r border-slate-700">
              <Navigation />
              <SummaryPanel />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
