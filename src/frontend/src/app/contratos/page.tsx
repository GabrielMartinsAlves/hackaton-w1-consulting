'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ContratoRow from '@/components/ContratoRow';
import AdicionarPatrimonioDropdown from '@/components/AdicionarPatrimonioDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

interface Contrato {
  nome: string;
  status: 'ok' | 'pendente' | 'erro';
  acao: 'ver' | 'editar' | 'caneta';
}

export default function ContratosPage() {
  const [busca, setBusca] = useState('');
  const [filtroAberto, setFiltroAberto] = useState(false);
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

  const [statusSelecionados, setStatusSelecionados] = useState<Record<string, boolean>>({
    ok: true,
    pendente: true,
    erro: true,
  });

  const contratos: Contrato[] = [
    { nome: 'Contrato Imóvel X', status: 'ok', acao: 'ver' },
    { nome: 'Contrato Automóvel X', status: 'ok', acao: 'ver' },
    { nome: 'Contrato Serviços', status: 'pendente', acao: 'caneta' },
    { nome: 'Handshake', status: 'erro', acao: 'editar' },
  ];

  const toggleStatus = (status: string) => {
    setStatusSelecionados((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const contratosFiltrados = contratos.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) &&
      statusSelecionados[c.status]
  );

  return (
    <div className={`min-h-screen bg-white flex flex-col ${isMobile ? '' : 'flex-row'}`}>
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
        <h1 className="text-xl font-bold text-black mb-4">Contratos</h1>

        <div className="flex gap-2 mb-4 relative">
          <div className="flex items-center bg-[#F3F5F4] rounded-md px-3 py-2 w-full justify-between">
            <input
              type="text"
              className="bg-transparent outline-none text-sm w-full text-black"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="text-[#C3C3C3] ml-2 h-4" />
          </div>

          <div className="relative">
            <button
              onClick={() => setFiltroAberto(!filtroAberto)}
              className="flex items-center gap-2 bg-[#022028] text-white text-sm px-3 py-2 rounded-md"
            >
              <FontAwesomeIcon icon={faFilter} className="h-4" />
              Filtros
            </button>

            {filtroAberto && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white text-sm text-black border border-[#DDDDDD] rounded-md shadow z-10 p-2">
                {(['ok', 'pendente', 'erro'] as const).map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer mb-1 last:mb-0"
                  >
                    <input
                      type="checkbox"
                      checked={statusSelecionados[status]}
                      onChange={() => toggleStatus(status)}
                      className="accent-[#022028]"
                    />
                    <span>
                      {status === 'ok'
                        ? 'Ok'
                        : status === 'pendente'
                        ? 'Pendente'
                        : 'Erro'}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <AdicionarPatrimonioDropdown />
        </div>

        <div className="border border-[#DDDDDD] rounded-md overflow-hidden text-sm">
          <div className="grid grid-cols-[7fr_2fr_2fr] font-bold text-black px-4 py-3 border-b border-[#DDDDDD] bg-[#F3F3F3]">
            <span>Contrato</span>
            <div className="text-center">Status</div>
            <div className="text-right">Ações</div>
          </div>

          {contratosFiltrados.length > 0 ? (
            contratosFiltrados.map((c, idx) => (
              <ContratoRow key={idx} nome={c.nome} status={c.status} acao={c.acao} />
            ))
          ) : (
            <div className="px-4 py-6 text-center text-[#555555]">
              Nenhum contrato encontrado.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
