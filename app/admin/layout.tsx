"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    
    // If on login page, we don't need to force redirect away if not authenticated,
    // but if authenticated, redirect to /admin
    if (pathname === '/admin/login') {
      if (authStatus === 'true') {
        router.push('/admin');
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
      return;
    }

    // Protect all other /admin routes
    if (authStatus !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return <div className="h-screen bg-slate-100 dark:bg-[#0a0a0a] flex items-center justify-center">Loading...</div>;
  }

  // If we are on the login page, we shouldn't show the Sidebar and Topbar!
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
