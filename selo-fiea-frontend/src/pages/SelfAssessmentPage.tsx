// selo-fiea-frontend/src/pages/SelfAssessmentPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Badge } from './BadgesPage';
import badgeIcon from '/badge.jpg';
import { ChevronLeft, ChevronRight, Save, Send, Star } from 'lucide-react';
// Importa o *tipo* Criterion, mas não mais os dados
import type { Criterion } from './CriteriaPage'; 
import { FileUploader } from '../components/FileUploader';

// --- Interfaces ---

// A resposta para um critério específico
interface AssessmentAnswer {
  criterion: string;
  responseText: string;
  documents: File[];
}

// O objeto principal da autoavaliação
interface SelfAssessment {
  id: string;
  badgeId: number;
  status: 'draft' | 'submitted';
  answers: AssessmentAnswer[];
}

// --- DADOS MOCADOS (COM NOVA PONTUAÇÃO LOCAL) ---

// Definição local dos critérios com a pontuação de 9 pontos totais
const MOCKED_CRITERIA: Criterion[] = [
  { id: 1, pilar: 'Qualidade', descricao: 'A empresa possui certificação ISO 9001?', peso: 2 },
  { id: 2, pilar: 'Qualidade', descricao: 'Os processos de produção são documentados e seguidos rigorosamente?', peso: 2 },
  { id: 3, pilar: 'Sustentabilidade', descricao: 'A empresa possui um programa de reciclagem de resíduos?', peso: 2 },
  { id: 4, pilar: 'Inovação Tecnológica', descricao: 'A empresa investe em novas tecnologias para otimização de processos?', peso: 3 },
]; // Total: 2 + 2 + 2 + 3 = 9 pontos

// (Dados ajustados para usar os critérios de CriteriaPage.tsx)
const MOCKED_BADGES: Badge[] = [
  { 
    id: 1, 
    name: 'Selo FIEA de Excelência', 
    description: 'Concedido a empresas com excelência em gestão, sustentabilidade ambiental e inovação tecnológica.',
    validadeMeses: 12,
    dataInicioEmissao: new Date('2023-01-01'),
    dataFimEmissao: new Date('2023-12-31'),
    icon: badgeIcon,
    // Critérios que virarão os "passos" (Baseado no MOCKED_CRITERIA local)
    criteria: [
      MOCKED_CRITERIA[0].descricao, // 'A empresa possui certificação ISO 9001?'
      MOCKED_CRITERIA[1].descricao, // 'Os processos de produção são documentados e seguidos rigorosamente?'
      MOCKED_CRITERIA[2].descricao, // 'A empresa possui um programa de reciclagem de resíduos?'
      MOCKED_CRITERIA[3].descricao, // 'A empresa investe em novas tecnologias para otimização de processos?'
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
  // Estado para buscar os pesos (usando a constante local)
  const [allCriteria] = useState(MOCKED_CRITERIA);

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
    const savedDraftJson = localStorage.getItem(draftKey);
    
    let savedDraft: SelfAssessment | null = null;
    if (savedDraftJson) {
        try {
            // Para um rascunho real, precisaríamos de uma lógica mais complexa
            // para armazenar metadados de arquivos (nome, tipo) e talvez
            // exigi-los novamente no envio.
            // Por simplicidade, vamos assumir que os arquivos são perdidos ao recarregar um rascunho.
            savedDraft = JSON.parse(savedDraftJson);
            // Limpa os arquivos do rascunho salvo, já que não podemos recriá-los
            if (savedDraft) {
                savedDraft.answers.forEach(a => a.documents = []); 
            }
        } catch (e) {
            console.error("Falha ao carregar rascunho:", e);
            localStorage.removeItem(draftKey); // Limpa rascunho corrompido
        }
    }

    if (savedDraft) {
      setAssessment(savedDraft);
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

  // Atualiza os arquivos para o passo (critério) atual
  const handleFilesChange = (newFiles: File[]) => {
    if (!assessment) return;

    const newAnswers = [...assessment.answers];
    newAnswers[currentStep].documents = newFiles;

    setAssessment({
      ...assessment,
      answers: newAnswers,
    });
    setSaveStatus('idle');
  };


  // --- Funções de Navegação e Ação ---

  const nextStep = () => {
    if (assessment && currentStep < assessment.answers.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Requisito: "uma autoavaliação pode ser salva para ser completada depois."
  const handleSaveDraft = () => {
    if (!assessment || !badge) return;
    setSaveStatus('saving');
    
    // ATENÇÃO: JSON.stringify não salva objetos File.
    // Criamos uma cópia "serializável" sem os arquivos.
    const serializableAssessment = {
        ...assessment,
        answers: assessment.answers.map(a => ({
            criterion: a.criterion,
            responseText: a.responseText,
            documents: [] // Os arquivos não são salvos no rascunho
        }))
    };
    const draftKey = `assessment_draft_${badge.id}`;
    localStorage.setItem(draftKey, JSON.stringify(serializableAssessment));
    
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
      // Em uma API real, usaríamos FormData para enviar os arquivos.
      console.log("Enviando avaliação final:", finalAssessment);
      
      // Limpa o rascunho do localStorage
      localStorage.removeItem(`assessment_draft_${badge.id}`);
      
      setTimeout(() => {
        navigate('/industry/dashboard');
      }, 1500);
    }
  };

  // --- Renderização ---

  // --- LÓGICA DA PONTUAÇÃO TOTAL ---
  const { totalScoreAcquired, totalPossibleScore } = useMemo(() => {
    if (!assessment) {
      return { totalScoreAcquired: 0, totalPossibleScore: 0 };
    }

    let acquired = 0;
    let possible = 0;

    // Itera sobre todas as respostas da avaliação
    assessment.answers.forEach(answer => {
      // Encontra o critério correspondente na lista de critérios mocados
      const criterionData = allCriteria.find(c => c.descricao === answer.criterion);
      // Pega o peso (pontuação) desse critério. Se não achar, é 0.
      const weight = criterionData?.peso ?? 0;

      // O total possível é a soma de todos os pesos
      possible += weight; 

      // O total adquirido só soma se o campo de texto da resposta NÃO estiver vazio
      if (answer.responseText.trim() !== '') {
        acquired += weight;
      }
    });

    return { totalScoreAcquired: acquired, totalPossibleScore: possible };
  }, [assessment, allCriteria]); // Recalcula quando a avaliação (respostas) ou critérios mudarem
  // --- FIM DA LÓGICA ---


  if (isLoading || !assessment || !badge) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  const currentCriterionAnswer = assessment.answers[currentStep];
  const totalSteps = assessment.answers.length;

  // --- LÓGICA DA PONTUAÇÃO (Peso da pergunta atual) ---
  const currentCriterionData = allCriteria.find(c => c.descricao === currentCriterionAnswer.criterion);
  const currentWeight = currentCriterionData?.peso ?? 0;
  // --- FIM DA LÓGICA ---

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

              {/* --- BLOCO MODIFICADO (Visualização de Pontuação) --- */}
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-blue-700">PASSO {currentStep + 1} DE {totalSteps}</p>
               
                {/* Visualização da Pontuação (Peso) da Pergunta Atual */}
                {currentWeight > 0 && (
                  <div className="flex items-center space-x-1 text-gray-700 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-sm text-yellow-800">Vale {currentWeight} pontos</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{currentCriterionAnswer.criterion}</h2>
              {/* --- FIM DO BLOCO --- */}

              {/* --- SEÇÃO DE PONTUAÇÃO TOTAL (MODIFICADA) --- */}
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-base font-semibold text-blue-800">Sua Pontuação Preliminar</h3>
                <div className="flex items-baseline space-x-2 text-gray-600">
                  <span className="text-3xl font-bold text-blue-700">{totalScoreAcquired}</span>
                  <span className="text-lg font-medium text-gray-500">/ {totalPossibleScore} pontos totais</span>
                </div>
                <p className="text-sm text-gray-500">Sua pontuação aumenta ao preencher cada critério respondido.</p>
              </div>
              {/* --- FIM DA SEÇÃO --- */}
            
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
                value={currentCriterionAnswer.responseText}
                onChange={handleTextChange}
              />
         </div>

            {/* Campo de Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anexar Evidências (Opcional)
              </label>
              <FileUploader
                  selectedFiles={currentCriterionAnswer.documents}
                  onFilesChange={handleFilesChange}
                  description="PDF, DOCX, PNG, ou JPG (Máx. 10MB)"
                />
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