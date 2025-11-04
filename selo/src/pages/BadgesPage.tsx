// selo-fiea-frontend/src/pages/BadgesPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ShieldAlert } from 'lucide-react';
import { BadgesTable } from "../components/BadgesTable"; 
import { DynamicForm } from "../components/DynamicForm";
import badgeIcon from '/badge.jpg';
import { MOCKED_CRITERIA } from "./CriteriaPage";

// Tipos para os dados (TypeScript)
export interface Badge {
  id: number;
  name: string;
  description: string;
  validadeMeses: number;
  dataInicioEmissao: Date;
  dataFimEmissao: Date;
  icon: string; 
  criteria: string[]; // Critérios para obter o selo
}

// Dados mocados para simular a API
const MOCKED_BADGES: Badge[] = [
  { 
    id: 1, 
    name: 'Selo FIEA 2025', 
    description: 'Concedido a empresas com excelência em gestão, sustentabilidade ambiental e inovação tecnológica.',
    validadeMeses: 12,
    dataInicioEmissao: new Date('2025-01-01'),
    dataFimEmissao: new Date('2025-12-31'),
    icon: badgeIcon,
    criteria: ['Qualidade', 'Sustentabilidade', 'Inovação Tecnológica'] 
  },
];

export function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

  // Simula a busca de dados da API quando a página carrega
  useEffect(() => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    // ! Substituir com chamadas reais à API (Ex: fetch('/api/badges'))
    setBadges(MOCKED_BADGES);
  }, []);

  const handleOpenModal = (badge: Badge | null) => {
    setEditingBadge(badge); // Se for null, é para criar. Se tiver dados, é para editar.
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBadge(null);
  };

  const handleSaveBadge = (badgeToSave: Badge) => {
    // ! Chamar a API de POST (criar) ou PUT (atualizar)
    if (editingBadge) { // Atualizando
      setBadges(badges.map(b => b.id === badgeToSave.id ? badgeToSave : b));
      console.log('Atualizando selo:', badgeToSave);
    } else { // Criando
      const newBadge = { ...badgeToSave, id: Math.max(0, ...badges.map(b => b.id)) + 1 }; // Simula a geração de um ID
      setBadges([...badges, newBadge]);
       console.log('Criando novo selo:', newBadge);
    }
    handleCloseModal();
  };

  const handleDeleteBadge = (badgeId: number) => {
    // ! Chamar a API de DELETE
    if (window.confirm("Tem certeza que deseja deletar este selo?")) {
      setBadges(badges.filter(b => b.id !== badgeId));
      console.log('Deletando selo com ID:', badgeId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
              <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:underline">← Voltar para o Dashboard</Link>
              <h1 className="text-3xl font-bold text-gray-800 mt-2">Gerenciar Selos</h1>
              <p className="text-gray-600 mt-1">Crie e edite os tipos de selos que podem ser concedidos.</p>
          </div>
       </header>

       <main className="container mx-auto px-6 py-8">
          <div className="flex justify-end mb-6">
              <button 
                onClick={() => handleOpenModal(null)}
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
              >
                  <PlusCircle size={20} className="mr-2"/>
                  Criar Novo Selo
              </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {badges.length > 0 ? (
                <BadgesTable 
                    badges={badges}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteBadge}
                />
            ) : (
                <div className="text-center py-12">
                    <ShieldAlert size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700">Nenhum selo encontrado</h3>
                    <p className="mt-1 text-gray-500">Comece criando um novo selo.</p>
                </div>
            )}
          </div>
       </main>

       {isModalOpen && (
          <DynamicForm
            badge={editingBadge}
            allCriteria={MOCKED_CRITERIA}
            onClose={handleCloseModal}
            onSave={handleSaveBadge}
          />
       )}
    </div>
  );
}
