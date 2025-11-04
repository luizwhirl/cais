// selo-fiea-frontend/src/pages/AuditsPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileText } from 'lucide-react';
import { AuditsTable } from "../components/AuditsTable";
import { AuditModal, type AuditFormData } from "../components/AuditModal";

// --- Tipos de Dados ---

// Usuários (Auditores)
export interface User {
  id: number;
  name: string;
}

// Tópicos de Auditoria (HU 07, 08, 10)
export interface AuditTopic {
  id: string; // Pode ser um UUID ou ID numérico do banco
  title: string;
  description: string;
  scoreLevel: 0 | 1 | 2 | 3 | 4; // Pontuação de Nível 0 a 4
  auditorId: number | null; // HU 08 - Responsável pelo tópico
}

// Auditoria (Entidade Principal)
export interface Audit {
  id: number;
  title: string;
  description: string;
  mainAuditorId: number | null; // HU 08 - Responsável total
  documents: File[]; // HU 07 e 09
  topics: AuditTopic[];
  status: 'em_analise' | 'conforme' | 'nao_conforme'; // HU 10
}

// --- Dados Mocados (Simulando API) ---

const MOCKED_AUDITORS: User[] = [
  { id: 101, name: 'Odilon Nascimento' },
  { id: 102, name: 'Maria Silva' },
  { id: 103, name: 'Carlos Souza' },
];

const MOCKED_AUDITS: Audit[] = [
  {
    id: 1,
    title: 'Auditoria de Qualidade ISO 9001 - 2024',
    description: 'Verificação dos processos de qualidade da Indústria X.',
    mainAuditorId: 101,
    documents: [],
    status: 'em_analise',
    topics: [
      { id: 't1', title: 'Controle de Documentos', description: 'Verificar versão e aprovação.', scoreLevel: 0, auditorId: 102 },
      { id: 't2', title: 'Gestão de Riscos', description: 'Verificar matriz de riscos.', scoreLevel: 0, auditorId: null },
    ],
  },
];

export function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [auditors, setAuditors] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null);

  useEffect(() => {
    // ! Substituir com chamadas reais à API
    setAudits(MOCKED_AUDITS);
    setAuditors(MOCKED_AUDITORS);
  }, []);

  const handleOpenModal = (audit: Audit | null) => {
    setEditingAudit(audit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAudit(null);
  };

  // HU 10 - Regra de Consolidação de Nota
  const handleSaveAudit = (formData: AuditFormData) => {
    const { topics, status } = formData;
    let finalStatus = status;

    // A regra de 75% só se aplica se o status for mudado de "Em Análise"
    if (status !== 'em_analise' && topics.length > 0) {
      // A regra de "nível 3 inclui 1 e 2" é interpretada como:
      // A pontuação É o nível.
      const totalScore = topics.reduce((acc, topic) => acc + topic.scoreLevel, 0);
      const maxScore = topics.length * 4; // Máximo é Nível 4 por tópico
      
      const percentage = (totalScore / maxScore) * 100;
      
      finalStatus = percentage >= 75 ? 'conforme' : 'nao_conforme';
      
      // Se o usuário marcou "Conforme" mas a nota foi < 75%, o sistema força "Não Conforme"
      // (e vice-versa, se marcou Não Conforme mas a nota foi >= 75, o sistema força Conforme)
    }

    const savedAudit: Audit = {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      mainAuditorId: formData.mainAuditorId,
      documents: formData.documents,
      topics: formData.topics,
      status: finalStatus,
    };

    // ! Chamar a API de POST (criar) ou PUT (atualizar)
    if (editingAudit) { 
      setAudits(audits.map(a => a.id === savedAudit.id ? savedAudit : a));
      console.log('Atualizando auditoria:', savedAudit);
    } else { 
      const newAudit = { ...savedAudit, id: Math.max(0, ...audits.map(a => a.id)) + 1 };
      setAudits([...audits, newAudit]);
      console.log('Criando nova auditoria:', newAudit);
    }
    handleCloseModal();
  };

  const handleDeleteAudit = (auditId: number) => {
    // ! Chamar a API de DELETE
    if (window.confirm("Tem certeza que deseja deletar esta auditoria?")) {
      setAudits(audits.filter(a => a.id !== auditId));
      console.log('Deletando auditoria com ID:', auditId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:underline">← Voltar para o Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Gerenciar Auditorias</h1>
          <p className="text-gray-600 mt-1">Crie e acompanhe os processos de auditoria das indústrias.</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => handleOpenModal(null)}
            className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Criar Nova Auditoria
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          {audits.length > 0 ? (
            <AuditsTable
              audits={audits}
              users={auditors}
              onEdit={handleOpenModal}
              onDelete={handleDeleteAudit}
            />
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-700">Nenhuma auditoria encontrada</h3>
              <p className="mt-1 text-gray-500">Comece criando um novo processo de auditoria.</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <AuditModal
          audit={editingAudit}
          allAuditors={auditors}
          onClose={handleCloseModal}
          onSave={handleSaveAudit}
        />
      )}
    </div>
  );
}