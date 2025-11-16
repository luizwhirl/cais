// selo-fiea-frontend/src/pages/AuditsPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileText } from 'lucide-react';
import { AuditsTable } from "../components/AuditsTable";
import { AuditModal, type AuditFormData } from "../components/AuditModal";
import { ParecerModal } from "../components/ParecerModal";


// --- Tipos de Dados ---


// Usuários (Auditores)
export interface User {
  id: number;
  name: string;
}


// Tópicos de Auditoria
export interface AuditTopic {
  id: string;
  title: string;
  description: string;

  // Resposta da Empresa (Autoavaliação)
  companySelfScore: 0 | 1 | 2 | 3 | 4; 
  companyParecer: string;
  // companyFiles: File[]; // (Pode ser adicionado no futuro)

  // Resposta do Auditor
  scoreLevel: 0 | 1 | 2 | 3 | 4; // Nota do auditor
  auditorId: number | null;
  parecer: string; // Parecer do auditor
}


// Auditoria (Entidade Principal)
export interface Audit {
  id: number;
  title: string;
  description: string;
  mainAuditorId: number | null;
  documents: File[];
  topics: AuditTopic[];
  status: 'em_analise' | 'conforme' | 'nao_conforme';
  parecerFinal: string;
}


// --- Dados Mocados (Simulando API) ---


const MOCKED_AUDITORS: User[] = [
  { id: 101, name: 'Odilon Nascimento' },
  { id: 102, name: 'Maria Silva' },
  { id: 103, name: 'Carlos Souza' },
];


export const MOCKED_AUDITS: Audit[] = [
  {
    id: 1,
    title: 'Auditoria de Qualidade ISO 9001 - 2024',
    description: 'Verificação dos processos de qualidade da Indústria X.',
    mainAuditorId: 101,
    documents: [],
    status: 'em_analise',
    topics: [
      { 
        id: 't1', 
        title: 'Controle de Documentos', 
        description: 'Verificar versão e aprovação.', 
        // Resposta Empresa
        companySelfScore: 4, 
        companyParecer: 'Todos os nossos documentos estão na versão 3.0, aprovados pela diretoria, conforme anexo.', 
        // Resposta Auditor
        scoreLevel: 0, 
        auditorId: 102, 
        parecer: '' 
      },
      { 
        id: 't2', 
        title: 'Gestão de Riscos', 
        description: 'Verificar matriz de riscos.', 
        // Resposta Empresa
        companySelfScore: 3,
        companyParecer: 'Matriz de risco atualizada, porém falta aprovação formal da gerência de operações.',
        // Resposta Auditor
        scoreLevel: 0, 
        auditorId: null, 
        parecer: 'Ainda não avaliado.' 
      },
    ],
    parecerFinal: '',
  },
  {
    id: 2,
    title: 'Auditoria Ambiental ISO 14001 - 2024',
    description: 'Verificação de conformidade ambiental.',
    mainAuditorId: 102,
    documents: [],
    status: 'conforme',
    topics: [
        { 
          id: 't3', 
          title: 'Descarte de Resíduos', 
          description: 'Verificar logística reversa.', 
          // Resposta Empresa
          companySelfScore: 4,
          companyParecer: 'Implementamos 100% da logística reversa para todos os resíduos químicos.',
          // Resposta Auditor
          scoreLevel: 4, 
          auditorId: 102, 
          parecer: 'Processo 100% conforme.' 
        }
    ],
    parecerFinal: 'A empresa demonstrou total conformidade com os requisitos ambientais avaliados. Recomendada para certificação.',
  },
  {
    id: 3,
    title: 'Auditoria de Segurança do Trabalho',
    description: 'Análise de NRs.',
    mainAuditorId: 101,
    documents: [],
    status: 'nao_conforme',
    topics: [
        { 
          id: 't4', 
          title: 'Uso de EPIs', 
          description: 'Verificar uso no chão de fábrica.', 
          // Resposta Empresa
          companySelfScore: 2,
          companyParecer: 'Houve falha na distribuição de luvas no setor B, mas já foi corrigido.',
          // Resposta Auditor
          scoreLevel: 1, 
          auditorId: 101, 
          parecer: 'Uso inconsistente de luvas. A falha persiste.' 
        }
    ],
    parecerFinal: 'A auditoria encontrou falhas graves no uso de EPIs, resultando em não conformidade. Ações corretivas são urgentes.',
  },
];


export function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [auditors, setAuditors] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null);


  const [isParecerModalOpen, setIsParecerModalOpen] = useState(false);
  const [auditForParecer, setAuditForParecer] = useState<Audit | null>(null);


  useEffect(() => {
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


  const handleOpenParecerModal = (audit: Audit) => {
    setAuditForParecer(audit);
    setIsParecerModalOpen(true);
  };


  const handleCloseParecerModal = () => {
    setIsParecerModalOpen(false);
    setAuditForParecer(null);
  };


  const handleSaveParecer = (updatedAudit: Audit) => {
    // ! Chamar a API de PUT/PATCH para salvar os pareceres e notas
    setAudits(audits.map(a => a.id === updatedAudit.id ? updatedAudit : a));
    console.log('Salvando pareceres e notas:', updatedAudit);
    handleCloseParecerModal();
  };


  const handleSaveAudit = (formData: AuditFormData) => {
    const { topics, status } = formData;
    let finalStatus = status;


    if (status !== 'em_analise' && topics.length > 0) {
      const totalScore = topics.reduce((acc, topic) => acc + topic.scoreLevel, 0);
      const maxScore = topics.length * 4;
      const percentage = (totalScore / maxScore) * 100;
      finalStatus = percentage >= 75 ? 'conforme' : 'nao_conforme';
    }


    //  Preserva o parecerFinal ao editar, ou inicia vazio ao criar
    const savedAudit: Audit = {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      mainAuditorId: formData.mainAuditorId,
      documents: formData.documents,
      topics: formData.topics.map(t => ({ // Garante que os campos da empresa existam, mesmo que vazios
        ...t,
        companySelfScore: t.companySelfScore || 0,
        companyParecer: t.companyParecer || '',
      })),
      status: finalStatus,
      parecerFinal: editingAudit ? editingAudit.parecerFinal : '',
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
              onParecer={handleOpenParecerModal}
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


      {isParecerModalOpen && auditForParecer && (
        <ParecerModal
          audit={auditForParecer}
          onClose={handleCloseParecerModal}
          onSave={handleSaveParecer}
        />
      )}
    </div>
  );
}