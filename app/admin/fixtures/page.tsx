'use client'

import { useEffect, useState } from 'react'

interface Team { id: string; name: string; district: string }
interface Match {
  id: string; phase: string; venue: string; date: string
  result?: string; winner?: string; score1?: string; score2?: string
  team1: Team; team2?: Team
}

const phases = ['DISTRICT', 'ZONAL', 'SEMI_FINAL', 'FINAL']
const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-3 sm:px-4 py-2 sm:py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

export default function AdminFixtures() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResult, setEditingResult] = useState<string | null>(null)
  const [form, setForm] = useState({ team1Id: '', team2Id: '', venue: '', date: '', phase: 'DISTRICT', notify: false })
  const [resultForm, setResultForm] = useState({ score1: '', score2: '', winner: '', result: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const token = localStorage.getItem('adminToken') || ''
    const headers = { Authorization: `Bearer ${token}` }
    const [matchRes, teamRes] = await Promise.all([
      fetch('/api/admin/fixtures', { headers }),
      fetch('/api/admin/teams', { headers })
    ])
    setMatches(await matchRes.json())
    setTeams(await teamRes.json())
    setLoading(false)
  }

  const createFixture = async () => {
    if (!form.team1Id || !form.venue || !form.date) return alert('Fill all required fields')
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/fixtures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    if ((await res.json()).success) { setShowForm(false); setForm({ team1Id: '', team2Id: '', venue: '', date: '', phase: 'DISTRICT', notify: false }); loadData() }
  }

  const updateResult = async (matchId: string) => {
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/fixtures', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ matchId, ...resultForm })
    })
    setEditingResult(null)
    loadData()
  }

  const deleteFixture = async (matchId: string) => {
    if (!confirm('Delete this fixture?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/fixtures', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ matchId })
    })
    loadData()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl italic uppercase tracking-tighter text-[#e4e1e9]">
            Fixture <span className="text-[#ffd700]">Management</span>
          </h1>
          <p className="text-[#c4c6d0]/60 text-xs sm:text-sm mt-1">Create and manage match fixtures</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 sm:gap-2 bg-[#ffd700] text-[#002366] px-3 sm:px-5 py-1.5 sm:py-2.5 font-headline font-black uppercase tracking-tight text-xs sm:text-sm hover:brightness-110 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          <span className="hidden xs:inline">Create Fixture</span>
          <span className="xs:hidden"> Create Fixture</span>
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-[#131318] border border-[#444650]/20 p-4 sm:p-6 mb-8">
          <h2 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-[#ffd700] mb-4 sm:mb-5">New Fixture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Team 1 *</label>
              <select className={inputCls} value={form.team1Id} onChange={e => setForm({ ...form, team1Id: e.target.value })}>
                <option value="">Select Team 1</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.district})</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Team 2</label>
              <select className={inputCls} value={form.team2Id} onChange={e => setForm({ ...form, team2Id: e.target.value })}>
                <option value="">Select Team 2 (optional)</option>
                {teams.filter(t => t.id !== form.team1Id).map(t => <option key={t.id} value={t.id}>{t.name} ({t.district})</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Venue *</label>
              <input className={inputCls} placeholder="Enter venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Date & Time *</label>
              <input type="datetime-local" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Phase</label>
              <select className={inputCls} value={form.phase} onChange={e => setForm({ ...form, phase: e.target.value })}>
                {phases.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-6">
              <input type="checkbox" id="notify" checked={form.notify} onChange={e => setForm({ ...form, notify: e.target.checked })} className="accent-[#ffd700]" />
              <label htmlFor="notify" className="text-xs sm:text-sm text-[#c4c6d0]">Send email notification to teams</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={createFixture} className="bg-[#ffd700] text-[#002366] px-4 sm:px-6 py-2 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all">
              Create Fixture
            </button>
            <button onClick={() => setShowForm(false)} className="border border-[#444650]/40 text-[#c4c6d0] px-4 sm:px-6 py-2 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#131318] border border-[#444650]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#0b0b0f] border-b border-[#444650]/20">
              <tr>
                {['Match', 'Phase', 'Venue', 'Date', 'Result', 'Actions'].map(h => (
                  <th key={h} className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[0.55rem] sm:text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444650]/10">
              {matches.map(match => (
                <tr key={match.id} className="hover:bg-[#1c1c21] transition-colors">
                  <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-[#e4e1e9]">{match.team1.name}</span>
                      <span className="text-xs text-[#c4c6d0]/60">vs {match.team2?.name || 'TBD'}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <span className="text-[0.55rem] sm:text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 px-2 py-0.5 whitespace-nowrap">
                      {match.phase.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-[#c4c6d0] whitespace-nowrap">
                    {match.venue}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-[#c4c6d0] whitespace-nowrap">
                    {new Date(match.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    {editingResult === match.id ? (
                      <div className="space-y-2 min-w-[200px]">
                        <input className={inputCls + ' py-1.5 text-xs'} placeholder="Score 1" value={resultForm.score1} onChange={e => setResultForm({ ...resultForm, score1: e.target.value })} />
                        <input className={inputCls + ' py-1.5 text-xs'} placeholder="Score 2" value={resultForm.score2} onChange={e => setResultForm({ ...resultForm, score2: e.target.value })} />
                        <input className={inputCls + ' py-1.5 text-xs'} placeholder="Winner" value={resultForm.winner} onChange={e => setResultForm({ ...resultForm, winner: e.target.value })} />
                        <input className={inputCls + ' py-1.5 text-xs'} placeholder="Result summary" value={resultForm.result} onChange={e => setResultForm({ ...resultForm, result: e.target.value })} />
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => updateResult(match.id)} className="text-emerald-400 hover:text-emerald-300 transition-colors p-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span>
                          </button>
                          <button onClick={() => setEditingResult(null)} className="text-red-400 hover:text-red-300 transition-colors p-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm">
                        {match.result
                          ? <span className="text-emerald-400 font-headline font-bold break-words max-w-[180px]">{match.result}</span>
                          : <span className="text-[#c4c6d0]/30 text-[0.6rem] sm:text-xs font-headline uppercase whitespace-nowrap">No result yet</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button onClick={() => { setEditingResult(match.id); setResultForm({ score1: match.score1 || '', score2: match.score2 || '', winner: match.winner || '', result: match.result || '' }) }}
                        className="text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>
                      <button onClick={() => deleteFixture(match.id)} className="text-[#c4c6d0]/40 hover:text-red-400 transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr><td colSpan={6} className="px-3 sm:px-4 py-12 text-center text-[#c4c6d0]/40 font-headline uppercase tracking-widest text-xs sm:text-sm">No fixtures created yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}