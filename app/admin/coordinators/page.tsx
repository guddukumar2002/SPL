'use client'

import { useEffect, useState } from 'react'

interface Coordinator {
  id: string; name: string; email: string; phone?: string
  coordinatorDistrict?: string; createdAt: string
}

const districts = [
  'Agra','Aligarh','Allahabad','Ambedkar Nagar','Amethi','Amroha','Auraiya','Azamgarh',
  'Baghpat','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti',
  'Bhadohi','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah',
  'Etawah','Faizabad','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad',
  'Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur',
  'Jhasi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kheri','Kushinagar',
  'Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur',
  'Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Raebareli','Rampur','Saharanpur',
  'Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar','Sitapur',
  'Sonbhadra','Sultanpur','Unnao','Varanasi'
]

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

export default function AdminCoordinators() {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', district: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCoordinators() }, [])

  const loadCoordinators = async () => {
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/coordinators', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setCoordinators(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const createCoordinator = async () => {
    if (!form.name || !form.email || !form.password || !form.district) return alert('Fill all required fields')
    setSaving(true)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/coordinators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setSaving(false)
    if (data.success) {
      setShowForm(false)
      setForm({ name: '', email: '', phone: '', password: '', district: '' })
      loadCoordinators()
    } else alert(data.error || 'Failed to create coordinator')
  }

  const deleteCoordinator = async (id: string) => {
    if (!confirm('Delete this coordinator?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/coordinators', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    loadCoordinators()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div>
    <h1 className="font-headline font-black text-3xl sm:text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
      District <span className="text-[#ffd700]">Coordinators</span>
    </h1>
    <p className="text-[#c4c6d0]/60 text-xs sm:text-sm mt-1">Manage district-level coordinators</p>
  </div>
  <button onClick={() => setShowForm(!showForm)}
    className="flex items-center gap-1 sm:gap-2 bg-[#ffd700] text-[#002366] px-3 sm:px-5 py-1.5 sm:py-2.5 font-headline font-black uppercase tracking-tight text-xs sm:text-sm hover:brightness-110 transition-all">
    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
    <span className="hidden xs:inline">Add Coordinator</span>
    <span className="xs:hidden">Add Coordinator</span>
  </button>
</div>

      {showForm && (
        <div className="bg-[#131318] border border-[#444650]/20 p-6">
          <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700] mb-5">New Coordinator</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Full Name *</label><input className={inputCls} placeholder="Enter name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className={labelCls}>Email *</label><input type="email" className={inputCls} placeholder="Enter email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="Enter phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className={labelCls}>Password *</label><input type="password" className={inputCls} placeholder="Set password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
            <div className="md:col-span-2">
              <label className={labelCls}>Assigned District *</label>
              <select className={inputCls} value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={createCoordinator} disabled={saving}
              className="bg-[#ffd700] text-[#002366] px-6 py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
              {saving ? 'Creating...' : 'Create Coordinator'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="border border-[#444650]/40 text-[#c4c6d0] px-6 py-2.5 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coordinators.map(coord => (
          <div key={coord.id} className="bg-[#131318] border border-[#444650]/20 p-5 hover:border-[#ffd700]/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '20px' }}>shield_person</span>
              </div>
              <button onClick={() => deleteCoordinator(coord.id)} className="text-[#c4c6d0]/30 hover:text-red-400 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
              </button>
            </div>
            <h3 className="font-headline font-black text-[#e4e1e9] uppercase tracking-tight mb-1">{coord.name}</h3>
            <p className="text-sm text-[#c4c6d0]/60 mb-1">{coord.email}</p>
            {coord.phone && <p className="text-sm text-[#c4c6d0]/60 mb-3">{coord.phone}</p>}
            <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 bg-[#ffd700]/10 px-2 py-0.5">
              {coord.coordinatorDistrict || 'No District'}
            </span>
            <p className="text-xs text-[#c4c6d0]/30 mt-3">Added: {new Date(coord.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        ))}
        {coordinators.length === 0 && (
          <div className="col-span-3 text-center py-12 text-[#c4c6d0]/30 font-headline uppercase tracking-widest text-sm">
            No coordinators added yet
          </div>
        )}
      </div>
    </div>
  )
}
