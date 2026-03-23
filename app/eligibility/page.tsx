import Link from 'next/link'

const playerReqs = ['Must be Under-19 years of age', 'Currently enrolled in Class 12', 'Resident of Uttar Pradesh', 'Valid Aadhaar Card required']
const teamReqs = ['Minimum 11, Maximum 15 players', 'All players from same district', 'Coach and Manager details required', 'Registration fee: ₹11,000']
const disqualify = [
  { title: 'Age Fraud', desc: 'Providing false age documents will lead to immediate disqualification' },
  { title: 'Fake Documents', desc: 'Submission of forged or invalid documents' },
  { title: 'Misconduct', desc: 'Unsporting behavior or violation of tournament rules' },
  { title: 'Incomplete Registration', desc: 'Missing required documents or information' },
]
const notes = [
  'Registration fee is non-refundable once payment is completed',
  'Tournament committee decisions are final and binding',
  'Players must carry original documents during matches',
  'Age fraud will lead to immediate disqualification',
  "Final team allocation for individual players is at SPL committee's discretion",
]

export default function Eligibility() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Rules & Eligibility</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            ELIGIBILITY <br /><span className="text-[#ffd700]">& RULES</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">Tournament guidelines and requirements for SPL U19 participation</p>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Eligibility Criteria</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#131318] border border-[#444650]/20 p-8">
              <h3 className="font-headline font-black text-lg uppercase tracking-tight text-[#ffd700] mb-6">Player Requirements</h3>
              <ul className="space-y-4">
                {playerReqs.map(r => (
                  <li key={r} className="flex items-start gap-4">
                    <span className="w-5 h-5 bg-[#ffd700] text-[#002366] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black">✓</span>
                    <span className="text-[#c4c6d0] text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#131318] border border-[#444650]/20 p-8">
              <h3 className="font-headline font-black text-lg uppercase tracking-tight text-[#ffd700] mb-6">Team Requirements</h3>
              <ul className="space-y-4">
                {teamReqs.map(r => (
                  <li key={r} className="flex items-start gap-4">
                    <span className="w-5 h-5 bg-[#ffd700] text-[#002366] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black">✓</span>
                    <span className="text-[#c4c6d0] text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disqualification */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-red-500 mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10 text-red-400">Disqualification Criteria</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {disqualify.map((d, i) => (
              <div key={d.title} className="bg-[#0b0b0f] border border-red-500/20 p-6 flex gap-4">
                <span className="text-2xl font-headline font-black text-red-500/30 flex-shrink-0">0{i + 1}</span>
                <div>
                  <h3 className="font-headline font-bold uppercase tracking-tight text-red-400 mb-1">{d.title}</h3>
                  <p className="text-[#c4c6d0] text-sm">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Match Rules */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Tournament Rules</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-4">Match Rules</h3>
              <ul className="space-y-3 text-[#c4c6d0] text-sm">
                {['Each match will be 20 overs per side', 'Powerplay for first 6 overs (only 2 fielders outside 30-yard circle)', 'Maximum 4 overs per bowler', 'DLS method will be used for rain-affected matches', 'No ball and wide ball penalties as per ICC rules'].map(r => (
                  <li key={r} className="flex items-start gap-3 border-b border-[#444650]/10 pb-3">
                    <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full mt-2 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-4">Equipment & Dress Code</h3>
              <ul className="space-y-3 text-[#c4c6d0] text-sm">
                {['Standard cricket whites or colored clothing', 'Protective gear mandatory (helmet, pads, gloves)', 'Only leather balls will be used', 'Bat specifications as per ICC guidelines'].map(r => (
                  <li key={r} className="flex items-start gap-3 border-b border-[#444650]/10 pb-3">
                    <span className="w-1.5 h-1.5 bg-[#444650] rounded-full mt-2 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-8">Important Notes</h2>
          <div className="bg-[#ffd700]/5 border border-[#ffd700]/20 p-8">
            <ul className="space-y-4">
              {notes.map(n => (
                <li key={n} className="flex items-start gap-4 text-[#c4c6d0] text-sm border-b border-[#444650]/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-[#ffd700] font-black flex-shrink-0">⚠</span>{n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-8">Download Documents</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'SPL Official Brochure', desc: 'Tournament overview, rules and prize details', file: '/uploads/SPL Website Document.pdf', icon: 'picture_as_pdf' },
              { label: 'Registration Form (PDF)', desc: 'Printable registration form for offline submission', file: '/uploads/Registration-Form.pdf', icon: 'assignment' }, // ← changed file name
            ].map(doc => (
              <a key={doc.label} href={doc.file} target="_blank" rel="noopener noreferrer"
                className="bg-[#0b0b0f] border border-[#444650]/20 p-5 flex items-center gap-4 hover:border-[#ffd700]/40 transition-colors group">
                <div className="w-12 h-12 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '24px' }}>{doc.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline font-bold uppercase tracking-tight text-[#e4e1e9] group-hover:text-[#ffd700] transition-colors">{doc.label}</h3>
                  <p className="text-xs text-[#c4c6d0]/60 mt-0.5">{doc.desc}</p>
                </div>
                <span className="material-symbols-outlined text-[#444650] group-hover:text-[#ffd700] transition-colors" style={{ fontSize: '20px' }}>download</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20 text-center">
        <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-6 text-white">
          Meet the Criteria? <span className="text-[#ffd700]">Register Now</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?type=team" className="bg-[#ffd700] text-[#002366] px-8 py-3 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
            Register Team
          </Link>
          <Link href="/register?type=individual" className="border-2 border-[#ffd700] text-[#ffd700] px-8 py-3 font-headline font-black uppercase tracking-tight hover:bg-[#ffd700] hover:text-[#002366] transition-all">
            Register Individual
          </Link>
        </div>
      </section>
    </div>
  )
}
