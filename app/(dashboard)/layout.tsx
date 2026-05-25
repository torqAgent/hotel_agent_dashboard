import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/calls': 'Call Log',
  '/bookings': 'Bookings',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Hotel AI Reception" />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
