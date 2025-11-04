// selo-fiea-frontend/src/pages/SelfAssessmentPage.tsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Badge } from './BadgesPage';
import badgeIcon from '/badge.jpg';
import { ChevronLeft, ChevronRight, Save, Send, UploadCloud } from 'lucide-react';

// --- Interfaces ---

// A resposta para um critério específico
interface AssessmentAnswer {
  criterion: string;
  responseText: string;
  // O 'documents' está aqui, mas a lógica de upload não foi implementada por simplicidade
  documents: File[]; 
}

// O objeto principal da autoavaliação
interface SelfAssessment {
  id: string;
  badgeId: number;
  status: 'draft' | 'submitted';
  answers: AssessmentAnswer[];
}

// --- Dados Mocados (Simulando API) ---
const MOCKED_BADGES: Badge[] = [
  { 
    id: 1, 
    name: 'Selo FIEA de Excelência', 
    description: 'Concedido a empresas com excelência em gestão, sustentabilidade ambiental e inovação tecnológica.',
    validadeMeses: 12,
    dataInicioEmissao: new Date('2023-01-01'),
    dataFimEmissao: new Date('2023-12-31'),
    icon: badgeIcon,
    // Critérios que virarão os "passos"
    criteria: [
      'Qualidade de Gestão', 
      'Sustentabilidade Ambiental', 
      'Inovação Tecnológica', 
      'Saúde e Segurança Ocupacional'
    ] 
  },
];
// (Em um app real, teríamos MOCKED_BADGES em um arquivo compartilhado)


export function SelfAssessmentPage() {
  const { badgeId } = useParams();
  const navigate = useNavigate();

  const [badge, setBadge] = useState<Badge | null>(null);
  const [assessment, setAssessment] = useState<SelfAssessment | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // Index do critério atual
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Carrega o selo e o rascunho salvo (se houver)
  useEffect(() => {
    setIsLoading(true);
    const numericId = Number(badgeId);
    // ! Simula API: Busca o selo
    const foundBadge = MOCKED_BADGES.find(b => b.id === numericId);

    if (!foundBadge) {
      // Lidar com selo não encontrado
      navigate('/industry/dashboard'); // Volta pro dashboard
      return;
    }
    setBadge(foundBadge);

    // ! Simula API/Storage: Busca rascunho salvo no localStorage
    const draftKey = `assessment_draft_${numericId}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      setAssessment(JSON.parse(savedDraft));
    } else {
      // Cria uma nova autoavaliação vazia baseada nos critérios
      const newAssessment: SelfAssessment = {
        id: `draft_${numericId}`,
        badgeId: numericId,
        status: 'draft',
        answers: foundBadge.criteria.map(criterion => ({
          criterion: criterion,
          responseText: '',
          documents: [],
        })),
      };
      setAssessment(newAssessment);
    }
    setIsLoading(false);
  }, [badgeId, navigate]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!assessment) return;

    const newAnswers = [...assessment.answers];
    newAnswers[currentStep].responseText = e.target.value;

    setAssessment({
      ...assessment,
      answers: newAnswers,
    });
    setSaveStatus('idle'); // Reseta o status de salvo ao digitar
  };

  // (A lógica de upload de arquivo real seria mais complexa)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Arquivos selecionados:", e.target.files);
    // Aqui entraria a lógica para atualizar assessment.answers[currentStep].documents
    // e possivelmente fazer upload para um S3 ou similar.
  };

  // --- Funções de Navegação e Ação ---

  const nextStep = () => {
    if (assessment && currentStep < assessment.answers.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Requisito: "uma autoavaliação pode ser salva para ser completada depois."
  const handleSaveDraft = () => {
    if (!assessment || !badge) return;
    setSaveStatus('saving');
    const draftKey = `assessment_draft_${badge.id}`;
    localStorage.setItem(draftKey, JSON.stringify(assessment));
    
    // Simula o salvamento
    setTimeout(() => {
      setSaveStatus('saved');
    }, 1000);
  };

  // Requisito: "a auto avaliação so será submetida quando todos os critérios forem respondidos."
  const allCriteriaAnswered = assessment?.answers.every(a => a.responseText.trim() !== '') ?? false;

  const handleSubmit = () => {
    if (!assessment || !badge || !allCriteriaAnswered) return;

    if (window.confirm("Tem certeza que deseja submeter esta autoavaliação? Após o envio, ela não poderá ser editada.")) {
      setIsLoading(true);
      
      const finalAssessment = { ...assessment, status: 'submitted' };
      
      // ! Simula API: Enviar para o back-end
      console.log("Enviando avaliação final:", finalAssessment);
      
      // Limpa o rascunho do localStorage
      localStorage.removeItem(`assessment_draft_${badge.id}`);
      
      // (Opcional: salvar a submetida no mock do dashboard)
      // localStorage.setItem(`assessment_submitted_${badge.id}`, JSON.stringify(finalAssessment));

      setTimeout(() => {
        navigate('/industry/dashboard');
      }, 1500);
    }
  };

  // --- Renderização ---

  if (isLoading || !assessment || !badge) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  const currentCriterion = assessment.answers[currentStep];
  const totalSteps = assessment.answers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to="/industry/dashboard" className="text-sm font-semibold text-blue-600 hover:underline">← Voltar para o Portal</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">{badge.name}</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
          {/* Stepper / Progresso */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-700">PASSO {currentStep + 1} DE {totalSteps}</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">{currentCriterion.criterion}</h2>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Campo de Resposta */}
            <div className="mb-6">
              <label htmlFor="responseText" className="block text-sm font-medium text-gray-700 mb-2">
                Descreva as práticas, processos ou evidências da sua indústria relacionadas a este critério.
              </label>
              <textarea
                id="responseText"
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua resposta aqui..."
                value={currentCriterion.responseText}
                onChange={handleTextChange}
              />
            </div>

            {/* Campo de Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anexar Evidências (Opcional)
              </label>
              <label htmlFor="doc-upload" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <UploadCloud className="h-10 w-10 text-gray-400" />
                <span className="mt-2 text-sm font-semibold text-blue-600">Clique para enviar arquivos</span>
                <span className="text-xs text-gray-500">PDF, DOCX, PNG, ou JPG</span>
              </label>
              <input id="doc-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
              {/* (Aqui entraria a lista de arquivos anexados) */}
            </div>

            <hr className="my-6" />

            {/* Navegação e Ações */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Navegação */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="font-semibold text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === totalSteps - 1}
                  className="font-semibold text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Próximo
                  <ChevronRight size={20} className="ml-1" />
                </button>
              </div>
              
              {/* Ações */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saveStatus === 'saving'}
                  className="font-semibold text-blue-700 bg-blue-100 py-2 px-4 rounded-lg hover:bg-blue-200 disabled:opacity-50 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {saveStatus === 'saving' ? 'Salvando...' : (saveStatus === 'saved' ? 'Salvo!' : 'Salvar Rascunho')}
                </button>
              </div>
            </div>
            
            {/* Botão de Submissão Final (só aparece no último passo) */}
            {currentStep === totalSteps - 1 && (
              <div className="mt-8 border-t pt-6 text-center">
                <button
                  type="button"
                   onClick={handleSubmit}
                  disabled={!allCriteriaAnswered || isLoading}
                  className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  <Send size={20} className="mr-2" />
                  {isLoading ? 'Enviando...' : 'Submeter Avaliação Final'}
                </button>
                {!allCriteriaAnswered && (
                  <p className="text-red-600 text-sm mt-3">
                    Você deve preencher as respostas de todos os {totalSteps} critérios antes de submeter.
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}