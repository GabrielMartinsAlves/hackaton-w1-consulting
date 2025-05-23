'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function ConfiguracoesPage() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [showNameModal, setShowNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [nome, setNome] = useState('João Silva');
  const [email, setEmail] = useState('joao.silva@email.com');
  const [senha, setSenha] = useState('********');

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    function handleResize() {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    alert('Configurações salvas!');
  };

  const handlePasswordChange = () => {
    if (currentPassword === senha) {
      setSenha(newPassword); 
      setShowPasswordModal(false); 
      setPasswordError(''); 
    } else {
      setPasswordError('A senha atual está incorreta'); 
    }
  };

  return (
    <div className={`min-h-screen bg-[#F3F5F4] flex ${isMobileOrTablet ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main
        className={`p-6 flex-1 transition-margin duration-300 ${
          isMobileOrTablet
            ? ''
            : sidebarExpanded
            ? 'ml-60 p-8'
            : 'ml-20 p-6'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#022028]">Configurações</h1>
        </div>

        <div className="space-y-6 mb-8">
          {/* Nome */}
          <div className="flex justify-between items-center">
            <p className="text-xl text-[#022028] font-semibold">{nome}</p>
            <button onClick={() => setShowNameModal(true)} className="bg-[#5CE1E6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3ec0d3]">
              Mudar Nome
            </button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-[#022028]">E-mail</p>
            <div className="flex items-center">
              <p className="text-sm text-[#555555] mr-2">{email}</p>
              <button onClick={() => setShowEmailModal(true)} className="text-[#5CE1E6] hover:text-[#022028]">
                <FontAwesomeIcon icon={faPen} className="text-lg" />
              </button>
            </div>
          </div>

          <div className={`space-y-4 ${isMobileOrTablet ? '' : 'flex space-x-4'}`}>
            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full h-12 bg-[#5CE1E6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3ec0d3]"
            >
              Mudar E-mail
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full h-12 bg-[#5CE1E6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3ec0d3]"
            >
              Mudar Senha
            </button>
          </div>
        </div>

        {showNameModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Alterar Nome</h2>
              <input
                type="text"
                className="w-full p-3 border border-[#DDDDDD] rounded-md mb-4"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite o novo nome"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setNome(newName);
                    setShowNameModal(false);
                  }}
                  className="bg-[#022028] text-white px-4 py-2 rounded-lg mr-2"
                >
                  Salvar
                </button>
                <button onClick={() => setShowNameModal(false)} className="text-[#555555] px-4 py-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {showEmailModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Alterar E-mail</h2>
              <input
                type="email"
                className="w-full p-3 border border-[#DDDDDD] rounded-md mb-4"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Digite o novo e-mail"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setEmail(newEmail);
                    setShowEmailModal(false);
                  }}
                  className="bg-[#022028] text-white px-4 py-2 rounded-lg mr-2"
                >
                  Salvar
                </button>
                <button onClick={() => setShowEmailModal(false)} className="text-[#555555] px-4 py-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Alterar Senha</h2>
              <input
                type="password"
                className="w-full p-3 border border-[#DDDDDD] rounded-md mb-4"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
              />
              <input
                type="password"
                className="w-full p-3 border border-[#DDDDDD] rounded-md mb-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handlePasswordChange}
                  className="bg-[#022028] text-white px-4 py-2 rounded-lg mr-2"
                >
                  Salvar
                </button>
                <button onClick={() => setShowPasswordModal(false)} className="text-[#555555] px-4 py-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
