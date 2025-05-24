'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Documento {
  nome: string;
  status: 'aprovado' | 'pendente' | 'negado';
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  documentos?: Documento[]; 
}

export default function UsuariosPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [busca, setBusca] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const token = localStorage.getItem('token');
        const consultantId = localStorage.getItem('consultantId');

        if (!token || !consultantId) {
          throw new Error('Consultor não autenticado');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/consultant-clients/consultants/${consultantId}/clients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Erro ao buscar usuários');

        const data = await response.json();
        setUsuarios(data);
      } catch (error: any) {
        setErro(error.message || 'Erro ao buscar usuários');
      } finally {
        setCarregando(false);
      }
    }

    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleClick = (usuario: Usuario) => {
    localStorage.setItem('usuarioId', usuario.id.toString());
    router.push('/user'); // redireciona para a tela fixa
  };

  return (
    <div className={`bg-[#F3F5F4] min-h-screen flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />
      <main className={`p-8 flex-1 transition-margin duration-300 ${isMobile ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'}`}>
        <h1 className="text-3xl font-bold text-[#022028] mb-8">Clientes do Consultor</h1>

        <div className="flex items-center bg-white rounded-md px-4 py-2 w-full justify-between mb-6 shadow-sm">
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="bg-transparent outline-none text-sm w-full text-[#022028] placeholder-[#555555]"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="text-[#022028] ml-2 h-5 w-5" />
        </div>

        {carregando ? (
          <p className="text-[#022028]">Carregando...</p>
        ) : erro ? (
          <p className="text-red-500">{erro}</p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className="text-[#022028]">Nenhum usuário encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {usuariosFiltrados.map((usuario) => (
              <div
                key={usuario.id}
                onClick={() => handleClick(usuario)}
                className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform"
              >
                <h2 className="text-xl font-semibold text-[#022028] mb-1">{usuario.nome}</h2>
                <p className="text-sm text-[#555555]">{usuario.email}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
