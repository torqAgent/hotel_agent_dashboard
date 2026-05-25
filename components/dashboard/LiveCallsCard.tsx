'use client'
import { useLiveKitStats } from '@/hooks/useLiveKitStats'
import { Phone, PhoneOff, Clock, Users } from 'lucide-react'

function formatDur(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

export function LiveCallsCard() {
  const { stats, connected } = useLiveKitStats()

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Live calls</span>
        <span className={`flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${
          connected ? 'bg-emerald-950 text-emerald-400' : 'bg-dark-surface text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
          {connected ? 'streaming' : 'offline'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-dark-surface rounded-lg p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Active now</div>
          <div className={`text-2xl font-medium ${(stats?.activeCalls ?? 0) > 0 ? 'text-blue-400' : 'text-white'}`}>
            {stats?.activeCalls ?? '—'}
          </div>
        </div>
        <div className="bg-dark-surface rounded-lg p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Participants</div>
          <div className="text-2xl font-medium text-white">{stats?.totalParticipants ?? '—'}</div>
        </div>
        <div className="bg-dark-surface rounded-lg p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Rooms open</div>
          <div className="text-2xl font-medium text-gold-dim">{stats?.totalRoomsActive ?? '—'}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {stats?.rooms && stats.rooms.length > 0 ? (
          stats.rooms.map(room => (
            <div key={room.name} className="flex items-center gap-3 bg-dark-surface rounded-lg px-3 py-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                room.participants > 0 ? 'bg-blue-950 text-blue-400' : 'bg-dark-border text-gray-600'
              }`}>
                {room.participants > 0 ? <Phone size={13} /> : <PhoneOff size={13} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{room.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1"><Users size={10} />{room.participants} participant{room.participants !== 1 ? 's' : ''}</span>
                  {room.durationSec > 0 && (
                    <span className="flex items-center gap-1"><Clock size={10} />{formatDur(room.durationSec)}</span>
                  )}
                </div>
                {room.participantNames.length > 0 && (
                  <div className="text-[10px] text-gray-600 truncate mt-0.5">
                    {room.participantNames.join(', ')}
                  </div>
                )}
              </div>
              {room.participants > 0 && (
                <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full shrink-0">Live</span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-600 text-sm">
            {connected ? 'No active calls right now' : 'Connecting to LiveKit…'}
          </div>
        )}
      </div>

      {stats && (
        <div className="mt-3 text-[10px] text-gray-700 text-right">
          Updated {new Date(stats.fetchedAt).toLocaleTimeString('en-IN')}
        </div>
      )}
    </div>
  )
}
