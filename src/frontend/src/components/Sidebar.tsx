// components/Sidebar.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  faChartBar,
  faFolder,
  faFileContract,
  faCog,
  faRightFromBracket,
  faBars,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const menuItems = [
  { icon: faChartBar, label: 'Acompanhamento', path: '/acompanhamento' },
  { icon: faFolder, label: 'Documentos', path: '/documentos' },
  { icon: faFileContract, label: 'Contratos', path: '/contratos' },
  { icon: faCog, label: 'Configurações', path: '/configuracoes' },
]

export default function Sidebar({ onExpandChange }: { onExpandChange?: (expanded: boolean) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  async function handleLogout() {
    const token = localStorage.getItem('token')
    await fetch(`${process.env.REACT_PUBLIC_URL_API}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleMouseEnter = () => {
    setExpanded(true)
    onExpandChange?.(true)
  }
  const handleMouseLeave = () => {
    setExpanded(false)
    onExpandChange?.(false)
  }

  if (isMobile) {
    return (
      <header className="relative bg-[#022028] text-white px-4 py-4 flex items-center justify-between">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#5CE1E6]">
          <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
        </button>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href="/"><Image src="/assets/w1_white.png" alt="Logo" width={34} height={17} /></Link>
        </div>
        <button onClick={handleLogout} className="text-[#5CE1E6]">
          <FontAwesomeIcon icon={faRightFromBracket} className="h-6 w-6" />
        </button>
        {mobileMenuOpen && (
          <nav className="absolute top-full left-0 w-56 bg-[#022028] shadow-lg rounded-br-md rounded-bl-md z-50">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    isActive
                      ? 'bg-[#5CE1E6] text-black'
                      : 'text-white hover:bg-[#5CE1E6] hover:text-black'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`h-5 w-5 ${isActive ? 'text-[#022028]' : 'text-[#5CE1E6]'}`}
                  />
                  <span className={isActive ? 'text-black' : 'text-white'}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </header>
    )
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-0 left-0 h-screen bg-[#022028] text-white flex flex-col justify-between shadow-lg transition-width duration-300 ease-in-out overflow-hidden ${
        expanded ? 'w-60' : 'w-20'
      }`}
    >
      <div>
        <div className="px-6 py-6 flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/assets/w1_white.png" alt="Logo" width={32} height={10} />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}>Portal</span>
          </Link>
          <hr className="border-t border-[#0e3941]" />
        </div>
        <nav className="flex flex-col gap-2 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 rounded-md cursor-pointer relative px-6 py-3 transition-colors ${
                  isActive ? 'bg-[#5CE1E6] text-black' : 'hover:bg-[#14494e]'
                }`}
                title={item.label}
              >
                <FontAwesomeIcon icon={item.icon} className={isActive ? 'text-black' : 'text-[#5CE1E6]'} />
                <span className={`whitespace-nowrap transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="px-2 py-6 border-t border-[#0e3941]">
        <button onClick={handleLogout} className="flex items-center gap-3 text-[#5CE1E6] hover:text-red-400 cursor-pointer px-6 py-3 rounded-md">
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}>Desconectar</span>
        </button>
      </div>
    </aside>
)
}
