'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Match {
  id: string; phase: string; venue: string; date: string
  result?: string; winner?: string; score1?: string; score2?: string
  team1: { name: string }; team2?: { name: string }
}
interface Announcement { id: string; title: string; content: string; type: string; active: boolean; createdAt: string }
interface PlayerOfWeek {
  name: string; teamName: string; district: string; role: string
  photoUrl?: string; runs?: string; wickets?: string; impactRating?: string; description?: string
}

export default function Home() {
  const [fixtures, setFixtures] = useState<Match[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [liveMatch, setLiveMatch] = useState<Match | null>(null)
  const [pow, setPow] = useState<PlayerOfWeek | null>(null)

  useEffect(() => {
    fetch('/api/schedule').then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        setFixtures(d.slice(0, 4))
        const completed = d.filter((m: Match) => m.result || m.score1)
        if (completed.length > 0) setLiveMatch(completed[completed.length - 1])
      }
    }).catch(() => { })
    fetch('/api/admin/announcements').then(r => r.json()).then(d => { if (Array.isArray(d)) setAnnouncements(d.filter((a: Announcement) => a.active).slice(0, 3)) }).catch(() => { })
    fetch('/api/admin/player-of-week').then(r => r.json()).then(d => { if (d) setPow(d) }).catch(() => { })
  }, [])

  return (
    <main className="relative md:pt-20">

      {/* ── Hero ── */}
      <section className="relative h-[921px] w-full overflow-hidden bg-[#001a4d]">
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/stadium.avif"
            alt="SPL Stadium"
            fill
            sizes="100vw"
            className="object-cover opacity-75"
            priority
          />
          {/* single gradient: left side dark for text legibility, right stays visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001a4d]/90 via-[#001a4d]/50 to-[#001a4d]/10" />
          {/* subtle bottom fade to page bg */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0b0f] to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-6 flex flex-col justify-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Live badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#002366] border border-[#ffd700]/40 text-[#ffd700] px-3 py-1 text-xs font-headline font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-pulse" />
                  LIVE MATCH
                </span>
                <span className="text-[#c4c6d0] font-headline text-xs tracking-widest uppercase">
                  FINALS WEEK • ROUND 12
                </span>
              </div>

              {/* Title */}
              <h1 className="font-headline font-black text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] tracking-tighter mb-8 italic uppercase">
                BATTLE OF <br />
                <span className="text-[#ffd700]">TITANS</span>
              </h1>

              {/* Live Scoreboard */}
              <div className="bg-[#131318]/60 backdrop-blur-xl p-8 shadow-2xl border-l-4 border-[#ffd700] max-w-xl">
                {liveMatch ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-headline font-black mb-1">
                          {liveMatch.team1.name.split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase()}
                        </div>
                        <div className="text-[0.6rem] tracking-[0.2em] text-[#c4c6d0] font-headline font-bold uppercase">{liveMatch.team1.name}</div>
                      </div>
                      <span className="text-4xl font-headline font-light text-[#c4c6d0]/40">VS</span>
                      <div className="text-center">
                        <div className="text-3xl font-headline font-black mb-1 text-[#ffd700]">
                          {(liveMatch.team2?.name || 'TBD').split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase()}
                        </div>
                        <div className="text-[0.6rem] tracking-[0.2em] text-[#c4c6d0] font-headline font-bold uppercase">{liveMatch.team2?.name || 'TBD'}</div>
                      </div>
                    </div>
                    {liveMatch.score1 && (
                      <div className="flex justify-center items-baseline gap-4 mb-4">
                        <span className="text-5xl md:text-6xl font-headline font-black text-[#ffd700]">{liveMatch.score1}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center bg-[#1c1c21]/80 px-4 py-3">
                      <span className="text-xs font-medium text-[#e9c349] italic">
                        {liveMatch.phase.replace('_', ' ')}
                      </span>
                      {liveMatch.winner && (
                        <span className="text-xs font-medium text-emerald-400">🏆 {liveMatch.winner}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-headline font-black mb-1">SPL</div>
                        <div className="text-[0.6rem] tracking-[0.2em] text-[#c4c6d0] font-headline font-bold uppercase">Season 2025</div>
                      </div>
                      <span className="text-4xl font-headline font-light text-[#c4c6d0]/40">U19</span>
                      <div className="text-center">
                        <div className="text-3xl font-headline font-black mb-1 text-[#ffd700]">UP</div>
                        <div className="text-[0.6rem] tracking-[0.2em] text-[#c4c6d0] font-headline font-bold uppercase">Uttar Pradesh</div>
                      </div>
                    </div>
                    <div className="flex justify-center items-baseline gap-4 mb-4">
                      <span className="text-5xl font-headline font-black text-[#ffd700]">₹11L</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#1c1c21]/80 px-4 py-3">
                      <span className="text-xs font-medium text-[#e9c349] italic">Winner Prize Money</span>
                      <span className="text-xs font-medium text-[#c4c6d0]">50% Scholarship</span>
                    </div>
                  </>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/register"
                  className="bg-[#ffd700] text-[#002366] px-8 py-3 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
                  Register Now
                </Link>
                <Link href="/tournament-format"
                  className="border border-[#444650] text-[#e4e1e9] px-8 py-3 font-headline font-black uppercase tracking-tight hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
                  Tournament Info
                </Link>
              </div>
            </div>

            {/* Stats panel — desktop */}
            <div className="hidden lg:flex flex-col gap-6 items-end">
              {[
                { label: 'Winner Prize', value: '₹11,00,000' },
                { label: 'Scholarship', value: '50%' },
                { label: 'Participants', value: '1000+' },
                { label: 'Final Venue', value: 'Ekana Stadium' },
              ].map(s => (
                <div key={s.label} className="bg-[#131318]/60 backdrop-blur-xl border border-[#444650]/30 px-8 py-5 text-right w-72">
                  <div className="text-3xl font-headline font-black text-[#ffd700]">{s.value}</div>
                  <div className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Fixtures ── */}
      <section className="bg-[#0b0b0f]  px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline font-black text-4xl uppercase tracking-tighter italic">Upcoming Fixtures</h2>
              <div className="w-24 h-1 bg-[#ffd700] mt-2" />
            </div>
            <Link href="/schedule" className="text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700] hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
            </Link>
          </div>

          {(() => {
            const upcomingFixtures = fixtures.filter(f => !f.result);
            if (upcomingFixtures.length > 0) {
              return (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {upcomingFixtures.map((f, i) => (
                    <div key={f.id}
                      className={`bg-[#131318] p-6 hover:-translate-y-1 transition-transform duration-300 border ${i === 0 ? 'border-[#ffd700]/50' : 'border-[#444650]/10'}`}>
                      <div className={`text-[0.6rem] font-headline font-bold tracking-[0.2em] uppercase mb-4 ${i === 0 ? 'text-[#ffd700]' : 'text-[#c4c6d0]'}`}>
                        {new Date(f.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {new Date(f.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-headline font-black uppercase">{f.team1.name}</div>
                        <div className="text-[10px] text-[#c4c6d0] font-bold px-2 py-1 bg-[#1c1c21] border border-[#444650]/20">VS</div>
                        <div className="text-sm font-headline font-black uppercase">{f.team2?.name || 'TBD'}</div>
                      </div>
                      <div className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 px-2 py-0.5 mb-4 w-fit">
                        {f.phase.replace('_', ' ')}
                      </div>
                      <Link href="/schedule"
                        className="block w-full text-center border border-[#444650]/40 hover:border-[#ffd700] hover:bg-[#ffd700] hover:text-[#002366] py-2 text-[0.65rem] font-headline font-black uppercase tracking-widest transition-all">
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              );
            } else {
              return (
                <div className="text-center py-16 border border-[#444650]/20 bg-[#131318]">
                  <span className="material-symbols-outlined text-[#ffd700]/20 block mb-3" style={{ fontSize: '48px' }}>calendar_today</span>
                  <p className="font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/40">Fixtures will be announced soon</p>
                  <Link href="/schedule" className="mt-4 inline-block text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700] hover:underline">View Schedule →</Link>
                </div>
              );
            }
          })()}
        </div>
      </section>

      {/* ── Latest News ── */}
      <section className="bg-[#0b0b0f] py-20 px-6 border-t border-[#444650]/10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-6 mb-16 relative">
            <h2 className="font-headline font-black text-6xl md:text-8xl uppercase tracking-tighter opacity-[0.03] leading-none select-none">THE FEED</h2>
            <h2 className="absolute font-headline font-black text-4xl uppercase tracking-tight italic">Latest News</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Feature */}
            <div className="md:col-span-7 group cursor-pointer overflow-hidden relative aspect-[16/10] border border-[#444650]/10">
              <Image
                src="/Hero.png"
                alt="SPL News Feature"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 scale-105 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/40 to-transparent p-8 flex flex-col justify-end">
                <span className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-3">Official</span>
                <h3 className="text-3xl md:text-5xl font-headline font-black italic uppercase leading-[1.1] max-w-2xl mb-4 group-hover:text-[#ffd700] transition-colors">
                  {announcements[0]?.title || 'SPL 2025 — Registration Now Open'}
                </h3>
                <p className="text-[#c4c6d0]/80 max-w-xl text-sm leading-relaxed hidden md:block">
                  {announcements[0]?.content || 'Team and individual registrations are now open for Saroj Premier League Under-19 tournament. Register today to compete for ₹11,00,000 prize money.'}
                </p>
              </div>
            </div>

            {/* Side Announcements */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {(announcements.length > 1 ? announcements.slice(1) : [
                { id: '1', title: 'Ekana Stadium Confirmed as Final Venue', content: 'The grand finale of SPL will be held at the prestigious Ekana Cricket Stadium in Lucknow.', type: 'INFO', createdAt: '2025-02-10' },
                { id: '2', title: '50% Scholarship for All Participants', content: 'Every player participating in SPL will be eligible for 50% scholarship at Saroj International University.', type: 'UPDATE', createdAt: '2025-02-05' },
              ]).slice(0, 2).map(n => (
                <div key={n.id} className="bg-[#131318] p-6 flex gap-6 hover:bg-[#1c1c21] transition-colors cursor-pointer border border-[#444650]/10">
                  <div className="w-32 h-24 flex-shrink-0 bg-[#002366] overflow-hidden border border-[#444650]/20 relative flex items-center justify-center">
                    <span className="font-headline font-black text-xs italic uppercase text-[#ffd700]/30">SPL</span>
                  </div>
                  <div>
                    <span className="text-[0.6rem] font-headline font-bold text-[#ffd700] uppercase tracking-widest">{n.type}</span>
                    <h4 className="font-headline font-bold text-lg leading-tight mt-2 uppercase hover:text-[#ffd700] transition-colors">{n.title}</h4>
                  </div>
                </div>
              ))}
              <Link href="/news" className="text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700] hover:underline flex items-center gap-1 mt-auto">
                All Announcements <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Player of the Week ── */}
      {pow && (
        <section className="py-20 px-6 bg-[#0b0b0f] overflow-hidden border-t border-[#444650]/10">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative">
                <div className="absolute -top-12 -left-12 text-[10rem] font-headline font-black text-[#ffd700]/5 select-none pointer-events-none uppercase">MVP</div>
                <h2 className="font-headline font-black text-5xl italic uppercase mb-8 relative z-10 leading-none">
                  Player of <br />
                  <span className="text-[#ffd700] text-7xl">The Week</span>
                </h2>
                <div className="space-y-6 relative z-10">
                  {[
                    { stat: pow.runs || '—', label: 'Runs Scored' },
                    { stat: pow.wickets || '—', label: 'Best Bowling' },
                    { stat: pow.impactRating || '—', label: 'Impact Rating' },
                  ].map(s => (
                    <div key={s.label} className="flex items-baseline gap-4 border-b border-[#444650]/20 pb-4">
                      <span className="text-4xl font-headline font-black text-[#ffd700]">{s.stat}</span>
                      <span className="text-sm font-headline font-bold text-[#c4c6d0] uppercase tracking-widest">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12">
                  <h3 className="text-3xl font-headline font-black uppercase mb-1">{pow.name}</h3>
                  <p className="text-[#ffd700] text-sm font-headline font-bold uppercase tracking-widest mb-2">{pow.role} · {pow.teamName} · {pow.district}</p>
                  <p className="text-[#c4c6d0] font-medium max-w-sm">{pow.description || 'Outstanding performance this week.'}</p>
                  <Link href="/register"
                    className="mt-8 inline-flex items-center gap-4 text-[#ffd700] font-headline font-black uppercase tracking-[0.2em] group">
                    Register Now
                    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 relative h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[#ffd700]/5 skew-y-6 scale-y-110 border-y border-[#ffd700]/20" />
                <div className="relative z-10 h-full w-full border border-[#ffd700]/20 overflow-hidden">
                  <Image
                    src={pow.photoUrl || '/Hero.png'}
                    alt={pow.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover grayscale brightness-90"
                  />
                  <div className="absolute bottom-8 right-8 z-20 bg-[#ffd700] text-[#002366] p-6 font-headline font-black italic text-3xl uppercase tracking-tighter shadow-[10px_10px_0_rgba(0,35,102,1)]">
                    {pow.name.split(' ').slice(0, 2).join(' ').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Registration CTA ── */}
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h2 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter mb-6 text-white">
            JOIN THE <span className="text-[#ffd700]">ARENA</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Register your team or join as an individual player. Compete for ₹11,00,000 prize money and a 50% scholarship at Saroj International University.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=team"
              className="bg-[#ffd700] text-[#002366] px-10 py-4 font-headline font-black uppercase tracking-tight text-lg hover:brightness-110 transition-all">
              Register Team — ₹11,000
            </Link>
            <Link href="/register?type=individual"
              className="border-2 border-[#ffd700] text-[#ffd700] px-10 py-4 font-headline font-black uppercase tracking-tight text-lg hover:bg-[#ffd700] hover:text-[#002366] transition-all">
              Register Individual — ₹1,000
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
