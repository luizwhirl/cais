// selo-fiea-frontend/src/pages/ProfilesPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ShieldAlert } from 'lucide-react';
import { ProfileModal } from "../components/ProfileModal";
import { ProfilesTable } from "../components/ProfilesTable";

// tipos para os dados (TypeScript)
export interface Permission {
  id: string;
  description: string;
}

export interface Profile {
  id: number;
  name: string;
  description: string;
  permissions: string[]; // array de ids de permissões
}

// dados mocados para simular a API
const MOCKED_PROFILES: Profile[] = [
  { id: 1, name: 'Gestor', description: 'Acesso total ao sistema.', permissions: ['manage_profiles', 'manage_users', 'view_reports'] },
  { id: 2, name: 'Auditor', description: 'Acesso para realizar auditorias.', permissions: ['view_reports'] },
];

const MOCKED_PERMISSIONS: Permission[] = [
  { id: 'manage_profiles', description: 'Gerenciar Perfis de Acesso' },
  { id: 'manage_users', description: 'Gerenciar Usuários' },
  { id: 'view_reports', description: 'Visualizar Relatórios' },
  { id: 'submit_documents', description: 'Submeter Documentos' },
];


export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // simula a busca de dados da API quando a página carrega
  useEffect(() => {
    // ! substituir com chamadas reais à API
    // Ex: fetch('/api/profiles').then(...)
    // Ex: fetch('/api/permissions').then(...)
    setProfiles(MOCKED_PROFILES);
    setPermissions(MOCKED_PERMISSIONS);
  }, []);

  const handleOpenModal = (profile: Profile | null) => {
    setEditingProfile(profile); // Se for null, é para criar. Se tiver dados, é para editar.
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProfile(null);
  };

  const handleSaveProfile = (profileToSave: Profile) => {
    // ! chamar a API de POST (criar) ou PUT (atualizar)
    if (editingProfile) { // Atualizando
      setProfiles(profiles.map(p => p.id === profileToSave.id ? profileToSave : p));
      console.log('Atualizando perfil:', profileToSave);
    } else { // Criando
      const newProfile = { ...profileToSave, id: Math.max(...profiles.map(p => p.id)) + 1 }; // Simula a geração de um ID
      setProfiles([...profiles, newProfile]);
       console.log('Criando novo perfil:', newProfile);
    }
    handleCloseModal();
  };

  const handleDeleteProfile = (profileId: number) => {
    // ! Chamar a API de DELETE
    if (window.confirm("Tem certeza que deseja deletar este perfil?")) {
      setProfiles(profiles.filter(p => p.id !== profileId));
      console.log('Deletando perfil com ID:', profileId);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
       <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
              <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:underline">← Voltar para o Dashboard</Link>
              <h1 className="text-3xl font-bold text-gray-800 mt-2">Gerenciar Perfis de Acesso</h1>
              <p className="text-gray-600 mt-1">Crie e edite os perfis para garantir as permissões adequadas.</p>
          </div>
       </header>

       <main className="container mx-auto px-6 py-8">
          <div className="flex justify-end mb-6">
              <button 
                onClick={() => handleOpenModal(null)}
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
              >
                  <PlusCircle size={20} className="mr-2"/>
                  Criar Novo Perfil
              </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {profiles.length > 0 ? (
                <ProfilesTable 
                    profiles={profiles}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteProfile}
                />
            ) : (
                <div className="text-center py-12">
                    <ShieldAlert size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700">Nenhum perfil encontrado</h3>
                    <p className="mt-1 text-gray-500">Comece criando um novo perfil de acesso.</p>
                </div>
            )}
          </div>
       </main>

       {isModalOpen && (
          <ProfileModal
            profile={editingProfile}
            allPermissions={permissions}
            onClose={handleCloseModal}
            onSave={handleSaveProfile}
          />
       )}
    </div>
  );
}