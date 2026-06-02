'use client'
import Image from 'next/image'
import { useLiveKitStats } from '@/hooks/useLiveKitStats'
import { useTheme } from '@/app/providers'
import { Phone, Moon, Sun } from 'lucide-react'

export function Topbar({ title }: { title: string }) {
  const { stats, connected } = useLiveKitStats()
  const { theme, toggleTheme } = useTheme()

  const activeCalls = stats?.activeCalls ?? 0

  return (
    <header className="h-14 border-b border-dark-border flex items-center justify-between px-6 bg-dark-card transition-colors">
      <div className="flex items-center gap-3">
        <Image src="/logo.jpeg" alt="Torq Agents" width={28} height={28} className="rounded-md opacity-80" />
        <h1 className="text-sm font-medium text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">

        {activeCalls > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950 px-3 py-1 rounded-full">
            <Phone size={11} />
            {activeCalls} call{activeCalls > 1 ? 's' : ''} live
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-0.5" />
          </span>
        )}

        <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full transition-colors ${
          connected ? 'bg-emerald-950 text-emerald-400' : 'bg-dark-surface text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
          {connected ? 'LiveKit live' : 'Connecting…'}
        </span>

        <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Neon DB
        </span>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-dark-surface transition-colors text-gray-400 hover:text-white"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

      </div>
    </header>
  )
}

