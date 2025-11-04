// selo-fiea-frontend/src/components/AuditModal.tsx

import { useState, useEffect } from 'react';
import type { Audit, AuditTopic, User } from '../pages/AuditsPage';
import { X, UploadCloud, Plus, Trash2 } from 'lucide-react';

// Interface para os dados do formulário
export interface AuditFormData {
  id: number;
  title: string;
  description: string;
  mainAuditorId: number | null;
  documents: File[]; 
  topics: AuditTopic[];
  status: 'em_analise' | 'conforme' | 'nao_conforme';
}

interface AuditModalProps {
  audit: Audit | null;
  allAuditors: User[];
  onClose: () => void;
  onSave: (auditData: AuditFormData) => void;
}

const emptyForm: AuditFormData = {
  id: 0,
  title: '',
  description: '',
  mainAuditorId: null,
  documents: [],
  topics: [],
  status: 'em_analise',
};

export function AuditModal({ audit, allAuditors, onClose, onSave }: AuditModalProps) {
  const [formData, setFormData] = useState<AuditFormData>(emptyForm);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");

  useEffect(() => {
    if (audit) {
      setFormData({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        mainAuditorId: audit.mainAuditorId,
        documents: audit.documents,
        topics: audit.topics,
        status: audit.status,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [audit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mainAuditorId' ? (value ? parseInt(value) : null) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // ! Adicionar validações de tipo e tamanho (PDF, DOCX, XLSX, PNG, JPG) aqui
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...Array.from(files)] }));
  };
  // (Omiti a lógica de remoção de arquivos para simplicidade)

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return;
    const newTopic: AuditTopic = {
      id: `temp_${Date.now()}`, 
      title: newTopicTitle,
      description: newTopicDesc,
      scoreLevel: 0, 
      auditorId: null, 
    };
    setFormData(prev => ({ ...prev, topics: [...prev.topics, newTopic] }));
    setNewTopicTitle("");
    setNewTopicDesc("");
  };

  const handleRemoveTopic = (topicId: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t.id !== topicId),
    }));
  };

  const handleTopicChange = (
    topicId: string,
    field: 'auditorId' | 'scoreLevel',
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.map(t =>
        t.id === topicId ? { ...t, [field]: value ? Number(value) : null } : t
       ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {audit ? 'Editar Auditoria' : 'Criar Nova Auditoria'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* HU 07 - Campos Principais */}
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-semibold px-2">Dados Gerais</legend>
              <div className="space-y-4 p-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* HU 08 - Atribuir responsável total */}
                  <div>
                    <label htmlFor="mainAuditorId" className="block text-sm font-medium text-gray-700 mb-1">Auditor Principal</label>
                    <select name="mainAuditorId" id="mainAuditorId" value={formData.mainAuditorId ?? ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="">Nenhum</option>
                      {allAuditors.map(auditor => (
                        <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* HU 10 - Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="em_analise">Em Análise</option>
                      <option value="conforme">Conforme</option>
                      <option value="nao_conforme">Não Conforme</option>
                    </select>
                  </div>
                </div>
              </div>
            </fieldset>
            
            {/* HU 07/09 - Upload de Documentos */}
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-semibold px-2">Documentos de Apoio / Evidências</legend>
              <div className="p-2">
                <label htmlFor="doc-upload" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <UploadCloud className="h-10 w-10 text-gray-400" />
                  <span className="mt-2 text-sm font-semibold text-blue-600">Clique para enviar arquivos</span>
                  <span className="text-xs text-gray-500">PDF, DOCX, XLSX, PNG, ou JPG</span>
                </label>
                <input id="doc-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept=".pdf,.docx,.xlsx,.png,.jpg" />
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {formData.documents.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">{file.name}</li>
                  ))}
                </ul>
              </div>
            </fieldset>

            {/* HU 07/08/10 - Tópicos de Avaliação */}
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-semibold px-2">Tópicos de Avaliação</legend>
              <div className="space-y-4 p-2">
                {/* Formulário de Adicionar Tópico */}
                <div className="flex items-start gap-4">
                  <div className="flex-grow space-y-2">
                    <input
                      type="text"
                      value={newTopicTitle}
                      onChange={e => setNewTopicTitle(e.target.value)}
                      placeholder="Título do Tópico"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      value={newTopicDesc}
                      onChange={e => setNewTopicDesc(e.target.value)}
                      placeholder="Descrição do tópico (opcional)"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button type="button" onClick={handleAddTopic} className="bg-blue-600 text-white p-2 rounded-lg h-10 w-10 flex-shrink-0 mt-px">
                    <Plus size={24} />
                  </button>
                </div>

                {/* Lista de Tópicos Adicionados */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {formData.topics.map(topic => (
                    <div key={topic.id} className="border bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{topic.title}</h4>
                          {topic.description && <p className="text-sm text-gray-600">{topic.description}</p>}
                        </div>
                        <button type="button" onClick={() => handleRemoveTopic(topic.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* HU 08 - Responsável por Tópico */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Responsável pelo Tópico</label>
                          <select
                            value={topic.auditorId ?? ''}
                            onChange={e => handleTopicChange(topic.id, 'auditorId', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          >
                            <option value="">(Usar principal)</option>
                            {allAuditors.map(auditor => (
                              <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
                            ))}
                          </select>
                        </div>
                        {/* HU 10 - Pontuação por Nível */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Pontuação (Nível)</label>
                          <select
                            value={topic.scoreLevel}
                            onChange={e => handleTopicChange(topic.id, 'scoreLevel', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          >
                            <option value={0}>Nível 0 (N/A)</option>
                            <option value={1}>Nível 1</option>
                            <option value={2}>Nível 2</option>
                            <option value={3}>Nível 3</option>
                            <option value={4}>Nível 4</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.topics.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">Nenhum tópico adicionado.</p>
                  )}
                </div>
              </div>
            </fieldset>
          </div>

          <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="font-semibold text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800">
              {audit ? 'Salvar Alterações' : 'Criar Auditoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}