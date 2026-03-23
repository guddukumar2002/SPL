'use client'

import { useEffect, useState } from 'react'

interface Sponsor {
  id: string; name: string; tier: string; logoUrl?: string; website?: string; active: boolean; createdAt: string
}

const tierStyle: Record<string, string> = {
  TITLE:    'text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10',
  OFFICIAL: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  ASSOCIATE:'text-[#c4c6d0] border-[#444650]/40 bg-[#444650]/10',
}
const tierOrder = ['TITLE', 'OFFICIAL', 'ASSOCIATE']
const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-3 sm:px-4 py-2 sm:py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', tier: 'ASSOCIATE', logoUrl: '', website: '' })
  const [saving, setSaving] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await fetch('/api/admin/sponsors')
    const data = await res.json()
    setSponsors(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const create = async () => {
    if (!form.name) return alert('Sponsor name is required')
    setSaving(true)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/sponsors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    setSaving(false)
    if ((await res.json()).success) { setShowForm(false); setForm({ name: '', tier: 'ASSOCIATE', logoUrl: '', website: '' }); load() }
  }

  const toggle = async (id: string, active: boolean) => {
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/sponsors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, active: !active })
    })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this sponsor?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/sponsors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    load()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-3xl sm:text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
            Sponsor <span className="text-[#ffd700]">Management</span>
          </h1>
          <p className="text-[#c4c6d0]/60 text-xs sm:text-sm mt-1">Manage sponsors shown on the website</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 sm:gap-2 bg-[#ffd700] text-[#002366] px-3 sm:px-5 py-1.5 sm:py-2.5 font-headline font-black uppercase tracking-tight text-xs sm:text-sm hover:brightness-110 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          <span className="hidden xs:inline">Add Sponsor</span>
          <span className="xs:hidden">Add Sponsor</span>
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-[#131318] border border-[#444650]/20 p-4 sm:p-6">
          <h2 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-[#ffd700] mb-4 sm:mb-5">New Sponsor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Sponsor Name *</label><input className={inputCls} placeholder="e.g. Saroj International University" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div>
              <label className={labelCls}>Tier</label>
              <select className={inputCls} value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                <option value="TITLE">Title Sponsor</option>
                <option value="OFFICIAL">Official Partner</option>
                <option value="ASSOCIATE">Associate Sponsor</option>
              </select>
            </div>
            <div><label className={labelCls}>Logo URL (optional)</label><input className={inputCls} placeholder="https://example.com/logo.png" value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} /></div>
            <div><label className={labelCls}>Website (optional)</label><input className={inputCls} placeholder="https://example.com" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button onClick={create} disabled={saving}
              className="bg-[#ffd700] text-[#002366] px-4 sm:px-6 py-2 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50 w-full sm:w-auto">
              {saving ? 'Saving...' : 'Add Sponsor'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="border border-[#444650]/40 text-[#c4c6d0] px-4 sm:px-6 py-2 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all w-full sm:w-auto">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sponsors grouped by tier */}
      {tierOrder.map(tier => {
        const list = sponsors.filter(s => s.tier === tier)
        if (list.length === 0) return null
        return (
          <div key={tier}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[0.55rem] sm:text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${tierStyle[tier]}`}>{tier}</span>
              <span className="text-xs sm:text-sm font-headline font-bold uppercase tracking-tight text-[#c4c6d0]/60">
                {tier === 'TITLE' ? 'Title Sponsors' : tier === 'OFFICIAL' ? 'Official Partners' : 'Associate Sponsors'}
              </span>
            </div>
            <div className="space-y-3">
              {list.map(sponsor => (
                <div key={sponsor.id} className={`bg-[#131318] border border-l-4 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-opacity ${sponsor.active ? 'border-[#444650]/20 border-l-[#ffd700]' : 'border-[#444650]/10 border-l-[#444650]/30 opacity-50'}`}>
                  {/* Left content */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {sponsor.logoUrl ? (
                      <img 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name} 
                        className="h-12 w-24 sm:h-10 sm:w-20 object-contain bg-white/5 border border-[#444650]/20 p-1 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setLightboxImage(sponsor.logoUrl || null)}
                      />
                    ) : (
                      <div className="h-12 w-24 sm:h-10 sm:w-20 bg-[#0b0b0f] border border-[#444650]/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[#444650] text-base sm:text-base">image</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline font-black text-[#e4e1e9] uppercase tracking-tight text-sm sm:text-base break-words">{sponsor.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-[0.55rem] sm:text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 whitespace-nowrap ${tierStyle[sponsor.tier]}`}>{sponsor.tier}</span>
                        <span className={`text-[0.55rem] sm:text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 whitespace-nowrap ${sponsor.active ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-[#c4c6d0]/30 border-[#444650]/20'}`}>
                          {sponsor.active ? 'Visible' : 'Hidden'}
                        </span>
                        {sponsor.website && (
                          <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                            className="text-[0.55rem] sm:text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700]/60 hover:text-[#ffd700] flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>open_in_new</span>
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <button onClick={() => toggle(sponsor.id, sponsor.active)}
                      className={`transition-colors p-1 ${sponsor.active ? 'text-emerald-400 hover:text-emerald-300' : 'text-[#c4c6d0]/30 hover:text-[#ffd700]'}`}
                      title={sponsor.active ? 'Hide' : 'Show'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{sponsor.active ? 'toggle_on' : 'toggle_off'}</span>
                    </button>
                    <button onClick={() => del(sponsor.id)} className="text-[#c4c6d0]/30 hover:text-red-400 transition-colors p-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {sponsors.length === 0 && (
        <div className="text-center py-12 text-[#c4c6d0]/30 font-headline uppercase tracking-widest text-sm">
          No sponsors added yet
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img 
              src={lightboxImage} 
              alt="Sponsor logo" 
              className="max-w-full max-h-full object-contain"
            />
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}