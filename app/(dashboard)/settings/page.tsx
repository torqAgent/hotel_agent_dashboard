'use client'
import { useState } from 'react'
import { Card, CardTitle } from '@/components/ui/Card'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card>
    <CardTitle>{title}</CardTitle>
    {children}
  </Card>
)

const Field = ({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) => (
  <div className="mb-4">
    <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
    <input type={type} defaultValue={defaultValue}
      className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-dim transition-colors" />
  </div>
)

const Toggle = ({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn ?? false)
  return (
    <div className="flex items-start justify-between py-3 border-b border-dark-border last:border-0">
      <div>
        <div className="text-sm text-white">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <button onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors mt-0.5 relative shrink-0 ${on ? 'bg-gold' : 'bg-dark-surface border border-dark-border'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="mb-1">
        <h2 className="text-base font-medium text-white">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure your AI receptionist</p>
      </div>

      <Section title="Hotel profile">
        <Field label="Hotel name" defaultValue="The Grand Heritage, Mysuru" />
        <Field label="Agent name (spoken)" defaultValue="Aria" />
        <Field label="Greeting script" defaultValue="Thank you for calling The Grand Heritage. How may I assist you?" />
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1.5">Tone preference</label>
          <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-dim">
            <option>Formal</option>
            <option>Friendly</option>
            <option>Luxury</option>
          </select>
        </div>
      </Section>

      <Section title="Telephony & SIP">
        <Field label="SIP trunk / DID number" defaultValue="+91 821 000 0000" />
        <Field label="LiveKit room name" defaultValue="hotel-reception" />
        <Field label="Manager escalation SIP" defaultValue="sip:manager@yourdomain.com" />
      </Section>

      <Section title="PMS integration">
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1.5">PMS provider</label>
          <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-dim">
            <option>Google Calendar</option>
            <option>Opera</option>
            <option>Cloudbeds</option>
          </select>
        </div>
        <Field label="API key / credentials" defaultValue="••••••••••••••••" type="password" />
      </Section>

      <Section title="Agent behaviour">
        <Toggle label="Hindi + English" desc="Agent responds in whichever language the guest uses" defaultOn />
        <Toggle label="Noise cancellation (BVC)" desc="Filter lobby noise before speech recognition" defaultOn />
        <Toggle label="Payment collection" desc="Collect card details securely over the call" defaultOn />
        <Toggle label="Auto-escalation" desc="Transfer to manager when agent confidence is low" defaultOn />
        <Toggle label="After-hours mode" desc="Change greeting message outside business hours" />
      </Section>

      <Section title="Knowledge base">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-3 text-xs text-gray-400 mb-3">
          The agent answers from this knowledge base. Keep it updated for best accuracy.
        </div>
        <textarea rows={8} defaultValue={`Check-in: 2 PM\nCheck-out: 11 AM\nPets: Not allowed\nAirport transfer: Available, ₹800\nPool: Open 7 AM–9 PM\nRestaurant: Suvarna, 7 AM–11 PM\nRoom types: Standard (₹2000), Deluxe (₹3000), Garden Suite (₹8500)\nCancellation: Free until 24h before check-in\nWiFi: Free in all rooms`}
          className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-dim font-mono resize-none" />
      </Section>

      <div className="flex justify-end gap-3 pb-4">
        <button className="px-4 py-2 text-sm text-gray-400 border border-dark-border rounded-lg hover:text-white transition-colors">
          Cancel
        </button>
        <button onClick={save}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${saved ? 'bg-emerald-700 text-white' : 'bg-gold text-black hover:bg-gold-dim'}`}>
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
