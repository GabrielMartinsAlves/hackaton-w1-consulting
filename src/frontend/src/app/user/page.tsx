'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  faCheck,
  faTimes,
  faEye,
  faUpload,
  faPlus,
  faCheckCircle,
  faClock,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Documento {
  nome: string;
  status: 'aprovado' | 'pendente' | 'negado';
}

interface Usuario {
  nome: string;
  email: string;
  documentos: Documento[];
}

export default function UsuarioDocumentosPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [contractName, setContractName] = useState('');
  const [contractLink, setContractLink] = useState('');
  const [requestedDocName, setRequestedDocName] = useState('');

  const usuarios: Usuario[] = [
    {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      documentos: [
        { nome: 'Contrato Social', status: 'aprovado' },
        { nome: 'Declaração Fiscal', status: 'pendente' },
        { nome: 'Contrato de Trabalho', status: 'negado' },
      ],
    },
    {
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      documentos: [
        { nome: 'Balanço Patrimonial', status: 'negado' },
        { nome: 'Contrato de Trabalho', status: 'aprovado' },
      ],
    },
  ];

  useEffect(() => {
    setUsuarioAtual(usuarios[0]);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleApprove = (nome: string) => {
    if (usuarioAtual) {
      const updated = usuarioAtual.documentos.map((doc) =>
        doc.nome === nome ? { ...doc, status: 'aprovado' as const } : doc
      );
      setUsuarioAtual({ ...usuarioAtual, documentos: updated });
    }
  };

  const handleReject = (nome: string) => {
    if (usuarioAtual) {
      const updated = usuarioAtual.documentos.map((doc) =>
        doc.nome === nome ? { ...doc, status: 'negado' as const } : doc
      );
      setUsuarioAtual({ ...usuarioAtual, documentos: updated });
    }
  };

  const handleSendContract = () => {
    if (contractName && contractLink) {
      alert(`Contrato "${contractName}" enviado com link: ${contractLink}`);
      setShowUploadModal(false);
      setContractName('');
      setContractLink('');
    }
  };

  const handleRequestDocument = () => {
    if (requestedDocName && usuarioAtual) {
      const novoDoc: Documento = { nome: requestedDocName, status: 'pendente' };
      setUsuarioAtual({ ...usuarioAtual, documentos: [...usuarioAtual.documentos, novoDoc] });
      setShowRequestModal(false);
      setRequestedDocName('');
    }
  };

  const getStatusTextColor = (status: 'aprovado' | 'pendente' | 'negado') => {
    if (status === 'aprovado') return 'text-[#2FB8BC]';
    if (status === 'pendente') return 'text-[#FFC857]';
    return 'text-[#E15554]';
  };

  const getStatusIcon = (status: 'aprovado' | 'pendente' | 'negado') => {
    if (status === 'aprovado') return faCheckCircle;
    if (status === 'pendente') return faClock;
    return faTimesCircle;
  };

  return (
    <div className={`min-h-screen bg-[#F3F5F4] flex ${isMobile ? 'flex-col' : 'flex-row'} relative`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main className={`p-8 flex-1 transition-margin duration-300 ${isMobile ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'}`}>
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-[#022028]">{usuarioAtual?.nome}</h1>
          <p className="text-[#555555]">{usuarioAtual?.email}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#5CE1E6] text-[#022028] px-6 py-3 rounded-md font-semibold hover:bg-[#3ec0d3] transition"
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Enviar Novo Contrato
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-[#5CE1E6] text-[#022028] px-6 py-3 rounded-md font-semibold hover:bg-[#3ec0d3] transition"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Requisitar Documento
            </button>
          </div>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-sm">
            <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <FontAwesomeIcon
                icon={faTimes}
                className="absolute top-4 right-4 text-[#5CE1E6] hover:text-[#3ec0d3] cursor-pointer text-lg"
                onClick={() => setShowUploadModal(false)}
              />
              <h2 className="text-xl font-bold text-[#022028] mb-4">Enviar Novo Contrato</h2>
              <input
                type="text"
                placeholder="Nome do Contrato"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mb-3"
              />
              <input
                type="text"
                placeholder="Link do Contrato"
                value={contractLink}
                onChange={(e) => setContractLink(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSendContract}
                  className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded font-semibold hover:bg-[#3ec0d3] transition"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-sm">
            <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <FontAwesomeIcon
                icon={faTimes}
                className="absolute top-4 right-4 text-[#5CE1E6] hover:text-[#3ec0d3] cursor-pointer text-lg"
                onClick={() => setShowRequestModal(false)}
              />
              <h2 className="text-xl font-bold text-[#022028] mb-4">Requisitar Documento</h2>
              <input
                type="text"
                placeholder="Nome do Documento"
                value={requestedDocName}
                onChange={(e) => setRequestedDocName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleRequestDocument}
                  className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded font-semibold hover:bg-[#3ec0d3] transition"
                >
                  Requisitar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documentos por status */}
        {['pendente', 'aprovado', 'negado'].map((status) => (
          usuarioAtual?.documentos.some(doc => doc.status === status) && (
            <div key={status} className="bg-white rounded-xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-[#022028] mb-4">
                Documentos {status === 'pendente' ? 'Pendentes' : status === 'aprovado' ? 'Aprovados' : 'Negados'}
              </h2>
              <div className="space-y-4">
                {usuarioAtual?.documentos
                  .filter(doc => doc.status === status)
                  .map((documento) => (
                    <div
                      key={documento.nome}
                      className="grid grid-cols-[6fr_1fr_5fr] md:grid-cols-[7fr_3fr_2fr] gap-4 items-center bg-[#F1F1F1] p-4 rounded-md"
                    >
                      <span className="text-sm text-[#022028]">{documento.nome}</span>
                      <div className="text-center flex items-center justify-center gap-1">
                        <FontAwesomeIcon
                          icon={getStatusIcon(documento.status)}
                          className={`text-base ${getStatusTextColor(documento.status)}`}
                        />
                        <span className={`hidden md:inline text-xs font-medium ${getStatusTextColor(documento.status)}`}>
                          {documento.status.charAt(0).toUpperCase() + documento.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-end gap-3">
                        {status !== 'aprovado' && (
                          <button onClick={() => handleApprove(documento.nome)} className="text-[#5CE1E6] hover:text-[#3ec0d3]">
                            <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
                          </button>
                        )}
                        {status === 'pendente' && (
                          <button onClick={() => handleReject(documento.nome)} className="text-[#5CE1E6] hover:text-[#3ec0d3]">
                            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                          </button>
                        )}
                        <button onClick={() => console.log('Visualizar Documento')} className="text-[#5CE1E6] hover:text-[#3ec0d3]">
                          <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        ))}
      </main>
    </div>
  );
}
