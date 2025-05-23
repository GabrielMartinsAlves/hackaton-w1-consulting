'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import EtapaItem from '@/components/EtapaItem';
import ProgressBar from '@/components/ProgressBar';
import jsPDF from 'jspdf';

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
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Número de destino obtido do .env
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'; // Fallback caso a variável não esteja definida

  useEffect(() => {
    function handleResize() {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowWhatsAppForm(false);
        setMessage('');
        setResponse(null);
      }
    };

    if (showWhatsAppForm) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWhatsAppForm]);

  const redirectToLogin = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };


  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${process.env.REACT_PUBLIC_URL_API}/auth/@me`, {
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
      const response = await fetch(`${process.env.REACT_PUBLIC_URL_API}/auth/@me`, {
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
      const response = await fetch(`${process.env.REACT_PUBLIC_URL_API}/steps`, {
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
      const response = await fetch(`${process.env.REACT_PUBLIC_URL_API}/steps`, {
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

  const handleDownloadReport = () => {
    if (!stepData || !userData) {
      alert('Dados não disponíveis para gerar o relatório.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Acompanhamento', 20, 20);

    doc.setFontSize(12);
    doc.text(`Usuário: ${userData.name}`, 20, 40);
    doc.text(`Email: ${userData.email}`, 20, 50);
    doc.text(`Projeto: Holding ${userData.name}`, 20, 60);
    doc.text(`Status Geral: ${getOverallStatus()}`, 20, 70);
    doc.text(`Progresso Total: ${calculateProgress()}%`, 20, 80);

    doc.text('Detalhamento das Etapas:', 20, 100);
    const rows = [
      ['1', 'Cadastro e Diagnóstico Inicial', getStatusString(stepData.registration)],
      ['2', 'Documentação e Análise', getStatusString(stepData.documentation)],
      ['3', 'Estruturação', getStatusString(stepData.structuring)],
      ['4', 'Redação e Finalização', getStatusString(stepData.drafting)],
    ];

    let y = 110;
    rows.forEach((row) => {
      doc.text(`${row[0]}. ${row[1]}: ${row[2]}`, 20, y);
      y += 10;
    });

    doc.save(`relatorio_acompanhamento_${userData.name || 'usuario'}.pdf`);
  };

  const handleSendWhatsApp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_PUBLIC_URL_API}/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: WHATSAPP_NUMBER, message }),
    });
    const data = await res.json();
    setResponse(data.success ? 'Mensagem enviada com sucesso!' : `Erro: ${data.error}`);
    setMessage('');
  };

  const handleCloseWhatsAppForm = () => {
    setShowWhatsAppForm(false);
    setMessage('');
    setResponse(null);
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
    <div className={`min-h-screen bg-white flex ${isMobileOrTablet ? 'flex-col' : 'flex-row'}`} onClick={() => showWhatsAppForm && setShowWhatsAppForm(false)}>
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
              className="bg-[#022028] text-white px-6 py-3 rounded-md text-sm font-semibold"
            >
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
            className="w-full bg-[#022028] text-white px-6 py-3 rounded-md text-sm font-semibold"
          >
            Baixar Relatório
          </button>
        </div>
      )}

      {/* Botão com imagem WhatsApp.svg.webp */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita que o clique no botão feche o formulário
          setShowWhatsAppForm(!showWhatsAppForm);
        }}
        className={`fixed right-4 w-16 h-16 bg-transparent flex items-center justify-center shadow-lg hover:opacity-80 transition ${
          isMobileOrTablet ? 'bottom-20' : 'bottom-4'
        }`}
      >
        <img src="/assets/WhatsApp.svg.webp" alt="WhatsApp" className="w-full h-full object-contain" />
      </button>

      {/* Formulário editável de WhatsApp */}
      {showWhatsAppForm && (
        <div
          ref={formRef}
          className="fixed bottom-20 right-4 bg-white p-5 rounded-lg shadow-lg w-84 z-10"
          onClick={(e) => e.stopPropagation()} // Evita que o clique no formulário feche ele mesmo
        >
          {/* Botão de fechar (X) */}
          <button
            onClick={handleCloseWhatsAppForm}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <form onSubmit={handleSendWhatsApp} className="space-y-4 pt-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="w-full p-2 border rounded h-24"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Enviar
            </button>
          </form>
          {response && (
            <p className="mt-2 text-sm text-center">
              {response}
            </p>
          )}
        </div>
      )}
    </div>
  );
}