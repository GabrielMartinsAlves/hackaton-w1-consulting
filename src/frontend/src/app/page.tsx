// src/app/acompanhamento/page.tsx

import React from 'react';
import HeaderMobile from '@/components/HeaderMobile';

const AcompanhamentoPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header mobile fixo no topo */}
      <HeaderMobile />

      {/* Conteúdo da página */}
      <main className="p-4 mt-4">
        <h1 className="text-xl font-bold text-gray-800">Acompanhamento</h1>

        <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-xs text-gray-600">Projeto</p>
          <h2 className="text-md font-semibold">Holding Silva Participações</h2>
          <p className="text-sm text-gray-700">
            Status Geral: <span className="text-cyan-600 font-semibold">Em Andamento</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AcompanhamentoPage;
