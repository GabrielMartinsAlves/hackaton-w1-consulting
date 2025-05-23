import React from 'react';

interface EtapaItemProps {
  numero: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'negado';
}

const EtapaItem: React.FC<EtapaItemProps> = ({ numero, titulo, descricao, status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'concluido':
        return {
          bgColor: 'bg-[#E0F7FA]',
          borderColor: 'border-[#5CE1E6]',
          textColor: 'text-[#5CE1E6]',
          statusText: 'Concluído',
          iconColor: 'text-[#5CE1E6]'
        };
      case 'em_andamento':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-400',
          textColor: 'text-yellow-600',
          statusText: 'Em Andamento',
          iconColor: 'text-yellow-500'
        };
      case 'negado':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-400',
          textColor: 'text-red-600',
          statusText: 'Negado',
          iconColor: 'text-red-500'
        };
      default: // pendente
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-500',
          statusText: 'Pendente',
          iconColor: 'text-gray-400'
        };
    }
  };

  const config = getStatusConfig();

  const renderStatusIcon = () => {
    switch (status) {
      case 'concluido':
        return (
          <svg className={`w-5 h-5 ${config.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'em_andamento':
        return (
          <svg className={`w-5 h-5 ${config.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'negado':
        return (
          <svg className={`w-5 h-5 ${config.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default: // pendente
        return (
          <svg className={`w-5 h-5 ${config.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded-r-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full border-2 border-gray-300 text-xs font-bold text-gray-600">
              {numero}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900">{titulo}</h3>
            <p className="text-xs text-gray-500 mt-1">{descricao}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.statusText}
          </span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default EtapaItem;