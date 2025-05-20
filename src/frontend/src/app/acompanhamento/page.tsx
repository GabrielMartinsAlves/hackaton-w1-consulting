import HeaderMobile from '@/components/HeaderMobile';
import EtapaItem from '@/components/EtapaItem';
import ProgressBar from '@/components/ProgressBar';

export default function AcompanhamentoPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderMobile />

      <main className="p-4">
        <h1 className="text-xl font-bold text-black mb-4">Acompanhamento</h1>

        <div className="bg-[#F9F9F9] rounded-lg p-4 mb-6">
          <p className="text-xs text-[#555555] mb-1">Projeto</p>
          <h2 className="font-bold text-sm text-black mb-1">Holding Silva Participações</h2>
          <p className="text-xs text-black mb-3">
            Status Geral: <span className="text-[#5CE1E6] font-bold">Em Andamento</span>
          </p>
          <div className="flex items-center justify-between mb-1 text-black">
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
        
        <div className="mt-6 flex justify-center">
          <button className="bg-[#022028] text-white px-6 py-3 rounded-md text-sm font-semibold">
            Baixar Relatório
          </button>
        </div>
      </main>
    </div>
  );
}
