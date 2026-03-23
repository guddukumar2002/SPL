import Link from 'next/link'

const benefits = ['50% reduction in tuition fees', 'Applicable to all undergraduate programs', 'Valid for entire course duration', 'Additional sports quota benefits', 'Priority admission consideration']
const conditions = ['Must be a registered SPL U19 participant', 'Complete tournament participation', 'Meet university admission criteria', 'Maintain academic standards', 'No disciplinary issues during tournament']
const steps = [
  { n: '01', title: 'Register & Participate', desc: 'Register for SPL U19 and participate in tournament matches as per schedule.' },
  { n: '02', title: 'Receive Certificate', desc: 'Get your official SPL participation certificate after tournament completion.' },
  { n: '03', title: 'Apply to University', desc: 'Submit your application to Saroj International University along with your SPL certificate.' },
  { n: '04', title: 'Scholarship Approved', desc: 'Receive 50% scholarship on tuition fees upon admission confirmation.' },
]

export default function Scholarships() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Scholarship</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            50% <br /><span className="text-[#ffd700]">SCHOLARSHIP</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">For every SPL participant — regardless of performance</p>
        </div>
      </section>

      {/* Big Number */}
      <section className="py-20 px-6 bg-[#131318] border-b border-[#444650]/15 text-center">
       <div className="text-[4rem] sm:text-[6rem] md:text-[9rem] lg:text-[12rem] font-headline font-black text-[#ffd700] leading-none tracking-tighter">
  50%
</div>
        <p className="text-2xl font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mt-4">Scholarship on Tuition Fees</p>
        <p className="text-[#c4c6d0] mt-4 max-w-xl mx-auto">
          Every player who participates in SPL U19 is eligible for a 50% scholarship at <strong className="text-[#e4e1e9]">Saroj International University</strong>
        </p>
      </section>

      {/* Details */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-[#131318] border border-[#444650]/20 p-8">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter text-[#ffd700] mb-6">What You Get</h3>
            <ul className="space-y-4">
              {benefits.map(b => (
                <li key={b} className="flex items-start gap-4 border-b border-[#444650]/10 pb-4 last:border-0 last:pb-0">
                  <span className="w-5 h-5 bg-[#ffd700] text-[#002366] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5">✓</span>
                  <span className="text-[#c4c6d0] text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#131318] border border-[#444650]/20 p-8">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter text-[#ffd700] mb-6">Eligibility Conditions</h3>
            <ul className="space-y-4">
              {conditions.map(c => (
                <li key={c} className="flex items-start gap-4 border-b border-[#444650]/10 pb-4 last:border-0 last:pb-0">
                  <span className="w-5 h-5 bg-[#444650] text-[#e4e1e9] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5">→</span>
                  <span className="text-[#c4c6d0] text-sm">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Acknowledgement */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-8">Scholarship Acknowledgement</h2>
          <div className="bg-[#ffd700]/5 border border-[#ffd700]/20 p-8">
            <p className="text-[#c4c6d0] mb-6">By participating in SPL, every player acknowledges that:</p>
            <ul className="space-y-4">
              {['Participation in SPL makes them eligible for 50% scholarship', 'Scholarship is applicable at Saroj International University', 'Admission is subject to university norms and eligibility criteria'].map(a => (
                <li key={a} className="flex items-start gap-4 text-[#c4c6d0] text-sm">
                  <span className="text-[#ffd700] font-black flex-shrink-0">★</span>{a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">How to Claim Your Scholarship</h2>
          <div className="grid md:grid-cols-4 gap-0">
            {steps.map((s, i) => (
              <div key={s.n} className={`p-8 border-b md:border-b-0 md:border-r border-[#444650]/15 ${i === steps.length - 1 ? 'md:border-r-0' : ''}`}>
                <div className="text-5xl font-headline font-black text-[#ffd700]/20 mb-4">{s.n}</div>
                <h3 className="font-headline font-bold uppercase tracking-tight mb-2 text-sm">{s.title}</h3>
                <p className="text-[#c4c6d0] text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20 text-center">
        <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-4 text-white">
          Play & Earn Your <span className="text-[#ffd700]">Scholarship</span>
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">Register for SPL U19 today and secure your 50% scholarship at Saroj International University.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?type=team" className="bg-[#ffd700] text-[#002366] px-8 py-3 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
            Register as Team
          </Link>
          <Link href="/register?type=individual" className="border-2 border-[#ffd700] text-[#ffd700] px-8 py-3 font-headline font-black uppercase tracking-tight hover:bg-[#ffd700] hover:text-[#002366] transition-all">
            Register as Individual
          </Link>
        </div>
      </section>
    </div>
  )
}
