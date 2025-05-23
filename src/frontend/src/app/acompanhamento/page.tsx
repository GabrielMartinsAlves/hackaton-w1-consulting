'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import EtapaItem from '@/components/EtapaItem';
import ProgressBar from '@/components/ProgressBar';

interface StepData {
  id: number;
  user_id: number;
  registration: number;
  documentation: number;
  structuring: number;
  drafting: number;
}

interface UserData {
  name: string;
  email: string;
}

export default function AcompanhamentoPage() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [stepData, setStepData] = useState<StepData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleResize() {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const redirectToLogin = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const getApiUrl = () => process.env.REACT_PUBLIC_URL_API || 'http://localhost:3001/api';

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/@me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        redirectToLogin();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      redirectToLogin();
      return false;
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/@me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else if (response.status === 401) {
        console.error('Token inválido ao buscar dados do usuário');
        redirectToLogin();
      } else {
        console.error('Erro ao buscar dados do usuário:', response.status);
        setUserData({ name: 'Usuário', email: 'usuario@email.com' });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setUserData({ name: 'Usuário', email: 'usuario@email.com' });
    }
  };

  const fetchStepData = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/steps`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setStepData(data[0]);
        } else {
          await createInitialSteps(token);
        }
      } else if (response.status === 401) {
        redirectToLogin();
      } else {
        await createInitialSteps(token);
      }
    } catch (error) {
      await createInitialSteps(token);
    }
  };

  const createInitialSteps = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/steps`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration: 0,
          documentation: 0,
          structuring: 0,
          drafting: 0,
        }),
      });

      if (response.ok) {
        const newStepData = await response.json();
        setStepData(newStepData);
      } else if (response.status === 401) {
        redirectToLogin();
      } else {
        setStepData({
          id: 0,
          user_id: 0,
          registration: 0,
          documentation: 0,
          structuring: 0,
          drafting: 0,
        });
      }
    } catch (error) {
      setStepData({
        id: 0,
        user_id: 0,
        registration: 0,
        documentation: 0,
        structuring: 0,
        drafting: 0,
      });
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        redirectToLogin();
        return;
      }

      try {
        const isValidToken = await validateToken(token);
        if (isValidToken) {
          await fetchUserData(token);
          await fetchStepData(token);
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
      }

      setLoading(false);
    };

    initializeData();
  }, []);

  const getStatusString = (statusNumber: number): string => {
    switch (statusNumber) {
      case 0:
        return 'pendente';
      case 1:
        return 'em_andamento';
      case 2:
        return 'concluido';
      case 3:
        return 'negado';
      default:
        return 'pendente';
    }
  };

  const getStatusDisplayName = (statusNumber: number): string => {
    switch (statusNumber) {
      case 0:
        return 'Pendente';
      case 1:
        return 'Em Andamento';
      case 2:
        return 'Concluído';
      case 3:
        return 'Negado';
      default:
        return 'Pendente';
    }
  };

  const calculateProgress = (): number => {
    if (!stepData) return 0;

    const steps = [
      stepData.registration,
      stepData.documentation,
      stepData.structuring,
      stepData.drafting,
    ];

    const completedSteps = steps.filter((step) => step === 2).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getOverallStatus = (): string => {
    if (!stepData) return 'Pendente';

    const steps = [
      stepData.registration,
      stepData.documentation,
      stepData.structuring,
      stepData.drafting,
    ];

    const hasNegado = steps.some((step) => step === 3);
    const hasEmAndamento = steps.some((step) => step === 1);
    const allCompleted = steps.every((step) => step === 2);

    if (hasNegado) return 'Pendências';
    if (allCompleted) return 'Concluído';
    if (hasEmAndamento) return 'Em Andamento';
    return 'Pendente';
  };

  // FUNÇÃO ATUALIZADA: gera e baixa o relatório em PDF
  const handleDownloadReport = async () => {
    if (!stepData || !userData) {
      alert('Dados não disponíveis para gerar o relatório.');
      return;
    }

    try {
      // Carrega a biblioteca jsPDF dinamicamente
      const { default: jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      
      // Configurações do documento
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let yPosition = 30;
      
      // Título do relatório
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Relatório de Acompanhamento', margin, yPosition);
      
      yPosition += 20;
      
      // Informações do usuário
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Informações do Projeto:', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Projeto: Holding ${userData.name}`, margin, yPosition);
      
      yPosition += 8;
      doc.text(`Usuário: ${userData.name}`, margin, yPosition);
      
      yPosition += 8;
      doc.text(`Email: ${userData.email}`, margin, yPosition);
      
      yPosition += 8;
      doc.text(`Status Geral: ${getOverallStatus()}`, margin, yPosition);
      
      yPosition += 8;
      doc.text(`Progresso Total: ${calculateProgress()}%`, margin, yPosition);
      
      yPosition += 8;
      doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
      
      yPosition += 25;
      
      // Detalhamento das etapas
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Detalhamento das Etapas:', margin, yPosition);
      
      yPosition += 15;
      
      const etapas = [
        {
          numero: 1,
          titulo: 'Cadastro e Diagnóstico Inicial',
          descricao: 'Coleta de informações e documentos básicos.',
          status: stepData.registration
        },
        {
          numero: 2,
          titulo: 'Documentação e Análise',
          descricao: 'Análise dos documentos e definição da estratégia.',
          status: stepData.documentation
        },
        {
          numero: 3,
          titulo: 'Estruturação',
          descricao: 'Preparação e organização dos processos.',
          status: stepData.structuring
        },
        {
          numero: 4,
          titulo: 'Redação e Finalização',
          descricao: 'Elaboração dos documentos finais.',
          status: stepData.drafting
        }
      ];
      
      etapas.forEach((etapa) => {
        // Verifica se precisa de nova página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${etapa.numero}. ${etapa.titulo}`, margin, yPosition);
        
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(`Descrição: ${etapa.descricao}`, margin + 5, yPosition);
        
        yPosition += 8;
        doc.text(`Status: ${getStatusDisplayName(etapa.status)}`, margin + 5, yPosition);
        
        yPosition += 15;
      });
      
      // Salva o PDF
      const fileName = `relatorio_acompanhamento_${userData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o relatório PDF. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#022028] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white flex ${isMobileOrTablet ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main
        className={`p-8 flex-1 transition-margin duration-300 ${
          isMobileOrTablet ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-black">Acompanhamento</h1>

          {!isMobileOrTablet && (
            <button
              onClick={handleDownloadReport}
              className="bg-[#022028] hover:bg-[#033642] text-white px-6 py-3 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-2"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 15L7 10H10V3H14V10H17L12 15Z" 
                  fill="currentColor"
                />
                <path 
                  d="M20 18H4V20H20V18Z" 
                  fill="currentColor"
                />
              </svg>
              Baixar Relatório
            </button>
          )}
        </div>

        <div className="bg-[#F9F9F9] rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
            <div>
              <p className="text-xs text-[#555555] mb-1">Projeto</p>
              <h2 className="font-bold text-l text-black mb-1">
                {userData?.name ? `Holding ${userData.name}` : 'Carregando...'}
              </h2>
            </div>

            <div className={`flex ${isMobileOrTablet ? 'flex-row items-center' : 'flex-col items-baseline'}`}>
              <p className={`text-xs text-black ${isMobileOrTablet ? 'mr-1' : ''}`}>
                {isMobileOrTablet ? 'Status Geral:' : 'Status Geral'}
              </p>
              <span
                className={`font-bold ${isMobileOrTablet ? 'text-sm' : ''} mt-0 sm:mt-0 sm:ml-2 ${
                  getOverallStatus() === 'Concluído'
                    ? 'text-[#5CE1E6]'
                    : getOverallStatus() === 'Em Andamento'
                    ? 'text-yellow-500'
                    : getOverallStatus() === 'Pendências'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {getOverallStatus()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1 text-black mt-4">
            <span className="text-xs font-bold">Progresso Total</span>
            <span className="text-l font-bold">{calculateProgress()}%</span>
          </div>

          <ProgressBar percentage={calculateProgress()} />
        </div>

        <h2 className="text-md font-semibold text-black mb-2">Detalhamento das Etapas</h2>
        <div className="flex flex-col gap-2 mb-20">
          {stepData && (
            <>
              <EtapaItem
                numero={1}
                titulo="Cadastro e Diagnóstico Inicial"
                descricao="Coleta de informações e documentos básicos."
                status={getStatusString(stepData.registration)}
              />
              <EtapaItem
                numero={2}
                titulo="Documentação e Análise"
                descricao="Análise dos documentos e definição da estratégia."
                status={getStatusString(stepData.documentation)}
              />
              <EtapaItem
                numero={3}
                titulo="Estruturação"
                descricao="Preparação e organização dos processos."
                status={getStatusString(stepData.structuring)}
              />
              <EtapaItem
                numero={4}
                titulo="Redação e Finalização"
                descricao="Elaboração dos documentos finais."
                status={getStatusString(stepData.drafting)}
              />
            </>
          )}
        </div>
      </main>

      {isMobileOrTablet && (
        <div className="fixed bottom-4 left-4 right-4">
          <button
            onClick={handleDownloadReport}
            className="w-full bg-[#022028] hover:bg-[#033642] text-white px-6 py-3 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 15L7 10H10V3H14V10H17L12 15Z" 
                fill="currentColor"
              />
              <path 
                d="M20 18H4V20H20V18Z" 
                fill="currentColor"
              />
            </svg>
            Baixar Relatório
          </button>
        </div>
      )}
    </div>
  );
}