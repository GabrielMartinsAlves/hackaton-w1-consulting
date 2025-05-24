'use client'

import React from 'react'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'

export default function DocumentosPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
    <Sidebar/>
      <div className="flex flex-col items-center">
        <Image
          src="/assets/w1.png"
          alt="W1 Logo"
          width={160}
          height={160}
          className="mb-4"
        />
        <h1 className="text-xl font-semibold text-gray-700">
          Bem-vindo ao Portal W1
        </h1>
      </div>
    </div>
  )
}
