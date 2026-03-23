'use client'

import { useEffect, useState } from 'react'

interface Team { id: string; name: string; district: string; contactEmail?: string; status: string }

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

export default function AdminNotifications() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [form, setForm] = useState({ target: 'ALL_TEAMS', district: '', subject: '', message: '' })

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || ''
    fetch('/api/admin/teams', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setTeams(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const districts = Array.from(new Set(teams.map(t => t.district))).sort()

  const getTargets = () => {
    if (form.target === 'ALL_TEAMS') return teams.filter(t => t.contactEmail)
    if (form.target === 'APPROVED') return teams.filter(t => t.status === 'APPROVED' && t.contactEmail)
    if (form.target === 'PENDING') return teams.filter(t => t.status === 'PENDING' && t.contactEmail)
    if (form.target === 'DISTRICT') return teams.filter(t => t.district === form.district && t.contactEmail)
    return []
  }

  const send = async () => {
    if (!form.subject || !form.message) return alert('Subject and message are required')
    const targets = getTargets()
    if (targets.length === 0) return alert('No teams with email found for selected target')
    if (!confirm(`Send email to ${targets.length} team(s)?`)) return
    setSending(true); setResult(null)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ subject: form.subject, message: form.message, teamIds: targets.map(t => t.id) })
    })
    const data = await res.json()
    setSending(false)
    if (data.success) { setResult({ sent: data.sent, failed: data.failed }); setForm(f => ({ ...f, subject: '', message: '' })) }
    else alert(data.error || 'Failed to send')
  }

  const targetCount = getTargets().length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
          Notification <span className="text-[#ffd700]">Management</span>
        </h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1">Send email notifications to teams</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: 'emoji_events', color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/10', border: 'border-[#ffd700]/20', value: teams.length, label: 'Total Teams' },
          { icon: 'mail', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', value: teams.filter(t => t.contactEmail).length, label: 'Teams with Email' },
          { icon: 'send', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', value: targetCount, label: 'Selected Recipients' },
        ].map(s => (
          <div key={s.label} className="bg-[#131318] border border-[#444650]/20 p-3 sm:p-5 text-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${s.bg} border ${s.border} flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
              <span className={`material-symbols-outlined ${s.color} text-base sm:text-xl`} style={{ fontSize: '1rem' }}>{s.icon}</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-headline font-black ${s.color}`}>{s.value}</p>
            <p className="text-[0.6rem] sm:text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {result && (
        <div className="bg-emerald-400/10 border border-emerald-400/30 p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: '20px' }}>check_circle</span>
          <p className="text-emerald-400 font-headline font-bold uppercase tracking-tight text-sm">
            Sent: {result.sent} &nbsp;|&nbsp; Failed: {result.failed}
          </p>
        </div>
      )}

      {/* Compose */}
      <div className="bg-[#131318] border border-[#444650]/20 p-6 space-y-5">
        <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Compose Notification</h2>

        <div>
          <label className={labelCls}>Send To *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'ALL_TEAMS', label: 'All Teams' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'DISTRICT', label: 'By District' },
            ].map(opt => (
              <button key={opt.value} type="button" onClick={() => setForm(f => ({ ...f, target: opt.value }))}
                className={`py-2.5 text-xs font-headline font-bold uppercase tracking-widest border-2 transition-colors ${form.target === opt.value ? 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]' : 'border-[#444650]/30 text-[#c4c6d0]/60 hover:border-[#ffd700]/40'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {form.target === 'DISTRICT' && (
          <div>
            <label className={labelCls}>Select District *</label>
            <select className={inputCls} value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}>
              <option value="">Choose district</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        <div className="bg-[#002366]/40 border border-[#ffd700]/20 px-4 py-2.5 text-sm text-[#ffd700] font-headline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
          This will send email to <strong>{targetCount}</strong> team(s)
        </div>

        <div><label className={labelCls}>Subject *</label><input className={inputCls} placeholder="e.g. Match Schedule Update — SPL U19" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
        <div><label className={labelCls}>Message *</label><textarea className={inputCls} rows={6} placeholder="Write your message here..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} /></div>

        <button onClick={send} disabled={sending || targetCount === 0}
          className="flex items-center gap-2 bg-[#ffd700] text-[#002366] px-6 py-3 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
          {sending ? 'Sending...' : `Send to ${targetCount} Team(s)`}
        </button>
      </div>

      {/* Recipients Preview */}
      <div className="bg-[#131318] border border-[#444650]/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#444650]/20">
          <h3 className="font-headline font-bold uppercase tracking-tight text-[#e4e1e9] text-sm">Recipients Preview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#0b0b0f]">
              <tr>
                {['Team', 'District', 'Email', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444650]/10">
              {getTargets().slice(0, 10).map(team => (
                <tr key={team.id} className="hover:bg-[#1c1c21] transition-colors">
                  <td className="px-4 py-3 font-headline font-bold text-[#e4e1e9] text-sm">{team.name}</td>
                  <td className="px-4 py-3 text-sm text-[#c4c6d0]/60">{team.district}</td>
                  <td className="px-4 py-3 text-sm text-[#c4c6d0]/60">{team.contactEmail || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${team.status === 'APPROVED' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : team.status === 'REJECTED' ? 'text-red-400 border-red-400/30 bg-red-400/10' : 'text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10'}`}>
                      {team.status}
                    </span>
                  </td>
                </tr>
              ))}
              {getTargets().length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[#c4c6d0]/30 font-headline uppercase tracking-widest text-sm">No recipients selected</td></tr>
              )}
            </tbody>
          </table>
          {getTargets().length > 10 && <p className="text-xs text-[#c4c6d0]/30 px-4 py-2">...and {getTargets().length - 10} more</p>}
        </div>
      </div>
    </div>
  )
}
