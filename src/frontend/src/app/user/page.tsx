'use client';

import { useState, useEffect } from 'react';
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
  link: string;
  status: number | string;
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

  const statusMap: Record<number, string> = {
    1: 'pendente',
    2: 'aprovado',
    3: 'negado',
  };

  useEffect(() => {
    const fetchUserById = async () => {
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/documents/user/${usuarioId}`);
        if (!res.ok) throw new Error('Erro ao buscar documentos');
        const data = await res.json();

        // Mapa para status legível
        const statusMap: Record<number, string> = {
          1: 'pendente',
          2: 'aprovado',
          3: 'negado',
        };

        // Letras para nomes fictícios
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const documentosConvertidos = data.documentos.map((doc: any, index: number) => ({
          nome: `Documento ${letras[index] || `#${index + 1}`}`,
          status: typeof doc.status === 'number' ? statusMap[doc.status] || 'desconhecido' : doc.status,
          link: doc.link
        }));

        setUsuarioAtual({
          nome: data.nome,
          email: data.email,
          documentos: documentosConvertidos,
        });
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    };

    fetchUserById();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleApprove = (nome: string) => {
    if (!usuarioAtual) return;
    const updated = usuarioAtual.documentos.map(doc =>
      doc.nome === nome ? { ...doc, status: 'aprovado' } : doc
    );
    setUsuarioAtual({ ...usuarioAtual, documentos: updated });
  };

  const handleReject = (nome: string) => {
    if (!usuarioAtual) return;
    const updated = usuarioAtual.documentos.map(doc =>
      doc.nome === nome ? { ...doc, status: 'negado' } : doc
    );
    setUsuarioAtual({ ...usuarioAtual, documentos: updated });
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

  const getStatusTextColor = (status: string) => {
    if (status === 'aprovado') return 'text-[#2FB8BC]';
    if (status === 'pendente') return 'text-[#FFC857]';
    return 'text-[#E15554]';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'aprovado') return faCheckCircle;
    if (status === 'pendente') return faClock;
    return faTimesCircle;
  };

  return (
    <div className={`min-h-screen bg-[#F3F5F4] flex ${isMobile ? 'flex-col' : 'flex-row'} relative`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main className={`p-8 flex-1 transition-margin duration-300 ${isMobile ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'}`}>
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-[#022028]">{usuarioAtual?.nome || 'Usuário'}</h1>
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

        {['pendente', 'aprovado', 'negado'].map(status =>
          usuarioAtual?.documentos?.some(doc => doc.status === status) ? (
            <div key={status} className="bg-white rounded-xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-[#022028] mb-4">
                Documentos {status.charAt(0).toUpperCase() + status.slice(1)}
              </h2>
              <div className="space-y-4">
                {usuarioAtual.documentos
                  .filter(doc => doc.status === status)
                  .map(doc => (
                    <div
                      key={doc.nome}
                      className="grid grid-cols-[6fr_1fr_5fr] md:grid-cols-[7fr_3fr_2fr] gap-4 items-center bg-[#F1F1F1] p-4 rounded-md"
                    >
                      <span className="text-sm text-[#022028]">{doc.nome}</span>
                      <div className="text-center flex items-center justify-center gap-1">
                        <FontAwesomeIcon icon={getStatusIcon(doc.status as string)} className={`text-base ${getStatusTextColor(doc.status as string)}`} />
                        <span className={`hidden md:inline text-xs font-medium ${getStatusTextColor(doc.status as string)}`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-end gap-3">
                        {status !== 'aprovado' && (
                          <button onClick={() => handleApprove(doc.nome)} className="text-[#5CE1E6] hover:text-[#3ec0d3]">
                            <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
                          </button>
                        )}
                        {status === 'pendente' && (
                          <button onClick={() => handleReject(doc.nome)} className="text-[#5CE1E6] hover:text-[#3ec0d3]">
                            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                          </button>
                        )}


                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null
        )}
      </main>
    </div>
  );
}
