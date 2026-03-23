'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

function useHasRegistration() {
  const { isSignedIn, isLoaded } = useUser()
  const [hasReg, setHasReg] = useState<boolean>(false)
  const [checked, setChecked] = useState(false)
 


  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) { setHasReg(false); setChecked(true); return }
    localStorage.removeItem('adminToken')
    localStorage.removeItem('coordinatorToken')
    localStorage.removeItem('coordinatorDistrict')
    fetch('/api/my-registration')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setHasReg(!!d.registration); setChecked(true) })
      .catch(() => { setHasReg(false); setChecked(true) })
  }, [isLoaded, isSignedIn])

  return { hasReg, checked }
}

function useAdminToken() {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken') || !!localStorage.getItem('coordinatorToken'))
  }, [])
  return isAdmin
}

const mainLinks = [
  { href: '/schedule', label: 'Schedule' },
  { href: '/tournament-format', label: 'Format' },
  { href: '/about', label: 'About' },
  { href: '/news', label: 'News' },
]

const moreLinks = [
  { href: '/eligibility', label: 'Rules' },
  { href: '/prizes', label: 'Prizes' },
  { href: '/scholarships', label: 'Scholarship' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/sponsors', label: 'Sponsors' },
]

function AccountDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative hidden md:block">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-headline font-bold uppercase tracking-tight text-[#e4e1e9]/70 hover:text-[#ffd700] transition-colors">
        Account
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{open ? 'expand_less' : 'expand_more'}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-3 w-48 bg-[#131318] border border-[#444650]/30 shadow-2xl flex flex-col py-2 z-50">
          <Link href="/sign-in" onClick={() => setOpen(false)}
            className="px-5 py-2.5 text-xs font-headline font-bold uppercase tracking-widest text-[#e4e1e9]/70 hover:text-[#ffd700] hover:bg-[#1c1c21] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>login</span>
            Player Sign In
          </Link>
          <div className="h-px bg-[#444650]/20 my-1" />
          <p className="px-5 pt-1 pb-0.5 text-[0.55rem] font-headline font-bold uppercase tracking-widest text-[#444650]">Staff Access</p>
          <Link href="/admin/login" onClick={() => setOpen(false)}
            className="px-5 py-2.5 text-xs font-headline font-bold uppercase tracking-widest text-[#e4e1e9]/70 hover:text-[#ffd700] hover:bg-[#1c1c21] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>admin_panel_settings</span>
            Admin Login
          </Link>
          <Link href="/coordinator/login" onClick={() => setOpen(false)}
            className="px-5 py-2.5 text-xs font-headline font-bold uppercase tracking-widest text-[#e4e1e9]/70 hover:text-[#ffd700] hover:bg-[#1c1c21] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>shield_person</span>
            Coordinator Login
          </Link>
        </div>
      )}
    </div>
  )
}

function UserDropdown() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative hidden md:flex items-center gap-2">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-headline font-bold uppercase tracking-tight text-[#e4e1e9]/70 hover:text-[#ffd700] transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_circle</span>
        {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Account'}
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{open ? 'expand_less' : 'expand_more'}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-3 w-52 bg-[#131318] border border-[#444650]/30 shadow-2xl flex flex-col py-2 z-50">
          {/* User info */}
          <div className="px-5 py-3 border-b border-[#444650]/20">
            <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700] truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-[#c4c6d0]/50 font-body truncate mt-0.5">
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
          <div className="h-px bg-[#444650]/20 my-1" />
          <button
            onClick={() => { setOpen(false); signOut().then(() => { window.location.href = '/' }) }}
            className="px-5 py-2.5 text-xs font-headline font-bold uppercase tracking-widest text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 w-full text-left">
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>logout</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

function MobileUserSection({ onClose, hasReg }: { onClose: () => void; hasReg: boolean }) {
  const { user } = useUser()
  const { signOut } = useClerk()
  return (
    <>
      <div className="py-2 border-t border-[#444650]/20">
        <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700]">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-[11px] text-[#c4c6d0]/50 font-body mt-0.5">
          {user?.emailAddresses?.[0]?.emailAddress}
        </p>
      </div>
      {hasReg ? (
        <Link href="/my-registration" onClick={onClose}
          className="font-headline font-bold uppercase tracking-tight text-sm text-[#ffd700] flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>assignment</span>
          My Registration
        </Link>
      ) : (
        <Link href="/register" onClick={onClose}
          className="font-headline font-bold uppercase tracking-tight text-sm text-[#ffd700] flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>app_registration</span>
          Register
        </Link>
      )}
      <button
        onClick={() => { onClose(); signOut().then(() => { window.location.href = '/' }) }}
        className="font-headline font-bold uppercase tracking-tight text-sm text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-2 w-full text-left">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
        Sign Out
      </button>
    </>
  )
}

function RegisterButton({ hasReg }: { hasReg: boolean }) {
  const { isSignedIn } = useUser();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Hide the button on small screens
  if (isSmallScreen) return null;

  if (isSignedIn && hasReg) {
    return (
      <Link href="/my-registration"
        className="bg-[#ffd700] text-[#002366] px-4 md:px-6 py-2 font-headline font-bold uppercase tracking-tight text-sm scale-95 hover:scale-100 active:scale-90 transition-all duration-200 flex items-center gap-1.5">
        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>assignment</span>
        My Registration
      </Link>
    );
  }

  return (
    <Link href="/register"
      className="bg-[#ffd700] text-[#002366] px-4 md:px-6 py-2 font-headline font-bold uppercase tracking-tight text-sm scale-95 hover:scale-100 active:scale-90 transition-all duration-200">
      Register
    </Link>
  );
}

function AdminBadge() {
  const isAdmin = useAdminToken()
  if (!isAdmin) return null
  const isCoord = typeof window !== 'undefined' && !!localStorage.getItem('coordinatorToken')
  const href = isCoord ? '/coordinator/dashboard' : '/admin/dashboard'
  const label = isCoord ? 'Coordinator Panel' : 'Admin Panel'
  return (
    <Link href={href}
      className="hidden md:flex items-center gap-1.5 border border-[#ffd700]/40 text-[#ffd700] px-3 py-1.5 text-[0.6rem] font-headline font-black uppercase tracking-widest hover:bg-[#ffd700]/10 transition-colors">
      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>admin_panel_settings</span>
      {label}
      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
    </Link>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const pathname = usePathname()
  const moreRef = useRef<HTMLDivElement>(null)
  const isStaff = useAdminToken()
  const { hasReg } = useHasRegistration()

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
      if (mobileOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [mobileOpen])

  const isMoreActive = moreLinks.some(l => l.href === pathname)

  return (
    <>
      <header ref={mobileMenuRef} className="bg-[#131318]/70 backdrop-blur-xl border-b border-[#444650]/15 shadow-[0_20px_40px_rgba(179,197,255,0.08)] fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-[#002366] border border-[#ffd700]/40 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '14px' }}>sports_cricket</span>
            </span>
            <span className="text-xl md:text-2xl font-black tracking-tight font-headline italic uppercase">
              <span className="text-[#ffd700]">Saroj</span><span className="text-[#e4e1e9]"> Premier</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 font-headline font-bold uppercase tracking-tighter text-sm items-center">
            {mainLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`transition-colors ${pathname === l.href ? 'text-[#ffd700] border-b-2 border-[#ffd700] pb-0.5' : 'text-[#e4e1e9]/80 hover:text-[#ffd700]'}`}>
                {l.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 transition-colors ${isMoreActive ? 'text-[#ffd700] border-b-2 border-[#ffd700] pb-0.5' : 'text-[#e4e1e9]/80 hover:text-[#ffd700]'}`}>
                More
                <span className="material-symbols-outlined text-base" style={{ fontSize: '16px' }}>
                  {moreOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-3 w-44 bg-[#131318] border border-[#444650]/30 shadow-2xl flex flex-col py-2 z-50">
                  {moreLinks.map(l => (
                    <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)}
                      className={`px-5 py-2.5 text-xs font-headline font-bold uppercase tracking-widest transition-colors ${pathname === l.href ? 'text-[#ffd700] bg-[#1c1c21]' : 'text-[#e4e1e9]/70 hover:text-[#ffd700] hover:bg-[#1c1c21]'}`}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <AdminBadge />
            {!isStaff && (
              <>
                <SignedOut>
                  <AccountDropdown />
                </SignedOut>
                <SignedIn>
                  <UserDropdown />
                </SignedIn>
                <RegisterButton hasReg={hasReg} />
              </>
            )}
            <button className="md:hidden text-[#e4e1e9]/70 hover:text-[#ffd700] transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#131318] border-t border-[#444650]/20 px-6 py-4 flex flex-col gap-4">
            {[...mainLinks, ...moreLinks].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className={`font-headline font-bold uppercase tracking-tight text-sm transition-colors ${pathname === l.href ? 'text-[#ffd700]' : 'text-[#e4e1e9]/80 hover:text-[#ffd700]'}`}>
                {l.label}
              </Link>
            ))}
            {isStaff ? (
              <Link href={typeof window !== 'undefined' && localStorage.getItem('coordinatorToken') ? '/coordinator/dashboard' : '/admin/dashboard'} onClick={() => setMobileOpen(false)}
                className="font-headline font-bold uppercase tracking-tight text-sm text-[#ffd700] flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>admin_panel_settings</span>
                {typeof window !== 'undefined' && localStorage.getItem('coordinatorToken') ? 'Coordinator Panel' : 'Admin Panel'}
              </Link>
            ) : (
              <>
                <SignedOut>
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}
                    className="font-headline font-bold uppercase tracking-tight text-sm text-[#e4e1e9]/80 hover:text-[#ffd700] transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    className="font-headline font-bold uppercase tracking-tight text-sm text-[#ffd700]">
                    Register
                  </Link>
                  <Link href="/admin/login" onClick={() => setMobileOpen(false)}
                    className="font-headline font-bold uppercase tracking-tight text-sm text-[#e4e1e9]/80 hover:text-[#ffd700] transition-colors">
                    Admin Login
                  </Link>
                  <Link href="/coordinator/login" onClick={() => setMobileOpen(false)}
                    className="font-headline font-bold uppercase tracking-tight text-sm text-[#e4e1e9]/80 hover:text-[#ffd700] transition-colors">
                    Coordinator Login
                  </Link>
                </SignedOut>
                <SignedIn>
                  <MobileUserSection onClose={() => setMobileOpen(false)} hasReg={hasReg} />
                </SignedIn>
              </>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#131318]/90 backdrop-blur-xl z-50 px-6 py-3 flex justify-between items-center border-t border-[#444650]/15">
        {[
          { href: '/',         icon: 'home',             label: 'Home'     },
          { href: '/schedule', icon: 'calendar_today',   label: 'Fixtures' },
          { href: '/register', icon: 'app_registration', label: 'Register' },
          { href: '/news',     icon: 'newspaper',        label: 'News'     },
          { href: '/contact',  icon: 'sensors',          label: 'Contact'  },
        ].map(item => (
          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
            className={`flex flex-col items-center gap-1 ${pathname === item.href ? 'text-[#ffd700]' : 'text-[#e4e1e9]/40'}`}>
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[10px] font-headline font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
