'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faEye, faPenNib } from '@fortawesome/free-solid-svg-icons';
import ChatModal from '@/components/ChatModal';

interface Status {
  id: number;
  nome: string;
}

interface User {
  id: number;
  nome?: string;
  email?: string;
}

interface Contrato {
  id: number;
  contract: string;
  user_id: number;
  status_id: number;
  document: string;
  status: { id: number; status: number };
  user?: User;
}

export default function ContratosPage() {
  const [busca, setBusca] = useState('');
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusSelecionados, setStatusSelecionados] = useState<Record<string, boolean>>({
    '0': true,
    '1': true
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchContratos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/contracts`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Erro ao buscar contratos');
      const data = await response.json();
      setContratos(data.filter((c: Contrato) => c.status.status !== 2));
    } catch (err: any) {
      console.error('Erro ao carregar contratos:', err);
      setError(err.message || 'Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const toggleStatus = (statusId: string) => {
    setStatusSelecionados((prev) => ({
      ...prev,
      [statusId]: !prev[statusId],
    }));
  };

  const getStatusBadgeColor = (valor: number) => {
    if (valor === 1) return 'bg-green-100 text-green-800';
    if (valor === 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusNome = (valor: number) => {
    if (valor === 0) return 'Pendente';
    if (valor === 1) return 'Assinado';
    return 'Desconhecido';
  };

  const contratosFiltrados = contratos.filter((c) => {
    const matchesBusca = c.contract.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = statusSelecionados[c.status.status.toString()] || false;
    return matchesBusca && matchesStatus;
  });

  return (
    <div className={`min-h-screen bg-white flex flex-col ${isMobile ? '' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />
      <main
        className={`p-8 flex-1 transition-margin duration-300 ${
          isMobile ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-black mt-4">Contratos</h1>
        </div>

        <div className="flex gap-2 mb-4 relative">
          <div className="flex items-center bg-[#F3F5F4] rounded-md px-3 py-2 w-full justify-between">
            <input
              type="text"
              placeholder="Buscar contratos..."
              className="bg-transparent outline-none text-sm w-full text-black placeholder-gray-500"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="text-[#C3C3C3] ml-2 h-4" />
          </div>

          <div className="relative">
            <button
              onClick={() => setFiltroAberto(!filtroAberto)}
              className="flex items-center gap-2 bg-[#022028] text-white text-sm px-3 py-2 rounded-md hover:bg-[#033040] transition-colors"
            >
              <FontAwesomeIcon icon={faFilter} className="h-4" />
              Filtros
            </button>

            {filtroAberto && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white text-sm text-black border border-[#DDDDDD] rounded-md shadow-lg z-10 p-3">
                <h4 className="font-semibold mb-2">Status:</h4>
                {[0, 1].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer mb-2 last:mb-0">
                    <input
                      type="checkbox"
                      checked={statusSelecionados[status.toString()] || false}
                      onChange={() => toggleStatus(status.toString())}
                      className="accent-[#022028]"
                    />
                    <span>{getStatusNome(status)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="border border-[#DDDDDD] rounded-md overflow-hidden text-sm">
          <div className="grid grid-cols-[7fr_2fr_2fr] font-bold text-black px-4 py-3 border-b border-[#DDDDDD] bg-[#F3F3F3]">
            <span>Contrato</span>
            <div className="text-center">Status</div>
            <div className="text-center">Ações</div>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-center text-[#555555]">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-[#022028] rounded-full mr-2"></div>
              Carregando contratos...
            </div>
          ) : contratosFiltrados.length > 0 ? (
            contratosFiltrados.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[7fr_2fr_2fr] items-center px-4 py-3 border-b border-[#DDDDDD] hover:bg-gray-50 transition-colors"
              >
                <span className="text-black">{c.contract}</span>
                <div className="text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                      c.status.status
                    )}`}
                  >
                    {getStatusNome(c.status.status)}
                  </span>
                </div>
                <div className="flex justify-center gap-3">
                  {c.status.status === 1 && (
                    <a
                      href={c.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                      title="Visualizar"
                    >
                      <FontAwesomeIcon icon={faEye} className="text-black h-4" />
                    </a>
                  )}
                  {c.status.status === 0 && (
                    <a
                      href={c.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-green-100 rounded transition-colors"
                      title="Assinar"
                    >
                      <FontAwesomeIcon icon={faPenNib} className="text-black h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-[#555555]">
              Nenhum contrato encontrado com os filtros aplicados.
            </div>
          )}
        </div>
         <ChatModal />
      </main>
    </div>
  );
}
