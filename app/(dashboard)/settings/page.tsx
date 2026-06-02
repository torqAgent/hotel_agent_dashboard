'use client'
import { useState, useEffect } from 'react'
import { Card, CardTitle } from '@/components/ui/Card'
import { Save, Loader2, AlertCircle } from 'lucide-react'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card>
    <CardTitle>{title}</CardTitle>
    {children}
  </Card>
)

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  type?: string
  placeholder?: string
}) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-dim focus:ring-1 focus:ring-gold-dim transition-colors"
    />
  </div>
)

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [settings, setSettings] = useState({
    hotelName: 'The Grand Heritage, Mysuru',
    agentName: 'Aria',
    greeting: 'Thank you for calling The Grand Heritage. How may I assist you?',
    tone: 'Formal',
    sipTrunk: '+91 821 000 0000',
    livekitRoom: 'hotel-reception',
    managerSip: 'sip:manager@yourdomain.com',
    pmsProvider: 'Google Calendar',
    deluxPrice: '5000',
    standardPrice: '2500',
  })

  useEffect(() => {
    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(prev => ({ ...prev, ...data }))
        } else {
          setError('Failed to load settings')
        }
      } catch (e) {
        console.error('Failed to fetch settings:', e)
        setError('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Failed to save settings')
      }
    } catch (e) {
      console.error('Error saving settings:', e)
      setError('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
        <p className="text-sm text-text-secondary mt-1">Configure hotel details and pricing. Changes are saved to the database.</p>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-lg p-3 flex items-center gap-2 text-sm text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <Section title="Hotel Profile">
        <Field
          label="Hotel name"
          value={settings.hotelName}
          onChange={(val) => setSettings({ ...settings, hotelName: val })}
        />
        <Field
          label="Agent name (spoken)"
          value={settings.agentName}
          onChange={(val) => setSettings({ ...settings, agentName: val })}
        />
        <Field
          label="Greeting script"
          value={settings.greeting}
          onChange={(val) => setSettings({ ...settings, greeting: val })}
        />
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Tone preference</label>
          <select
            value={settings.tone}
            onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-dim focus:ring-1 focus:ring-gold-dim transition-colors"
          >
            <option>Formal</option>
            <option>Friendly</option>
            <option>Luxury</option>
          </select>
        </div>
      </Section>

      <Section title="Room Pricing">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-3 mb-4 text-xs text-gray-400">
          📍 Set your room rates per night. These prices persist in the database and are used for all booking calculations.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Deluxe Room (₹/night)</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">₹</span>
              <input
                type="number"
                value={settings.deluxPrice}
                onChange={(e) => setSettings({ ...settings, deluxPrice: e.target.value })}
                className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-dim focus:ring-1 focus:ring-gold-dim transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Standard Room (₹/night)</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">₹</span>
              <input
                type="number"
                value={settings.standardPrice}
                onChange={(e) => setSettings({ ...settings, standardPrice: e.target.value })}
                className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-dim focus:ring-1 focus:ring-gold-dim transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-emerald-300">
          ✓ Prices are saved automatically and used for all future bookings
        </div>
      </Section>

      <Section title="Telephony & SIP">
        <Field
          label="SIP trunk / DID number"
          value={settings.sipTrunk}
          onChange={(val) => setSettings({ ...settings, sipTrunk: val })}
          placeholder="+91 821 000 0000"
        />
        <Field
          label="LiveKit room name"
          value={settings.livekitRoom}
          onChange={(val) => setSettings({ ...settings, livekitRoom: val })}
          placeholder="hotel-reception"
        />
        <Field
          label="Manager escalation SIP"
          value={settings.managerSip}
          onChange={(val) => setSettings({ ...settings, managerSip: val })}
          placeholder="sip:manager@yourdomain.com"
        />
      </Section>

      <Section title="PMS Integration">
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">PMS provider</label>
          <select
            value={settings.pmsProvider}
            onChange={(e) => setSettings({ ...settings, pmsProvider: e.target.value })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-dim focus:ring-1 focus:ring-gold-dim transition-colors"
          >
            <option>Google Calendar</option>
            <option>Opera</option>
            <option>Cloudbeds</option>
          </select>
        </div>
        <Field
          label="API key / credentials"
          value="••••••••••••••••"
          onChange={() => {}}
          type="password"
        />
      </Section>

      <div className="flex justify-end gap-3 pb-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm text-gray-400 border border-dark-border rounded-lg hover:text-white hover:bg-dark-surface transition-colors"
          disabled={saving}
        >
          Discard
        </button>
        <button
          onClick={save}
          disabled={saving}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-gold text-black hover:bg-gold-dim disabled:opacity-60'
          }`}
          aria-label={saving ? 'Saving settings' : saved ? 'Settings saved' : 'Save settings'}
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Save size={14} />
              Saved!
            </>
          ) : (
            <>
              <Save size={14} />
              Save changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}
