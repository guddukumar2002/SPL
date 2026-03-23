'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Player {
  id: string; name: string; fatherName?: string; phone: string; district: string
  schoolCollege: string; role: string; position?: string; experience?: string
  aadhaarDoc?: string; schoolIdDoc?: string; dobProofDoc?: string; photoDoc?: string
}
interface Team { id: string; name: string }

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

export default function CoordinatorPlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [assignTeamId, setAssignTeamId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamSchool, setNewTeamSchool] = useState('')
  const [creatingTeam, setCreatingTeam] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('coordinatorToken')
    const dist = localStorage.getItem('coordinatorDistrict') || ''
    if (!token) { router.push('/coordinator/login'); return }
    setDistrict(dist)
    loadData(dist)
  }, [])

  const loadData = async (dist: string) => {
    const token = localStorage.getItem('coordinatorToken') || ''
    const headers = { Authorization: `Bearer ${token}` }
    const [pRes, tRes] = await Promise.all([
      fetch(`/api/coordinator/players?district=${encodeURIComponent(dist)}`, { headers }),
      fetch(`/api/coordinator/teams?district=${encodeURIComponent(dist)}`, { headers })
    ])
    setPlayers(await pRes.json())
    setTeams(await tRes.json())
    setLoading(false)
  }

  const createTeam = async () => {
    if (!newTeamName.trim() || !newTeamSchool.trim()) return alert('Team name and school are required')
    setCreatingTeam(true)
    const token = localStorage.getItem('coordinatorToken') || ''
    const res = await fetch('/api/coordinator/create-team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newTeamName, schoolCollege: newTeamSchool, district })
    })
    const data = await res.json()
    setCreatingTeam(false)
    if (data.success) {
      setShowCreateTeam(false)
      setNewTeamName('')
      setNewTeamSchool('')
      loadData(district)
    } else alert(data.error || 'Failed to create team')
  }

  const assignPlayer = async () => {
    if (!selectedPlayer || !assignTeamId) return
    setAssigning(true)
    const token = localStorage.getItem('coordinatorToken') || ''
    await fetch('/api/coordinator/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ playerId: selectedPlayer.id, teamId: assignTeamId })
    })
    setAssigning(false)
    setSelectedPlayer(null)
    setAssignTeamId('')
    loadData(district)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="font-headline font-black text-2xl sm:text-3xl italic uppercase tracking-tighter text-[#e4e1e9]">
        Unassigned <span className="text-[#ffd700]">Players</span>
      </h1>
      <p className="text-[#c4c6d0]/60 text-xs sm:text-sm mt-1">
        {district} District — {players.length} players waiting for team assignment
      </p>
    </div>
    <button 
      onClick={() => setShowCreateTeam(true)}
      className="flex items-center gap-1 sm:gap-2 bg-[#ffd700] text-[#002366] px-3 sm:px-4 py-1.5 sm:py-2.5 font-headline font-black uppercase tracking-tight text-xs sm:text-sm hover:brightness-110 transition-all"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>group_add</span>
      <span className="hidden xs:inline">Create New Team</span>
      <span className="xs:hidden">Create New Team</span>
    </button>
  </div>
</div>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#131318] border border-[#444650]/30 max-w-md w-full p-6">
            <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700] mb-5">Create New Team</h2>
            <div className="space-y-4 mb-5">
              <div>
                <label className={labelCls}>Team Name *</label>
                <input className={inputCls} placeholder="e.g. Lucknow Warriors" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>School / College *</label>
                <input className={inputCls} placeholder="School or college name" value={newTeamSchool} onChange={e => setNewTeamSchool(e.target.value)} />
              </div>
              <div className="bg-[#002366]/40 border border-[#ffd700]/20 px-4 py-2.5 text-sm text-[#ffd700] font-headline font-bold">
                District: {district}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={createTeam} disabled={creatingTeam || !newTeamName.trim()}
                className="flex-1 bg-[#ffd700] text-[#002366] py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {creatingTeam ? 'Creating...' : 'Create Team'}
              </button>
              <button onClick={() => { setShowCreateTeam(false); setNewTeamName(''); setNewTeamSchool('') }}
                className="flex-1 border border-[#444650]/40 text-[#c4c6d0] py-2.5 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#131318] border border-[#444650]/30 max-w-md w-full p-6">
            <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700] mb-5">Assign Player to Team</h2>
            <div className="bg-[#0b0b0f] border border-[#444650]/20 p-4 mb-5">
              <p className="font-headline font-bold text-[#e4e1e9]">{selectedPlayer.name}</p>
              <p className="text-xs text-[#c4c6d0]/60 mt-1">{selectedPlayer.role} • {selectedPlayer.schoolCollege}</p>
            </div>
            <div className="mb-5">
              <label className={labelCls}>Select Team</label>
              <select className={inputCls} value={assignTeamId} onChange={e => setAssignTeamId(e.target.value)}>
                <option value="">Choose a team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={assignPlayer} disabled={!assignTeamId || assigning}
                className="flex-1 bg-[#ffd700] text-[#002366] py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
              <button onClick={() => { setSelectedPlayer(null); setAssignTeamId('') }}
                className="flex-1 border border-[#444650]/40 text-[#c4c6d0] py-2.5 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => (
          <div key={player.id} className="bg-[#131318] border border-[#444650]/20 p-5 hover:border-[#ffd700]/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-headline font-bold text-[#e4e1e9]">{player.name}</h3>
                {player.fatherName && <p className="text-xs text-[#c4c6d0]/50 mt-0.5">S/O {player.fatherName}</p>}
              </div>
              <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 px-2 py-0.5">{player.role}</span>
            </div>
            <div className="space-y-1 text-sm text-[#c4c6d0] mb-4">
              <p>📱 {player.phone}</p>
              <p>🏫 {player.schoolCollege}</p>
              {player.position && <p>🏏 {player.position.replace('_', ' ')}</p>}
              {player.experience && <p>⭐ {player.experience}</p>}
            </div>
            <div className="flex gap-3 mb-4">
              {player.aadhaarDoc && <a href={player.aadhaarDoc} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ffd700] hover:underline flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '12px' }}>fact_check</span>Aadhaar</a>}
              {player.schoolIdDoc && <a href={player.schoolIdDoc} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ffd700] hover:underline flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '12px' }}>fact_check</span>School ID</a>}
            </div>
            <button onClick={() => setSelectedPlayer(player)}
              className="w-full bg-[#ffd700] text-[#002366] py-2.5 font-headline font-black uppercase tracking-tight text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person_add</span> Assign to Team
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <div className="col-span-3 text-center py-16 border border-[#444650]/20 bg-[#131318]">
            <span className="material-symbols-outlined text-[#ffd700]/20 block mb-3" style={{ fontSize: '48px' }}>person_search</span>
            <p className="font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/40">No unassigned players in {district} district</p>
          </div>
        )}
      </div>
    </div>
  )
}
