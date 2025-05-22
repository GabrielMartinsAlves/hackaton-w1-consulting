'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  faBars,
  faSignInAlt,
  faChartBar,
  faFolder,
  faFileContract,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HeaderMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: faChartBar, label: 'Acompanhamento', path: '/acompanhamento' },
    { icon: faFolder, label: 'Documentos', path: '/documentos' },
    { icon: faFileContract, label: 'Contratos', path: '/contratos' },
    { icon: faCog, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <div className="relative bg-[#022028] text-white px-4 py-4 flex items-center justify-between">
      <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
        <FontAwesomeIcon icon={faBars} className="text-[#5CE1E6] h-5 w-5" />
      </button>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/">
          <Image src="/assets/w1_white.png" alt="Logo" width={34} height={17} />
        </Link>
      </div>

      <FontAwesomeIcon icon={faSignInAlt} className="text-[#5CE1E6] h-5 w-5" />

      {menuOpen && (
        <div className="absolute top-full left-0 bg-[#022028] shadow-md z-50 w-46 rounded-br-md">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition ${
                  isActive
                    ? 'bg-[#5CE1E6] text-black'
                    : 'text-white hover:bg-[#5CE1E6] hover:text-black'
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-4 w-4 ${
                    isActive ? 'text-[#022028]' : 'text-[#5CE1E6]'
                  }`}
                />
                <span className={isActive ? 'text-black' : 'text-white'}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeaderMobile;
