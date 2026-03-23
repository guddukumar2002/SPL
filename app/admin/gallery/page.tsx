'use client'

import { useEffect, useState } from 'react'

interface GalleryItem {
  id: string; title: string; url: string; category: string; type: string; active: boolean; createdAt: string
}

const CATEGORIES = ['General', 'Events', 'Matches', 'Training', 'Registration']

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', url: '', category: 'General', type: 'photo' })
  const [filter, setFilter] = useState('ALL')

  const token = () => localStorage.getItem('adminToken') || ''

  const load = async () => {
    const data = await fetch('/api/admin/gallery', { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json())
    if (Array.isArray(data)) setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) setForm(prev => ({ ...prev, url: data.url }))
      else alert('Upload failed')
    } catch { alert('Upload failed') }
    finally { setUploading(false) }
  }

  const handleAdd = async () => {
    if (!form.title || !form.url) return alert('Title and image/URL are required')
    await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form)
    })
    setForm({ title: '', url: '', category: 'General', type: 'photo' })
    setShowForm(false); load()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch('/api/admin/gallery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ id, active: !active })
    })
    load()
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    await fetch('/api/admin/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ id })
    })
    load()
  }

  const filtered = filter === 'ALL' ? items : items.filter(i => i.category === filter)
  const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
  const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

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
      Gallery <span className="text-[#ffd700]">Management</span>
    </h1>
    <p className="text-[#c4c6d0]/60 text-xs sm:text-sm mt-1">Upload and manage tournament photos & videos</p>
  </div>
  <button onClick={() => setShowForm(true)}
    className="flex items-center gap-1 sm:gap-2 bg-[#ffd700] text-[#002366] px-3 sm:px-5 py-1.5 sm:py-2.5 font-headline font-black uppercase tracking-tight text-xs sm:text-sm hover:brightness-110 transition-all">
    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_photo_alternate</span>
    <span className="hidden xs:inline">Add Media</span>
    <span className="xs:hidden">Add Media</span>
  </button>
</div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#131318] border border-[#444650]/30 max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Add Gallery Item</h2>
              <button onClick={() => { setShowForm(false); setForm({ title: '', url: '', category: 'General', type: 'photo' }) }}
                className="text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Title *</label><input className={inputCls} placeholder="e.g. District Match Day 1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Upload Image / Enter URL *</label>
                <div className="border-2 border-dashed border-[#444650]/40 p-6 text-center mb-2 hover:border-[#ffd700]/40 transition-colors">
                  <input type="file" accept="image/*,video/*" id="gallery-upload" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                  <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-[#c4c6d0]/30" style={{ fontSize: '32px' }}>upload_file</span>
                    <p className="text-sm text-[#c4c6d0]/50">{uploading ? 'Uploading...' : 'Click to upload file'}</p>
                  </label>
                </div>
                <p className="text-xs text-[#c4c6d0]/30 text-center mb-2">— OR enter URL directly —</p>
                <input className={inputCls} placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
                {form.url && form.type === 'photo' && (
                  <img src={form.url} alt="preview" className="mt-2 h-24 w-full object-cover border border-[#444650]/20" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} disabled={uploading || !form.title || !form.url}
                  className="flex-1 bg-[#ffd700] text-[#002366] py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
                  Add to Gallery
                </button>
                <button onClick={() => { setShowForm(false); setForm({ title: '', url: '', category: 'General', type: 'photo' }) }}
                  className="flex-1 border border-[#444650]/40 text-[#c4c6d0] py-2.5 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { value: items.length, label: 'Total Items', color: 'text-[#ffd700]' },
          { value: items.filter(i => i.active).length, label: 'Visible', color: 'text-emerald-400' },
          { value: items.filter(i => !i.active).length, label: 'Hidden', color: 'text-[#c4c6d0]/40' },
        ].map(s => (
          <div key={s.label} className="bg-[#131318] border border-[#444650]/20 p-4 text-center">
            <p className={`text-3xl font-headline font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['ALL', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 text-xs font-headline font-bold uppercase tracking-widest transition-colors ${filter === c ? 'bg-[#ffd700] text-[#002366]' : 'border border-[#444650]/30 text-[#c4c6d0]/60 hover:border-[#ffd700]/40 hover:text-[#ffd700]'}`}>
            {c} ({c === 'ALL' ? items.length : items.filter(i => i.category === c).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#131318] border border-[#444650]/20 text-center py-16">
          <span className="material-symbols-outlined text-[#c4c6d0]/20 mb-3 block" style={{ fontSize: '48px' }}>photo_library</span>
          <p className="text-[#c4c6d0]/30 font-headline uppercase tracking-widest text-sm">No gallery items yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className={`bg-[#131318] border overflow-hidden transition-opacity ${item.active ? 'border-[#444650]/20' : 'border-[#444650]/10 opacity-50'}`}>
              <div className="aspect-square bg-[#0b0b0f] relative">
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#c4c6d0]/20" style={{ fontSize: '48px' }}>play_circle</span>
                  </div>
                )}
                {!item.active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-headline font-bold uppercase tracking-widest bg-black/60 px-2 py-1">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-headline font-bold text-[#e4e1e9] truncate uppercase tracking-tight">{item.title}</p>
                <p className="text-xs text-[#c4c6d0]/40 mb-3">{item.category} • {item.type}</p>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(item.id, item.active)}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 font-headline font-bold uppercase tracking-widest transition-colors ${item.active ? 'border border-[#ffd700]/30 text-[#ffd700] hover:bg-[#ffd700]/10' : 'border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{item.active ? 'visibility_off' : 'visibility'}</span>
                    {item.active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => deleteItem(item.id)}
                    className="flex items-center justify-center px-3 py-1.5 border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
