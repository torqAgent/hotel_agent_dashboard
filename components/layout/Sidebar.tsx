'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, BedDouble, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calls', label: 'Rooms', icon: BedDouble },
  { href: '/bookings', label: 'Bookings', icon: BookOpen },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside
      className="w-56 shrink-0 bg-dark-card border-r border-dark-border flex flex-col transition-colors"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="px-5 py-4 border-b border-dark-border flex items-center gap-3">
        <Image src="/logo.jpeg" alt="Torq Agents" width={36} height={36} className="rounded-lg" />
        <div>
          <div className="text-sm font-medium text-white">Torq Agents</div>
          <div className="text-[11px] text-gray-500">Reception AI</div>
        </div>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              path === href
                ? 'bg-gold-bg text-gold-dim'
                : 'text-gray-400 hover:text-white hover:bg-dark-surface'
            )}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-dark-border">
        <div className="text-[11px] text-gray-600">Neon DB · Connected</div>
        <div className="text-[11px] text-gray-500">Growth · Concierge plan</div>
      </div>
    </aside>
  )
}
