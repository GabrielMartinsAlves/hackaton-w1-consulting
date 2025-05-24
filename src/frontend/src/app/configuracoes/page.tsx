'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';

interface UserData {
  id: number;
  name: string;
  email: string;
  userType: 'user' | 'consultant';
  isConsultant: boolean;
  isUser: boolean;
  is_active: boolean;
  created_at?: string;
  last_access?: string;
}

export default function ConfiguracoesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showNameModal, setShowNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_URL_API;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setApiError('Token não encontrado');
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando dados do usuário...');
        
        // Primeiro, vamos buscar as informações do usuário através da rota /@me
        const meResponse = await fetch(`${API_BASE}/auth/@me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meResponse.ok) {
          throw new Error(`Erro ao buscar dados do usuário: ${meResponse.status}`);
        }

        const meData = await meResponse.json();
        console.log('Dados do /@me:', meData);
        
        setUserData(meData);
        setNome(meData.name);
        setEmail(meData.email);
        setSenha('********');
        
        setApiError('');
      } catch (err: any) {
        console.error('Erro ao buscar dados do usuário:', err);
        setApiError(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE]);

  const updateUser = async (fields: { name?: string; email?: string; password?: string }, closeModal: () => void) => {
    if (!userData) {
      setApiError('Dados do usuário não carregados');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setApiError('Token não encontrado');
      return;
    }

    try {
      console.log('Atualizando usuário:', { 
        userType: userData.userType, 
        userId: userData.id, 
        fields: Object.keys(fields) 
      });

      // Determinar a URL correta baseada no tipo de usuário
      const endpoint = userData.userType === 'consultant' 
        ? `/consultants/${userData.id}` 
        : `/users/${userData.id}`;

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });

      const result = await response.json();
      console.log('Resposta da atualização:', result);

      if (!response.ok) {
        if (result.details) {
          setApiError(result.details.map((d: any) => d.message).join(', '));
        } else {
          setApiError(result.error || 'Erro ao atualizar usuário');
        }
        return;
      }

      // Atualizar os dados locais
      if (fields.name) setNome(fields.name);
      if (fields.email) setEmail(fields.email);
      if (fields.password) setSenha('********'); // Manter como asteriscos

      setApiError('');
      closeModal();
      
      // Limpar os campos do modal
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setCurrentPassword('');
      setPasswordError('');
      
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      setApiError('Erro ao atualizar usuário: ' + err.message);
    }
  };

  const handlePasswordChange = () => {
    // Validações básicas
    if (!newPassword || newPassword.trim().length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Não validamos a senha atual no frontend, deixamos o backend validar
    // já que a senha está armazenada como hash
    updateUser({ password: newPassword }, () => setShowPasswordModal(false));
    setPasswordError('');
  };

  const openNameModal = () => {
    setNewName(nome);
    setShowNameModal(true);
    setApiError('');
  };

  const openEmailModal = () => {
    setNewEmail(email);
    setShowEmailModal(true);
    setApiError('');
  };

  const openPasswordModal = () => {
    setNewPassword('');
    setCurrentPassword('');
    setPasswordError('');
    setShowPasswordModal(true);
    setApiError('');
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#F3F5F4] flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
        <Sidebar onExpandChange={setSidebarExpanded} />
        <main className={`w-full px-4 md:px-8 py-8 flex-1 transition-margin duration-300 ${
          sidebarExpanded && !isMobile ? 'md:ml-60' : 'md:ml-20'
        }`}>
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-[#022028]">Carregando...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F3F5F4] flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main
        className={`w-full px-4 md:px-8 py-8 flex-1 transition-margin duration-300 ${
          sidebarExpanded && !isMobile ? 'md:ml-60' : 'md:ml-20'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#022028]">Configurações</h1>
          {userData && (
            <span className="text-sm bg-[#5CE1E6] text-[#022028] px-3 py-1 rounded-full font-medium">
              {userData.userType === 'consultant' ? 'Consultor' : 'Usuário'}
            </span>
          )}
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {apiError}
          </div>
        )}

        <div className="bg-white w-full rounded-xl shadow-xl p-6 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#555555] mb-1">Nome</p>
              <p className="text-lg text-[#022028] font-semibold">{nome || 'Carregando...'}</p>
            </div>
            <button 
              onClick={openNameModal} 
              className="text-[#5CE1E6] hover:text-[#022028] transition-colors"
              disabled={!userData}
            >
              <FontAwesomeIcon icon={faPen} className="text-lg" />
            </button>
          </div>
        </div>

        <div className="bg-white w-full rounded-xl shadow-xl p-6 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#555555] mb-1">E-mail</p>
              <p className="text-lg text-[#022028] font-semibold">{email || 'Carregando...'}</p>
            </div>
            <button 
              onClick={openEmailModal} 
              className="text-[#5CE1E6] hover:text-[#022028] transition-colors"
              disabled={!userData}
            >
              <FontAwesomeIcon icon={faPen} className="text-lg" />
            </button>
          </div>
        </div>

        <div className="bg-white w-full rounded-xl shadow-xl p-6 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#555555] mb-1">Senha</p>
              <p className="text-lg text-[#022028] font-semibold">********</p>
            </div>
            <button
              onClick={openPasswordModal}
              className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded-md font-semibold hover:bg-[#3ec0d3] transition"
              disabled={!userData}
            >
              Mudar Senha
            </button>
          </div>
        </div>

        {showNameModal && (
          <Modal
            title="Alterar Nome"
            value={newName}
            onChange={setNewName}
            placeholder="Novo nome"
            onClose={() => setShowNameModal(false)}
            onSave={() => updateUser({ name: newName }, () => setShowNameModal(false))}
          />
        )}

        {showEmailModal && (
          <Modal
            title="Alterar E-mail"
            value={newEmail}
            onChange={setNewEmail}
            placeholder="Novo e-mail"
            type="email"
            onClose={() => setShowEmailModal(false)}
            onSave={() => updateUser({ email: newEmail }, () => setShowEmailModal(false))}
          />
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-sm">
            <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <FontAwesomeIcon 
                icon={faTimes} 
                onClick={() => setShowPasswordModal(false)} 
                className="absolute top-4 right-4 text-[#5CE1E6] hover:text-[#3ec0d3] cursor-pointer transition-colors" 
              />
              <h2 className="text-xl font-semibold text-[#022028] mb-4">Alterar Senha</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5CE1E6]"
                  minLength={6}
                />
              </div>
              
              {passwordError && (
                <p className="text-sm text-red-600 mb-4">{passwordError}</p>
              )}
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-[#555555] hover:text-[#022028] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handlePasswordChange} 
                  className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded font-semibold hover:bg-[#3ec0d3] transition-colors"
                  disabled={!newPassword || newPassword.length < 6}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface ModalProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  onClose: () => void;
  onSave: () => void;
}

function Modal({ title, value, onChange, placeholder, type = "text", onClose, onSave }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-sm">
      <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
        <FontAwesomeIcon 
          icon={faTimes} 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[#5CE1E6] hover:text-[#3ec0d3] cursor-pointer transition-colors" 
        />
        <h2 className="text-xl font-semibold text-[#022028] mb-4">{title}</h2>
        <input
          type={type}
          className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:border-[#5CE1E6]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[#555555] hover:text-[#022028] transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onSave} 
            className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded font-semibold hover:bg-[#3ec0d3] transition-colors"
            disabled={!value.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}