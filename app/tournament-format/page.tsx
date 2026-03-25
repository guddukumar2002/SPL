import Link from 'next/link'

const phases = [
  {
    num: '01', week: 'Week 1–2', title: 'District Level', color: '#ffd700',
    desc: 'All registered teams compete within their respective districts.',
    points: ['Round-robin format within districts', 'Top 2 teams from each district qualify', 'Matches conducted at local grounds'],
  },
  {
    num: '02', week: 'Week 3', title: 'Zonal Championships', color: '#ffd700',
    desc: 'District winners compete in zonal championships.',
    points: ['4 zones: East, West, North, South UP', 'Knockout format', 'Zone winners advance to state level'],
  },
  {
    num: '03', week: 'Week 4', title: 'State Semi-Finals', color: '#ffd700',
    desc: 'Final phase with semi-finals and grand finale.',
    points: ['Semi-finals: 4 zone winners', 'Grand Final at Ekana Cricket Stadium', 'Live streaming and media coverage'],
  },
  {
    num: '04', week: 'Final', title: 'Ekana Grand Final', color: '#ffd700',
    desc: 'The ultimate showdown at Lucknow\'s premier cricket venue.',
    points: ['₹11,00,000 winner prize', '50% scholarship for all participants', 'State-level media coverage'],
  },
]

const rules = [
  { label: 'Format', value: '20 Overs per side' },
  { label: 'Powerplay', value: 'First 6 overs' },
  { label: 'Max overs/bowler', value: '4 overs' },
  { label: 'Rain rule', value: 'DLS Method' },
  { label: 'Team size', value: 'Max 15 players' },
  { label: 'Ball', value: 'Leather ball only' },
]

export default function TournamentFormat() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Tournament</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            TOURNAMENT <br /><span className="text-[#ffd700]">FORMAT</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">SPL Under-19 Cricket Tournament Structure — District to Ekana</p>
        </div>
      </section>

      {/* Phases */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-12">Tournament Phases</h2>
          <div className="space-y-0">
            {phases.map((p, i) => (
              <div key={p.num} className={`grid md:grid-cols-12 gap-0 border-b border-[#444650]/15 ${i % 2 === 0 ? 'bg-[#131318]' : 'bg-[#0b0b0f]'}`}>
                <div className="md:col-span-2 p-8 flex flex-col justify-center border-r border-[#444650]/15">
                  <div className="text-5xl font-headline font-black text-[#ffd700]/20">{p.num}</div>
                  <div className="text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700] mt-2">{p.week}</div>
                </div>
                <div className="md:col-span-10 p-8">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3" style={{ color: p.color }}>{p.title}</h3>
                  <p className="text-[#c4c6d0] mb-4">{p.desc}</p>
                  <ul className="space-y-1">
                    {p.points.map(pt => (
                      <li key={pt} className="flex items-center gap-3 text-sm text-[#c4c6d0]">
                        <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full flex-shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Match Rules */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Match Rules</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {rules.map(r => (
              <div key={r.label} className="bg-[#0b0b0f] border border-[#444650]/20 p-5 text-center hover:border-[#ffd700]/40 transition-colors">
                <div className="text-lg font-headline font-black text-[#ffd700] mb-1">{r.value}</div>
                <div className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-4">Equipment & Dress Code</h3>
              <ul className="space-y-2 text-[#c4c6d0] text-sm">
                {['Standard cricket whites or colored clothing', 'Protective gear mandatory (helmet, pads, gloves)', 'Only leather balls will be used', 'Bat specifications as per ICC guidelines'].map(r => (
                  <li key={r} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-4">Important Notes</h3>
              <ul className="space-y-2 text-[#c4c6d0] text-sm">
                {['DLS method for rain-affected matches', 'No ball and wide ball penalties as per ICC rules', 'Umpire decisions are final', 'Players must carry original documents'].map(r => (
                  <li key={r} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#444650] rounded-full flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Grand Final CTA */}
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🏟️</div>
          <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-3 text-white">
            Grand Final at <span className="text-[#ffd700]">Ekana Stadium</span>
          </h2>
          <p className="text-white/70 mb-8">Lucknow's premier cricket venue. The biggest U19 final in Uttar Pradesh.</p>
          <Link href="/register" className="bg-[#ffd700] text-[#002366] px-10 py-4 font-headline font-black uppercase tracking-tight text-lg hover:brightness-110 transition-all inline-block">
            Register Now
          </Link>
        </div>
      </section>
    </div>
  )
}
