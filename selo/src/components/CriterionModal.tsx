import { useState, useEffect } from 'react';
import type { Criterion, Pilar } from '../pages/CriteriaPage';
import { X } from 'lucide-react';

interface CriterionFormProps {
  criterion?: Criterion | null;
  onSave: (criterion: Omit<Criterion, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

export function CriterionForm({ criterion, onSave, onCancel }: CriterionFormProps) {
  const [formData, setFormData] = useState<Omit<Criterion, 'id'>>({
    pilar: 'Qualidade',
    descricao: '',
    peso: 1,
  });

  useEffect(() => {
    if (criterion) {
      setFormData({
        pilar: criterion.pilar,
        descricao: criterion.descricao,
        peso: criterion.peso,
      });
    }
  }, [criterion]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'peso' ? parseInt(value, 10) : name === 'pilar' ? value as Pilar : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: criterion?.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {criterion ? 'Editar Critério' : 'Criar Novo Critério'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="pilar" className="block text-base font-medium text-gray-700">Pilar</label>
            <select
              id="pilar"
              name="pilar"
              value={formData.pilar}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
            >
              <option value="Qualidade">Qualidade</option>
              <option value="Sustentabilidade">Sustentabilidade</option>
              <option value="Inovação Tecnológica">Inovação Tecnológica</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="descricao" className="block text-base font-medium text-gray-700">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="peso" className="block text-base font-medium text-gray-700">Peso</label>
            <input
              type="number"
              id="peso"
              name="peso"
              min="1"
              max="5"
              value={formData.peso}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-base"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 text-md font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bg-blue-700 text-white text-md font-bold py-2 px-6 rounded-lg hover:bg-blue-800">{criterion ? 'Salvar' : 'Criar Critério'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}