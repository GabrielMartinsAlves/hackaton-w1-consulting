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
    em_andamento: 'text-[#FFC857] animate-spin',
    pendente: 'text-[#4A5A5A]',
  }[status];

  return (
    <div className={`flex justify-between items-center p-3 rounded-md ${bgColor}`}>
      <div>
        <p className="font-bold text-sm text-black">
          {numero}. {titulo}
        </p>
        <p className="text-xs text-[#555555]">{descricao}</p>
      </div>
      <FontAwesomeIcon icon={icon} className={`h-4 w-4 ${iconClass}`} />
    </div>
  );
};

export default EtapaItem;
