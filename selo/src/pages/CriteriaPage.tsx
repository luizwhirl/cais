import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { CriterionForm } from "../components/CriterionModal";

// Tipos para os dados
export type Pilar = 'Qualidade' | 'Sustentabilidade' | 'Inovação Tecnológica';

export interface Criterion {
  id: number;
  pilar: Pilar;
  descricao: string;
  peso: number;
}

const PILARES: Pilar[] = ['Qualidade', 'Sustentabilidade', 'Inovação Tecnológica'];

// Dados mocados para simular a API
export const MOCKED_CRITERIA: Criterion[] = [
  { id: 1, pilar: 'Qualidade', descricao: 'A empresa possui certificação ISO 9001?', peso: 3 },
  { id: 2, pilar: 'Qualidade', descricao: 'Os processos de produção são documentados e seguidos rigorosamente?', peso: 2 },
  { id: 3, pilar: 'Sustentabilidade', descricao: 'A empresa possui um programa de reciclagem de resíduos?', peso: 3 },
  { id: 4, pilar: 'Inovação Tecnológica', descricao: 'A empresa investe em novas tecnologias para otimização de processos?', peso: 1 },
];

export function CriteriaPage() {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);

  useEffect(() => {
    // ! Substituir com chamadas reais à API
    setCriteria(MOCKED_CRITERIA);
  }, []);

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCriterion(null);
  };

  const handleSaveCriterion = (criterionToSave: Omit<Criterion, 'id'> & { id?: number }) => {
    if (criterionToSave.id) { // Atualizando
      setCriteria(criteria.map(c => c.id === criterionToSave.id ? { ...criterionToSave, id: c.id } as Criterion : c));
      console.log('Atualizando critério:', { ...criterionToSave, id: criterionToSave.id });
    } else { // Criando
      const newCriterion = { ...criterionToSave, id: Math.max(0, ...criteria.map(c => c.id)) + 1 };
      setCriteria([...criteria, newCriterion]);
      console.log('Criando novo critério:', newCriterion);
    }
    handleCancel();
  };

  const handleDeleteCriterion = (criterionId: number) => {
    if (window.confirm("Tem certeza que deseja deletar este critério?")) {
      setCriteria(criteria.filter(c => c.id !== criterionId));
      console.log('Deletando critério com ID:', criterionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:underline">← Voltar para o Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Gerenciar Critérios de Avaliação</h1>
          <p className="text-gray-600 mt-1">Adicione, edite ou remova os critérios que podem ser utilizados nos selos.</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Criar Novo Critério
          </button>
        </div>

        <div className="space-y-8">
          {PILARES.map(pilar => {
            const pilarCriteria = criteria.filter(c => c.pilar === pilar);
            return (
              <div key={pilar} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">{pilar}</h2>
                {pilarCriteria.length > 0 ? ( 
                  <ul className="space-y-3">
                    {pilarCriteria.map(criterion => (
                        <li key={criterion.id} className="flex justify-between items-center p-3 rounded-md bg-gray-50 border">
                          <div className="flex-1">
                            <p className="text-gray-800">{criterion.descricao}</p>
                            <span className="text-sm text-gray-500">Peso: {criterion.peso}</span>
                          </div>
                          <div className="flex items-center space-x-4 ml-4">
                            <button onClick={() => setEditingCriterion(criterion)} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit size={20} /></button>
                            <button onClick={() => handleDeleteCriterion(criterion.id)} className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={20} /></button>
                          </div>
                        </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <ShieldAlert size={32} className="mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Nenhum critério para este pilar.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {(isCreating || editingCriterion) && (
        <CriterionForm
          criterion={editingCriterion}
          onSave={handleSaveCriterion}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
