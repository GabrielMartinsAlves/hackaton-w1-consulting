'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DocumentoRow from '@/components/DocumentoRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export default function DocumentosPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const documentos = [
    { nome: 'contrato_social.pdf', status: 'ok' },
    { nome: 'identidade_socio1.pdf', status: 'ok' },
    { nome: 'balanco_patrimonial.pdf', status: 'pendente' },
    { nome: 'declaracao_fiscal.pdf', status: 'erro' },
  ];

  return (
    <div className={`min-h-screen bg-white flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main
        className={`p-4 flex-1 transition-margin duration-300 ${
          isMobile
            ? ''
            : sidebarExpanded
            ? 'ml-60'
            : 'ml-20'
        }`}
      >
        <h1 className="text-xl font-bold text-black mb-8">Documentos</h1>

        <div className="flex justify-center mb-6">
          <div className="bg-[#5CE1E6] rounded-full p-4">
            <FontAwesomeIcon
              icon={faUpload}
              className="text-[#022028] text-[24px] h-7 w-7"
            />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button className="bg-[#022028] text-white px-6 py-3 rounded-md font-semibold text-lg">
            Selecionar Arquivo
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mb-2 max-w-xs mx-auto">
          Formatos aceitos: PDF, JPG, PNG (Máx: 10MB)
        </p>
        <p className="text-center text-xs text-gray-500 mb-6 max-w-xs mx-auto">
          Para garantir o processo mais rápido, digitalize os documentos em alta qualidade
        </p>

        <div className="border border-[#DDDDDD] rounded-md overflow-hidden text-sm max-w-md mx-auto">
          <div className="grid grid-cols-[7fr_2fr_2fr] font-bold text-black px-4 py-3 border-b border-[#DDDDDD] bg-[#F3F3F3]">
            <span>Nome do Arquivo</span>
            <div className="text-center">Status</div>
            <div className="text-right">Ações</div>
          </div>

          {documentos.map((doc, idx) => (
            <DocumentoRow key={idx} nome={doc.nome} status={doc.status as any} />
          ))}
        </div>
      </main>
    </div>
  );
}
