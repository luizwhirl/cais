import { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';

export interface Company {
  id: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  setor: string;
  porte: 'Pequeno' | 'Médio' | 'Grande';
  endereco: string;
  email: string;
  telefone: string;
  status: 'Ativa' | 'Desativada';
}

interface CompanyModalProps {
  company: Company | null;
  onClose: () => void;
  onSave: (company: Company) => void;
}

export function CompanyModal({ company, onClose, onSave }: CompanyModalProps) {
  const [formData, setFormData] = useState<Company>({
    id: company?.id || 0,
    razao_social: company?.razao_social || '',
    nome_fantasia: company?.nome_fantasia ?? '',
    cnpj: company?.cnpj ?? '',
    setor: company?.setor ?? '',
    porte: company?.porte ?? 'Pequeno',
    endereco: company?.endereco ?? '',
    email: company?.email ?? '',
    telefone: company?.telefone ?? '',
    status: company?.status || 'Ativa',
  });

  useEffect(() => {
    // Trava o scroll da página principal quando o modal está aberto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === 'cnpj') {
      const digitsOnly = value.replace(/\D/g, '');
      let masked = digitsOnly;
      if (digitsOnly.length > 2) {
        masked = `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}`;
      }
      if (digitsOnly.length > 5) {
        masked = `${masked}.${digitsOnly.slice(5, 8)}`;
      }
      if (digitsOnly.length > 8) {
        masked = `${masked}/${digitsOnly.slice(8, 12)}`;
      }
      if (digitsOnly.length > 12) {
        masked = `${masked}-${digitsOnly.slice(12, 14)}`;
      }
      formattedValue = masked;
    } else if (name === 'telefone') {
      const digitsOnly = value.replace(/\D/g, '');
      let masked = digitsOnly;
      if (digitsOnly.length > 0) {
        masked = `(${digitsOnly.slice(0, 2)}`;
      }
      if (digitsOnly.length > 2) {
        masked = `${masked}) ${digitsOnly.slice(2, 7)}`;
      }
      if (digitsOnly.length > 7) {
        masked = `${masked}-${digitsOnly.slice(7, 11)}`;
      }
      formattedValue = masked;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(formData);
  };

  const isEditing = company !== null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="razao_social" className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                <input type="text" id="razao_social" name="razao_social" value={formData.razao_social} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label htmlFor="nome_fantasia" className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                <input type="text" id="nome_fantasia" name="nome_fantasia" value={formData.nome_fantasia} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required maxLength={18} />
              </div>
              <div>
                <label htmlFor="setor" className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                <input type="text" id="setor" name="setor" value={formData.setor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required maxLength={15} />
              </div>
            </div>
            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="porte" className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
                <select id="porte" name="porte" value={formData.porte} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-3">Cancelar</button>
            <button type="submit" className="px-6 py-2.5 text-white bg-blue-700 rounded-lg hover:bg-blue-800">{isEditing ? 'Salvar Alterações' : 'Cadastrar Empresa'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}