'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import EtapaItem from '@/components/EtapaItem';
import ProgressBar from '@/components/ProgressBar';

export default function AcompanhamentoPage() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`min-h-screen bg-white flex ${isMobileOrTablet ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main
        className={`p-8 flex-1 transition-margin duration-300 ${
          isMobileOrTablet
            ? ''
            : sidebarExpanded
            ? 'ml-60'
            : 'ml-20'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-black">Acompanhamento</h1>
          
          {!isMobileOrTablet && (
            <button className="bg-[#022028] text-white px-6 py-3 rounded-md text-sm font-semibold mt-4">
              Baixar Relatório
            </button>
          )}
        </div>

        <div className="bg-[#F9F9F9] rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
            <div>
              <p className="text-xs text-[#555555] mb-1">Projeto</p>
              <h2 className="font-bold text-l text-black mb-1">Holding Silva Participações</h2>
            </div>

            <div
              className={`flex ${isMobileOrTablet ? 'flex-row items-center' : 'flex-col items-baseline'}`}
            >
              <p className={`text-xs text-black ${isMobileOrTablet ? 'mr-1' : ''}`}>
                {isMobileOrTablet ? 'Status Geral:' : 'Status Geral'}
              </p>
              <span
                className={`text-[#5CE1E6] font-bold ${isMobileOrTablet ? 'text-sm' : ''} mt-0 sm:mt-0 sm:ml-2`}
              >
                Em Andamento
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1 text-black mt-4">
            <span className="text-xs font-bold">Progresso Total</span>
            <span className="text-l font-bold">60%</span>
          </div>

          <ProgressBar percentage={60} />
        </div>

        <h2 className="text-md font-semibold text-black mb-2">Detalhamento das Etapas</h2>
        <div className="flex flex-col gap-2">
          <EtapaItem
            numero={1}
            titulo="Cadastro e Diagnóstico Inicial"
            descricao="Coleta de informações e documentos básicos"
            status="concluido"
          />
          <EtapaItem
            numero={2}
            titulo="Documentação e Análise"
            descricao="Análise dos documentos e definição da estratégia"
            status="concluido"
          />
          <EtapaItem
            numero={3}
            titulo="Estruturação da Holding"
            descricao="Definição da estrutura societária e patrimonial"
            status="em_andamento"
          />
          <EtapaItem
            numero={4}
            titulo="Elaboração de Contratos"
            descricao="Contrato social e acordos de acionistas"
            status="pendente"
          />
        </div>

        {isMobileOrTablet && (
          <div className="mt-8 flex justify-center">
            <button className="bg-[#022028] text-white px-6 py-3 rounded-md text-sm font-semibold">
              Baixar Relatório
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
