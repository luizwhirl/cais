// src/components/ParecerModal.tsx

import { useState, useEffect, type FormEvent } from 'react';
import type { Audit, AuditTopic } from '../pages/AuditsPage';
import { X, Star } from 'lucide-react';

interface ParecerModalProps {
  audit: Audit;
  onClose: () => void;
  onSave: (updatedAudit: Audit) => void;
}

export function ParecerModal({ audit, onClose, onSave }: ParecerModalProps) {
  // O estado local gerencia as mudanças nos tópicos
  const [topics, setTopics] = useState<AuditTopic[]>([]);
  // Estado local para o parecer final
  const [parecerFinal, setParecerFinal] = useState('');

  useEffect(() => {
    // Clona os tópicos da auditoria para o estado local ao abrir o modal
    setTopics(JSON.parse(JSON.stringify(audit.topics)));
    // Define o parecer final no estado local
    setParecerFinal(audit.parecerFinal || '');
  }, [audit]);

  const handleTopicChange = (
    topicId: string,
    field: 'scoreLevel' | 'parecer',
    value: string | number
  ) => {
    setTopics(prevTopics =>
      prevTopics.map(t =>
        t.id === topicId
          ? { ...t, [field]: field === 'scoreLevel' ? Number(value) : value }
          : t
      )
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Retorna o objeto de auditoria completo com os tópicos E o parecer final
    onSave({ 
      ...audit, 
      topics: topics, 
      parecerFinal: parecerFinal // Adiciona o parecer final ao salvar
    });
  };
  
  // Calcula a pontuação total (baseada na nota do AUDITOR)
  const totalScore = topics.reduce((acc, topic) => acc + topic.scoreLevel, 0);
  const maxScore = topics.length * 4; // Nível 4 é o máximo por tópico

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registrar Parecer de Auditoria</h2>
            <p className="text-gray-600 text-sm mt-1">{audit.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Bloco de Pontuação Total (do Auditor) */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-base font-semibold text-blue-800">Pontuação Total (Auditor)</h3>
                <div className="flex items-baseline space-x-2 text-gray-600">
                  <span className="text-3xl font-bold text-blue-700">{totalScore}</span>
                  <span className="text-lg font-medium text-gray-500">/ {maxScore} pontos</span>
                </div>
                <p className="text-sm text-gray-500">A pontuação é baseada no Nível (0-4) de cada tópico definido pelo auditor.</p>
            </div>

            {/* Lista de Tópicos para Avaliação */}
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-semibold px-2">Tópicos de Avaliação</legend>
              <div className="space-y-4 p-2 max-h-[40vh] overflow-y-auto">
                {topics.map(topic => (
                  <div key={topic.id} className="border bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-semibold">{topic.title}</h4>
                      {topic.description && <p className="text-sm text-gray-600">{topic.description}</p>}
                    </div>
                    
                    {/* Bloco de Resposta da Empresa (Autoavaliação) - NOVO */}
                    <div className="border border-blue-200 bg-blue-100 p-3 rounded-md space-y-2">
                      <h5 className="text-sm font-semibold text-blue-800">Resposta da Empresa (Autoavaliação)</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Pontuação Informada</label>
                          <div className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg">
                            Nível {topic.companySelfScore}
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Parecer da Empresa</label>
                          <div className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg min-h-[60px]">
                            {topic.companyParecer || <span className="text-gray-400">Nenhum parecer informado.</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Campos de Score e Parecer (Auditor) - ATUALIZADO */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Pontuação do Auditor (Nível)</label>
                        <select
                          value={topic.scoreLevel}
                          onChange={e => handleTopicChange(topic.id, 'scoreLevel', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                        >
                          <option value={0}>Nível 0 (N/A)</option>
                          <option value={1}>Nível 1</option>
                          <option value={2}>Nível 2</option>
                          <option value={3}>Nível 3</option>
                          <option value={4}>Nível 4</option>
                        </select>
                      </div>
                      <div className="md:col-span-3">
                         <label className="block text-xs font-medium text-gray-600 mb-1">Parecer do Auditor</label>
                         <textarea
                            value={topic.parecer}
                            onChange={e => handleTopicChange(topic.id, 'parecer', e.target.value)}
                            placeholder="Escreva a justificativa ou observação..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                         />
                      </div>
                    </div>
                  </div>
                ))}
                {topics.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">Nenhum tópico de avaliação foi configurado para esta auditoria.</p>
                )}
              </div>
            </fieldset>

            {/* Campo de Parecer Final */}
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-semibold px-2">Parecer Final da Auditoria</legend>
              <div className="p-2">
                <label htmlFor="parecerFinal" className="block text-sm font-medium text-gray-700 mb-1">
                  Escreva um resumo geral, observações finais ou o veredito da auditoria.
                </label>
                <textarea
                  id="parecerFinal"
                  value={parecerFinal}
                  onChange={e => setParecerFinal(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Digite o parecer final aqui..."
                />
              </div>
            </fieldset>

          </div>

          <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="font-semibold text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800">
              Salvar Parecer e Notas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}