'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import DocumentoRow from '@/components/DocumentoRow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

export default function DocumentosPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [documentos, setDocumentos] = useState([
    { nome: 'contrato_social.pdf', status: 'ok', acao: 'ver' },
    { nome: 'identidade_socio1.pdf', status: 'pendente', acao: 'editar' },
    { nome: 'balanco_patrimonial.pdf', status: 'erro', acao: 'ver' },
    { nome: 'declaracao_fiscal.pdf', status: 'pendente', acao: 'editar' },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const novos = Array.from(files).map(file => ({
      nome: file.name,
      status: 'pendente',
      acao: 'ver',
    }))
    setDocumentos(prev => [...prev, ...novos])
    e.target.value = ''
  }

  return (
    <div className={`min-h-screen bg-white flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />
      <main
        className={`p-8 flex-1 transition-margin duration-300 ${
          isMobile ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'
        }`}
      >
        <h1 className="text-xl font-bold text-black mb-8 mt-4">Documentos</h1>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />

        {!isMobile ? (
          <div className="w-full bg-[#F9F9F9] border-2 border-dashed border-[#DDDDDD] rounded-md p-8 text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-[#5CE1E6] rounded-full p-4">
                <FontAwesomeIcon icon={faUpload} className="text-[#022028] text-[24px] h-7 w-7" />
              </div>
            </div>
            <p className="font-semibold text-black mb-2">Arraste e solte seus arquivos aqui</p>
            <p className="text-sm text-gray-500 mb-4">ou</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#022028] text-white px-6 py-3 rounded-md font-semibold text-lg"
            >
              Selecionar Arquivos
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex justify-center mb-6">
              <div className="bg-[#5CE1E6] rounded-full p-4">
                <FontAwesomeIcon icon={faUpload} className="text-[#022028] text-[24px] h-7 w-7" />
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#022028] text-white px-6 py-3 rounded-md font-semibold text-lg"
              >
                Selecionar Arquivo
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mb-2 max-w-xs mx-auto">
              Formatos aceitos: PDF, JPG, PNG (Máx: 10MB)
            </p>
            <p className="text-center text-xs text-gray-500 mb-6 max-w-xs mx-auto">
              Para garantir o processo mais rápido, digitalize os documentos em alta qualidade
            </p>
          </div>
        )}

        <div className="w-full border border-[#DDDDDD] rounded-md overflow-hidden text-sm mb-4">
          <div className="grid grid-cols-[7fr_2fr_2fr] font-bold text-black px-4 py-3 border-b border-[#DDDDDD] bg-[#F3F3F3] text-center">
            <span className="text-left">Nome do Arquivo</span>
            <div>Status</div>
            <div className={`${isMobile ? 'text-right' : 'text-center'}`}>Ações</div>
          </div>
          {documentos.map((doc, idx) => (
            <DocumentoRow key={idx} nome={doc.nome} status={doc.status as any} acao={doc.acao} />
          ))}
        </div>

        {!isMobile && (
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">
              Formatos aceitos: PDF, JPG, PNG (Máx: 10MB)
            </p>
            <p className="text-xs text-gray-500">
              Para garantir o processo mais rápido, digitalize os documentos em alta qualidade
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
