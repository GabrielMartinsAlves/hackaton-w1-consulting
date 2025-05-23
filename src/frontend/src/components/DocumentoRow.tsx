'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye as faEyeRegular } from '@fortawesome/free-regular-svg-icons';
import { faPen, faPenToSquare as faPenToSquareRegular } from '@fortawesome/free-solid-svg-icons';
import StatusIcon from './StatusIcon';
import { useState, useEffect } from 'react';

type StatusType = 'ok' | 'pendente' | 'erro';

interface Props {
  nome: string;
  status: StatusType;
  acao: string;
}

export default function DocumentoRow({ nome, status, acao }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    function checkDesktop() {
      setIsDesktop(window.innerWidth > 1024);
    }
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const actionLabel = {
    ver: 'Visualizar',
    editar: 'Editar',
    caneta: 'Assinar',
  };

  const statusStyles = {
    ok: {
      textColor: 'text-[#5CE1E6]',
      bgColor: 'bg-[#E6F7F8]',
      label: 'Aprovado',
    },
    pendente: {
      textColor: 'text-[#FF9933]',
      bgColor: 'bg-[#FFF4E6]',
      label: 'Pendente',
    },
    erro: {
      textColor: 'text-[#E15554]',
      bgColor: 'bg-[#FFE9E6]',
      label: 'Negado',
    },
  } as const;

  return (
    <div className="grid grid-cols-[7fr_2fr_2fr] items-center text-sm px-4 py-4 border-t border-[#DDDDDD] bg-white text-black">
      <span>{nome}</span>

      <div className="flex justify-center">
        {isDesktop ? (
          <span
            className={`px-2 py-1 rounded-full font-semibold text-xs ${statusStyles[status].textColor} ${statusStyles[status].bgColor}`}
          >
            {statusStyles[status].label}
          </span>
        ) : (
          <StatusIcon status={status} />
        )}
      </div>

      <div className={isDesktop ? 'flex justify-center' : 'flex justify-end'}>
        {isDesktop ? (
          <span className="text-[#5CE1E6] font-semibold cursor-pointer select-none">
            {actionLabel[acao as keyof typeof actionLabel]}
          </span>
        ) : (
          <FontAwesomeIcon
            icon={
              {
                ver: faEyeRegular,
                editar: faPenToSquareRegular,
                caneta: faPen,
              }[acao as keyof typeof actionLabel] || faEyeRegular
            }
            className="text-[18px] text-black"
          />
        )}
      </div>
    </div>
  );
}
