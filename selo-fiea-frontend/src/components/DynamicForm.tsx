// selo-fiea-frontend/src/components/DynamicForm.tsx

import { useState, useEffect } from 'react';
import type { Badge } from '../pages/BadgesPage';
import type { Criterion } from '../pages/CriteriaPage';
import { X, UploadCloud } from 'lucide-react';

interface DynamicFormProps {
  badge: Badge | null;
  onClose: () => void;
  onSave: (badge: Badge) => void;
  allCriteria: Criterion[];
}

interface BadgeForm {
  name: string;
  description: string;
  icon: string;
  criteria: string[];
  validadeMeses: number;
  dataInicioEmissao: string;
  dataFimEmissao: string;
}

export function DynamicForm({ badge, onClose, onSave, allCriteria }: DynamicFormProps) {
  const [formData, setFormData] = useState<BadgeForm>({
    name: '',
    description: '',
    icon: '',
    criteria: [],
    validadeMeses: 12,
    dataInicioEmissao: '',
    dataFimEmissao: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (badge) {
      setFormData({
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        criteria: badge.criteria,
        validadeMeses: badge.validadeMeses,
        dataInicioEmissao: badge.dataInicioEmissao
          ? new Date(badge.dataInicioEmissao).toISOString().split('T')[0]
          : '',
        dataFimEmissao: badge.dataFimEmissao
          ? new Date(badge.dataFimEmissao).toISOString().split('T')[0]
          : '',
      });
      setImagePreview(badge.icon); // Mostra o ícone existente
    }
  }, [badge]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo é muito grande. O tamanho máximo é de 5MB.');
      e.target.value = ''; // Limpa o input
      return;
    }

    // Validação de tipo
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo inválido. Apenas SVG, PNG, JPG e WEBP são permitidos.');
      e.target.value = ''; // Limpa o input
      return;
    }

    // Gera preview e converte para Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, icon: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCriteria = (criterionDescription: string) => {
    if (criterionDescription && !formData.criteria.includes(criterionDescription)) {
      setFormData(prev => ({
        ...prev,
        criteria: [...prev.criteria, criterionDescription],
      }));
    }
  };

  const handleRemoveCriteria = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const badgeToSave: Badge = {
      ...formData,
      id: badge?.id || 0,
      dataInicioEmissao: formData.dataInicioEmissao
        ? new Date(formData.dataInicioEmissao)
        : new Date(),
      dataFimEmissao: formData.dataFimEmissao
        ? new Date(formData.dataFimEmissao)
        : new Date(),
    } as Badge;

    onSave(badgeToSave);
  };

  // Função para truncar o texto e adicionar "..."
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {badge ? 'Editar Selo' : 'Criar Novo Selo'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-base font-medium text-gray-700"
            >
              Nome do Selo
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
              required
            />
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-base font-medium text-gray-700"
            >
              Descrição
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
              required
            />
          </div>

          {/* Ícone */}
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-700">Ícone do Selo</label>
            <div className="mt-2 flex items-center gap-x-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Pré-visualização do selo" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <label htmlFor="icon-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <span>Enviar Imagem</span>
                <input 
                  id="icon-upload" 
                  name="icon-upload" 
                  type="file" 
                  className="sr-only"
                  accept="image/svg+xml, image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              SVG, PNG, JPG ou WEBP. Tamanho máximo de 5MB.
            </p>
          </div>

          {/* Datas e validade */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="validadeMeses"
                className="block text-base font-medium text-gray-700"
              >
                Validade (meses)
              </label>
              <input
                type="number"
                name="validadeMeses"
                id="validadeMeses"
                value={formData.validadeMeses}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dataInicioEmissao"
                className="block text-base font-medium text-gray-700"
              >
                Início da Emissão
              </label>
              <input
                type="date"
                name="dataInicioEmissao"
                id="dataInicioEmissao"
                value={formData.dataInicioEmissao}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dataFimEmissao"
                className="block text-base font-medium text-gray-700"
              >
                Fim da Emissão
              </label>
              <input
                type="date"
                name="dataFimEmissao"
                id="dataFimEmissao"
                value={formData.dataFimEmissao}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
                required
              />
            </div>
          </div>

          {/* Critérios */}
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-700">
              Critérios
            </label>
            <div className="flex mt-1">
              <select
                onChange={e => handleAddCriteria(e.target.value)}
                value=""
                className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 min-w-0 text-base"
              >
                <option value="" disabled>Selecione um critério para adicionar</option>
                {allCriteria
                  .filter(c => !formData.criteria.includes(c.descricao))
                  .map(criterion => (
                    <option
                      key={criterion.id}
                      value={criterion.descricao}
                      title={`${criterion.pilar} - ${criterion.descricao}`}
                      className="truncate"
                    >
                      {truncateText(`${criterion.pilar} - ${criterion.descricao}`, 70)}
                    </option>
                  ))
                }
              </select>
            </div>

            <ul className="mt-2 space-y-1 list-disc list-inside ml-1">
              {formData.criteria.map((c, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-base pr-2">{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCriteria(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 text-md font-bold py-2 px-6 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white text-md font-bold py-2 px-6 rounded-lg hover:bg-blue-800"
            >
              {badge? 'Salvar' : 'Criar Selo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
