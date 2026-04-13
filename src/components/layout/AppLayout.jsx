import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Analytics } from "@vercel/analytics/react"

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet context={{ onMenuClick: () => setSidebarOpen(true) }} />
        </div>
      </main>
<Analytics />
    </div>
  );
}
