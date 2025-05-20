'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AdicionarPatrimonioDropdown() {
  const [open, setOpen] = useState(false);

  const opcoes = ['Imóvel', 'Automóvel', 'Bens financeiros', 'Outro'];

  return (
    <div className="relative w-full max-w-sm">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full bg-[#022028] text-white text-sm font-normal px-4 py-3 flex items-center justify-center relative ${
          open ? 'rounded-t-md rounded-b-none' : 'rounded-md'
        }`}
      >
        <FontAwesomeIcon icon={faPlus} className="absolute left-6 h-4 w-4 text-white text-[22px]" />
        Adicionar Patrimônio
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full bg-[#022028] text-white text-sm rounded-b-md border-t border-[#DDDDDD] z-10 overflow-hidden">
          {opcoes.map((opcao, idx) => (
            <div key={idx} className="px-4 text-left">
              <div
                className={`pt-3 px-4 ${
                  idx === opcoes.length - 1 ? 'pb-3' : 'pb-1'
                }`}
              >
                {opcao}
              </div>
              {idx < opcoes.length - 1 && (
                <div className="w-[95%] h-px bg-[#5CE1E6] mx-auto" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
