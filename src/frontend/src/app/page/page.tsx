'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'

export default function DocumentosPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`min-h-screen bg-white flex flex-col ${isMobile ? '' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main
        className={`flex-1 flex flex-col items-center justify-center p-8 transition-margin duration-300 ${
          isMobile ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'
        }`}
      >
        <Image
          src="/assets/w1.png"
          alt="W1 Logo"
          width={160}
          height={160}
          className="mb-4"
        />
        <h1 className="text-xl font-semibold text-gray-700 text-center">
          Bem-vindo ao Portal W1
        </h1>
      </main>
    </div>
  )
}
