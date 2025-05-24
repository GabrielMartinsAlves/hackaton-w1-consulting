'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import WhatsAppQRCode from '@/components/WhatsAppQRCode';

export default function ConfiguracoesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [userId, setUserId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isConsultor, setIsConsultor] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');

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
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_BASE}/auth/@me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Erro ao buscar usuário');
        const data = await res.json();
        setNome(data.name);
        setEmail(data.email);
        setSenha('********');
        setUserId(data.id);
        setIsConsultor(data.isConsultant);
      })
      .catch((err) => setApiError(err.message));
  }, []);

  const updateUser = async (
    fields: { name?: string; email?: string; password?: string },
    closeModal: () => void
  ) => {
    if (!userId) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.details) {
          setApiError(result.details.map((d: any) => d.message).join(', '));
        } else {
          setApiError(result.error || 'Erro ao atualizar usuário');
        }
        return;
      }

      if (fields.name) setNome(fields.name);
      if (fields.email) setEmail(fields.email);
      if (fields.password) setSenha('********');

      setApiError('');
      closeModal();
    } catch (err: any) {
      setApiError('Erro ao atualizar usuário: ' + err.message);
    }
  };

  const handlePasswordChange = () => {
    if (currentPassword !== senha) {
      setPasswordError('A senha atual está incorreta');
      return;
    }
    updateUser({ password: newPassword }, () => setShowPasswordModal(false));
    setPasswordError('');
  };

  return (
    <div className={`min-h-screen bg-[#F3F5F4] flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
      <Sidebar onExpandChange={setSidebarExpanded} />

      <main
        className={`w-full px-4 md:px-8 py-8 flex-1 transition-margin duration-300 ${
          sidebarExpanded && !isMobile ? 'md:ml-60' : 'md:ml-20'
        }`}
      >
        <h1 className="text-3xl font-bold text-[#022028] mb-8">Configurações</h1>

        {apiError && <p className="text-red-600 mb-4">{apiError}</p>}

        <div className="bg-white w-full rounded-xl shadow-xl p-6 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#555555] mb-1">Nome</p>
              <p className="text-lg text-[#022028] font-semibold">{nome}</p>
            </div>
            <button onClick={() => setShowNameModal(true)} className="text-[#5CE1E6] hover:text-[#022028]">
              <FontAwesomeIcon icon={faPen} className="text-lg" />
            </button>
          </div>
        </div>
        <div className="bg-white w-full rounded-xl shadow-xl p-6 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#555555] mb-1">E-mail</p>
              <p className="text-lg text-[#022028] font-semibold">{email}</p>
            </div>
            <button onClick={() => setShowEmailModal(true)} className="text-[#5CE1E6] hover:text-[#022028]">
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
              onClick={() => setShowPasswordModal(true)}
              className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded-md font-semibold hover:bg-[#3ec0d3] transition"
            >
              Mudar Senha
            </button>
          </div>
        </div>

        {isConsultor && (
          <div className="bg-white w-full rounded-xl shadow-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#022028] mb-4">Conectar ao WhatsApp</h2>
            <WhatsAppQRCode />
          </div>
        )}

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
            onClose={() => setShowEmailModal(false)}
            onSave={() => updateUser({ email: newEmail }, () => setShowEmailModal(false))}
          />
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-sm">
            <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <FontAwesomeIcon icon={faTimes} onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-[#5CE1E6] cursor-pointer" />
              <h2 className="text-xl font-semibold text-[#022028] mb-4">Alterar Senha</h2>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Senha atual"
                className="w-full border border-gray-300 p-3 rounded mb-3"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha"
                className="w-full border border-gray-300 p-3 rounded mb-3"
              />
              {passwordError && <p className="text-sm text-red-600 mb-2">{passwordError}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={handlePasswordChange} className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded font-semibold">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Modal({ title, value, onChange, placeholder, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-sm">
      <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
        <FontAwesomeIcon icon={faTimes} onClick={onClose} className="absolute top-4 right-4 text-[#5CE1E6] hover:text-[#3ec0d3] cursor-pointer" />
        <h2 className="text-xl font-semibold text-[#022028] mb-4">{title}</h2>
        <input
          type="text"
          className="w-full border border-gray-300 p-3 rounded mb-4"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onSave} className="bg-[#5CE1E6] text-[#022028] px-4 py-2 rounded font-semibold">Salvar</button>
        </div>
      </div>
    </div>
  );
}
