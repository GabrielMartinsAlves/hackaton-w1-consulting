import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

type Status = 'concluido' | 'em_andamento' | 'pendente';

interface EtapaItemProps {
  numero: number;
  titulo: string;
  descricao: string;
  status: Status;
}

const EtapaItem = ({ numero, titulo, descricao, status }: EtapaItemProps) => {
  const bgColor = {
    concluido: 'bg-[#E6F7F8]',
    em_andamento: 'bg-[#F9F9F9] border border-[#FFC857]',
    pendente: 'bg-[#EEEEEE]',
  }[status];

  const icon = {
    concluido: faCheck,
    em_andamento: faSpinner,
    pendente: faClock,
  }[status];

  const iconClass = {
    concluido: 'text-[#5CE1E6]',
    em_andamento: 'text-[#FFC857]',
    pendente: 'text-[#4A5A5A]',
  }[status];

  const statusText = {
    concluido: 'Concluído',
    em_andamento: 'Em Andamento',
    pendente: 'Pendente',
  }[status];

  return (
    <div className={`flex justify-between items-center p-3 rounded-md ${bgColor}`}>
      <div className="flex flex-col">
        <p className="font-bold text-sm text-black">
          {numero}. {titulo}
        </p>
        <p className="text-xs text-[#555555]">{descricao}</p>
      </div>

      <div className="flex flex-col items-end ml-4">
        <div className="flex items-center text-xs text-[#555555]">
          <span>Status</span>
          <FontAwesomeIcon icon={icon} className={`h-4 w-4 ${iconClass} ml-2 ${icon == faSpinner? "animate-spin": ""}`} />
        </div>

        <div className={`text-xs ${iconClass} font-bold mt-1`}>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default EtapaItem;
