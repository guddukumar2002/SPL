'use client'

import { useEffect, useState } from 'react'

interface Player {
  id: string; name: string; phone: string; role: string; isIndividual?: boolean
  aadhaarDoc?: string; schoolIdDoc?: string; dobProofDoc?: string; photoDoc?: string
}
interface Team {
  id: string; name: string; district: string; schoolCollege: string
  status: string; registrationId: string; createdAt: string
  coachName?: string; coachPhone?: string; managerName?: string; managerPhone?: string
  contactEmail?: string; contactPhone?: string
  _count: { players: number }
  payments: { status: string; amount: number }[]
  players: Player[]
}

const statusCls: Record<string, string> = {
  APPROVED: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  REJECTED: 'text-red-400 border-red-400/30 bg-red-400/10',
  PENDING: 'text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10',
}

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [viewTeam, setViewTeam] = useState<Team | null>(null)

  useEffect(() => { loadTeams() }, [])

  const loadTeams = async () => {
    try {
      const token = localStorage.getItem('adminToken') || ''
      const data = await fetch('/api/admin/teams', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
      console.log("Team Data: ", data);
      setTeams(data)
    } catch { } finally { setLoading(false) }
  }

  const updateTeamStatus = async (teamId: string, status: string) => {
    const token = localStorage.getItem('adminToken') || ''
    const reason = status === 'REJECTED' ? (prompt('Enter rejection reason (optional):') || '') : ''
    await fetch('/api/admin/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ teamId, status, reason })
    })
    loadTeams()
    if (viewTeam?.id === teamId) setViewTeam(prev => prev ? { ...prev, status } : null)
  }

  const filtered = teams.filter(t => filter === 'ALL' || t.status === filter)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl italic uppercase tracking-tighter text-[#e4e1e9]">Team <span className="text-[#ffd700]">Management</span></h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1">Manage team registrations, documents and approvals</p>
      </div>

      {/* Modal */}
      {viewTeam && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#131318] border border-[#444650]/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#131318] border-b border-[#444650]/20 p-4 sm:p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-[#ffd700] break-words">{viewTeam.name}</h2>
                  <p className="text-xs text-[#c4c6d0]/60 mt-1 break-words">
                    {viewTeam.registrationId} • {viewTeam.district} • {viewTeam.schoolCollege}
                  </p>
                </div>
                <button onClick={() => setViewTeam(null)} className="flex-shrink-0 text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-5">
              {/* Team Details - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-[#0b0b0f] border border-[#444650]/20 p-3 sm:p-4">
                {viewTeam.coachName && (
                  <div className="break-words">
                    <span className="text-[#c4c6d0]/50">Coach:</span>{' '}
                    <span className="text-[#e4e1e9] font-semibold">{viewTeam.coachName}</span>{' '}
                    {viewTeam.coachPhone && <span className="text-[#c4c6d0]/50 text-xs">({viewTeam.coachPhone})</span>}
                  </div>
                )}
                {viewTeam.managerName && (
                  <div className="break-words">
                    <span className="text-[#c4c6d0]/50">Manager:</span>{' '}
                    <span className="text-[#e4e1e9] font-semibold">{viewTeam.managerName}</span>{' '}
                    {viewTeam.managerPhone && <span className="text-[#c4c6d0]/50 text-xs">({viewTeam.managerPhone})</span>}
                  </div>
                )}
                {viewTeam.contactEmail && (
                  <div className="break-words sm:col-span-2">
                    <span className="text-[#c4c6d0]/50">Email:</span>{' '}
                    <span className="text-[#e4e1e9] font-semibold break-all">{viewTeam.contactEmail}</span>
                  </div>
                )}
                <div>
                  <span className="text-[#c4c6d0]/50">Payment:</span>{' '}
                  <span className={`font-semibold ${viewTeam.payments?.[0]?.status === 'COMPLETED' ? 'text-emerald-400' : 'text-[#ffd700]'}`}>
                    {viewTeam.payments?.[0]?.status || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Players Section */}
              <div>
                <h3 className="font-headline font-bold uppercase tracking-tight text-[#c4c6d0] mb-3 text-sm flex flex-wrap items-center gap-2">
                  Players & Documents ({viewTeam.players?.length || 0})
                  {viewTeam.players?.some(p => p.isIndividual) && (
                    <span className="text-[0.6rem] text-violet-400 border border-violet-400/30 px-2 py-0.5 whitespace-nowrap">
                      +{viewTeam.players.filter(p => p.isIndividual).length} assigned
                    </span>
                  )}
                </h3>
                <div className="space-y-3">
                  {viewTeam.players?.map((player, i) => (
                    <div key={player.id} className="border border-[#444650]/20 bg-[#0b0b0f] p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-headline font-bold text-[#e4e1e9] text-sm sm:text-base">
                            {i + 1}. {player.name}
                          </span>
                          {player.phone && (
                            <span className="text-xs text-[#c4c6d0]/50 break-all">{player.phone}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {player.isIndividual && (
                            <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-violet-400 border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 whitespace-nowrap">
                              Individual
                            </span>
                          )}
                          <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 px-2 py-0.5 whitespace-nowrap">
                            {player.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {player.aadhaarDoc ? (
                          <a href={player.aadhaarDoc} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-[#ffd700] border border-[#ffd700]/30 px-2 py-1 hover:bg-[#ffd700]/10 transition-colors whitespace-nowrap">
                            📄 Aadhaar
                          </a>
                        ) : (
                          <span className="text-xs text-red-400 border border-red-400/30 px-2 py-1 whitespace-nowrap">❌ Aadhaar missing</span>
                        )}
                        {player.schoolIdDoc ? (
                          <a href={player.schoolIdDoc} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-[#ffd700] border border-[#ffd700]/30 px-2 py-1 hover:bg-[#ffd700]/10 transition-colors whitespace-nowrap">
                            📄 School ID
                          </a>
                        ) : (
                          <span className="text-xs text-red-400 border border-red-400/30 px-2 py-1 whitespace-nowrap">❌ School ID missing</span>
                        )}
                        {player.dobProofDoc ? (
                          <a href={player.dobProofDoc} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-[#ffd700] border border-[#ffd700]/30 px-2 py-1 hover:bg-[#ffd700]/10 transition-colors whitespace-nowrap">
                            📄 DOB Proof
                          </a>
                        ) : (
                          <span className="text-xs text-red-400 border border-red-400/30 px-2 py-1 whitespace-nowrap">❌ DOB Proof missing</span>
                        )}
                        {player.photoDoc ? (
                          <a href={player.photoDoc} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-[#ffd700] border border-[#ffd700]/30 px-2 py-1 hover:bg-[#ffd700]/10 transition-colors whitespace-nowrap">
                            📄 Photo
                          </a>
                        ) : (
                          <span className="text-xs text-red-400 border border-red-400/30 px-2 py-1 whitespace-nowrap">❌ Photo missing</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!viewTeam.players || viewTeam.players.length === 0) && (
                    <p className="text-sm text-[#c4c6d0]/40">No players found</p>
                  )}
                </div>
              </div>

              {/* Status Actions */}
              {viewTeam.status === 'PENDING' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#444650]/20">
                  <button
                    onClick={() => updateTeamStatus(viewTeam.id, 'APPROVED')}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-headline font-black uppercase tracking-tight py-2.5 flex items-center justify-center gap-2 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span> Approve Team
                  </button>
                  <button
                    onClick={() => updateTeamStatus(viewTeam.id, 'REJECTED')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-headline font-black uppercase tracking-tight py-2.5 flex items-center justify-center gap-2 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span> Reject Team
                  </button>
                </div>
              )}
              {viewTeam.status !== 'PENDING' && (
                <div className={`text-center py-2.5 font-headline font-black uppercase tracking-tight text-sm border ${statusCls[viewTeam.status] || statusCls.PENDING}`}>
                  Team is {viewTeam.status}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-headline font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-[#ffd700] text-[#002366]' : 'border border-[#444650]/40 text-[#c4c6d0] hover:border-[#ffd700] hover:text-[#ffd700]'}`}>
            {s} ({teams.filter(t => s === 'ALL' || t.status === s).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#131318] border border-[#444650]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#0b0b0f] border-b border-[#444650]/20">
              <tr>
                {['Team', 'District', 'Players', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444650]/10">
              {filtered.map(team => (
                <tr key={team.id} className="hover:bg-[#1c1c21] transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-headline font-bold text-[#e4e1e9] text-sm">{team.name}</div>
                    <div className="text-xs text-[#c4c6d0]/50">{team.registrationId}</div>
                    <div className="text-xs text-[#c4c6d0]/50">{team.schoolCollege}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#c4c6d0]">{team.district}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-[#c4c6d0]">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>groups</span>
                      {team._count?.players || 0}
                      {(team.players?.filter(p => p.isIndividual).length || 0) > 0 && (
                        <span className="text-[0.6rem] text-violet-400">+{team.players.filter(p => p.isIndividual).length}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${team.payments?.[0]?.status === 'COMPLETED' ? 'text-emerald-400 border-emerald-400/30' : 'text-[#ffd700] border-[#ffd700]/30'}`}>
                      {team.payments?.[0]?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${statusCls[team.status] || statusCls.PENDING}`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setViewTeam(team)} className="text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors" title="View Documents">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>description</span>
                      </button>
                      {team.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateTeamStatus(team.id, 'APPROVED')} className="text-emerald-400/60 hover:text-emerald-400 transition-colors" title="Approve">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                          </button>
                          <button onClick={() => updateTeamStatus(team.id, 'REJECTED')} className="text-red-400/60 hover:text-red-400 transition-colors" title="Reject">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#c4c6d0]/40 font-headline uppercase tracking-widest text-sm">No teams found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
