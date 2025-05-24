'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Usuario {
    nome: string;
    email: string;
    documentos: { nome: string; status: 'aprovado' | 'pendente' | 'negado' }[]; // Documentos com status
}

export default function UsuariosPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [busca, setBusca] = useState('');
    const [usuarios, setUsuarios] = useState<Usuario[]>([
        {
            nome: 'João Silva',
            email: 'joao.silva@email.com',
            documentos: [
                { nome: 'Contrato Social', status: 'aprovado' },
                { nome: 'Declaração Fiscal', status: 'negado' },
            ],
        },
        {
            nome: 'Maria Oliveira',
            email: 'maria.oliveira@email.com',
            documentos: [
                { nome: 'Balanço Patrimonial', status: 'pendente' },
                { nome: 'Contrato de Trabalho', status: 'aprovado' },
            ],
        },
        {
            nome: 'Carlos Souza',
            email: 'carlos.souza@email.com',
            documentos: [{ nome: 'Acordo de Sociedade', status: 'pendente' }],
        },
        {
            nome: 'Ana Pereira',
            email: 'ana.pereira@email.com',
            documentos: [],
        },
    ]);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 1024); 
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const countStatus = (documentos: { nome: string; status: 'aprovado' | 'pendente' | 'negado' }[]) => {
        const statusCount = { aprovado: 0, pendente: 0, negado: 0 };
        documentos.forEach((doc) => {
            if (doc.status === 'aprovado') statusCount.aprovado++;
            if (doc.status === 'pendente') statusCount.pendente++;
            if (doc.status === 'negado') statusCount.negado++;
        });
        return statusCount;
    };

    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className={` bg-[#F3F5F4] min-h-screen flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <Sidebar onExpandChange={setSidebarExpanded} />

            <main
                className={`p-8 flex-1 transition-margin duration-300 ${isMobile ? '' : sidebarExpanded ? 'ml-60' : 'ml-20'
                    }`}
            >
                <h1 className="text-3xl font-bold text-[#022028] mb-8">Usuários do Consultor</h1>

                <div className="flex items-center bg-white rounded-md px-4 py-2 w-full justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Buscar usuários..."
                        className="bg-transparent outline-none text-sm w-full text-[#022028] placeholder-[#5555555]"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faSearch} className="text-[#022028] ml-2 h-5 w-5" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {usuariosFiltrados.map((usuario) => {
                        const statusCount = countStatus(usuario.documentos);

                        return (
                            <div
                                key={usuario.nome}
                                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer"
                            >
                                <div className="flex flex-col items-center">
                                    <h2 className="text-xl font-semibold text-[#022028] mb-2">{usuario.nome}</h2>
                                    <p className="text-sm text-[#555555] mb-4">{usuario.email}</p>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-[#022028] mb-2">Documentos</h3>
                                        <ul className="space-y-2">
                                            <li className="text-sm text-[#022028] flex justify-between items-center">
                                                <span>Aprovados:</span> <span>{statusCount.aprovado}</span>
                                            </li>
                                            <li className="text-sm text-[#022028] flex justify-between items-center">
                                                <span>Em Análise:</span> <span>{statusCount.pendente}</span>
                                            </li>
                                            <li className="text-sm text-[#022028] flex justify-between items-center">
                                                <span>Negados:</span> <span>{statusCount.negado}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
