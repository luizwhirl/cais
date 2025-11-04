// selo-fiea-frontend/src/pages/IndustryDashboardPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, CheckCircle, Edit, Award } from 'lucide-react';
import type { Badge } from './BadgesPage'; // Reutilizando a interface
import badgeIcon from '/badge.jpg'; // Reutilizando o ícone mockado

// --- Tipos de Dados (Simplificado para este fluxo) ---
interface SelfAssessment {
  id: string;
  badgeId: number;
  badgeName: string;
  status: 'draft' | 'submitted';
  progress: number; // Percentual de conclusão (ex: 3 de 5 critérios = 60)
}

// --- Dados Mocados (Simulando API) ---
// Reutilizando os selos que podem ser inscritos
const MOCKED_BADGES: Badge[] = [
  { 
    id: 1, 
    name: 'Selo FIEA de Excelência', 
    description: 'Concedido a empresas com excelência em gestão, sustentabilidade ambiental e inovação tecnológica.',
    validadeMeses: 12,
    dataInicioEmissao: new Date('2023-01-01'),
    dataFimEmissao: new Date('2023-12-31'),
    icon: badgeIcon,
    criteria: ['Qualidade de Gestão', 'Sustentabilidade Ambiental', 'Inovação Tecnológica', 'Saúde e Segurança'] 
  },
  // Adicionar mais selos aqui se necessário
];

// Simulando autoavaliações salvas ou submetidas
// (Em um app real, isso viria do localStorage ou API)
const MOCKED_ASSESSMENTS: SelfAssessment[] = [
  { id: 'draft_1', badgeId: 1, badgeName: 'Selo FIEA de Excelência', status: 'draft', progress: 50 },
];

export function IndustryDashboardPage() {
  const [myAssessments, setMyAssessments] = useState<SelfAssessment[]>([]);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // ! Substituir com chamadas reais à API
    // 1. Buscar selos disponíveis para inscrição
    setAvailableBadges(MOCKED_BADGES);

    // 2. Buscar minhas autoavaliações (em rascunho ou submetidas)
    // Aqui, estamos apenas carregando o mock.
    // Em uma implementação real, verificaríamos o localStorage
    // ou faríamos um fetch para /api/my-assessments
    setMyAssessments(MOCKED_ASSESSMENTS);
  }, []);

  const drafts = myAssessments.filter(a => a.status === 'draft');
  const submitted = myAssessments.filter(a => a.status === 'submitted');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simples da Indústria */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Portal da Indústria</h1>
          <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">Sair</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Bem-vindo, Gestor da Indústria!</h2>

        {/* 1. Minhas Autoavaliações */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Minhas Autoavaliações</h3>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {/* Rascunhos */}
            {drafts.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-yellow-700">Em Andamento (Rascunhos)</h4>
                {drafts.map(draft => (
                  <Link
                    key={draft.id}
                    to={`/industry/assessment/${draft.badgeId}`}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 mb-2"
                  >
                    <div>
                      <p className="font-bold">{draft.badgeName}</p>
                      <p className="text-sm text-gray-600">Progresso: {draft.progress}%</p>
                    </div>
                    <span className="flex items-center text-blue-600 font-semibold">
                      <Edit size={16} className="mr-2" />
                      Continuar
                    </span>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Submetidas */}
            {submitted.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-2 text-green-700">Submetidas (Em Análise)</h4>
                {submitted.map(sub => (
                  <div key={sub.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 mb-2">
                    <p className="font-bold">{sub.badgeName}</p>
                    <span className="flex items-center text-green-600 font-semibold">
                      <CheckCircle size={16} className="mr-2" />
                      Enviado
                    </span>
                  </div>
                ))}
              </div>
            )}

            {drafts.length === 0 && submitted.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText size={40} className="mx-auto mb-2" />
                <p>Nenhuma autoavaliação iniciada.</p>
              </div>
            )}
          </div>
        </section>

        {/* 2. Selos Disponíveis */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Inscrever-se para um Selo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBadges.map(badge => (
              <div key={badge.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col">
                <div className="flex items-center mb-4">
                  <img src={badge.icon} alt={badge.name} className="h-12 w-12 rounded-full mr-4" />
                  <h4 className="text-xl font-bold text-gray-800">{badge.name}</h4>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{badge.description}</p>
                <Link
                  to={`/industry/assessment/${badge.id}`}
                  className="w-full text-center bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
                >
                  <PlusCircle size={20} className="mr-2" />
                  Iniciar Autoavaliação
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}