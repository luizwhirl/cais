// selo-fiea-frontend/src/pages/DigitalBadgesPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, Building, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { Badge } from "./BadgesPage";
import type { Company } from "../components/CompanyModal";
import { apiClient } from "../services/apiClient"; 
import { useNotifications } from "../hooks/useNotifications";

// --- Tipos de Dados ---

interface DigitalBadge {
  id: string; // ID da *emissão* do selo
  badge: Badge; // Dados do tipo de selo
  company: Company; // Dados da empresa
  issueDate: string; // Data de emissão (string ISO)
  // adicionamos 'expiryDate' se a API já calcular
}


export function DigitalBadgesPage() {
  const [issuedBadges, setIssuedBadges] = useState<DigitalBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchMyBadges = async () => {
      setIsLoading(true);
      try {
        // 1. Pega o usuário logado do localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('Usuário não autenticado.');
        }
        const user = JSON.parse(userString);
        
        // 2. Assume que o usuário tem uma 'empresaId'
        // ( se o campo for outro, ajustamos 'user.empresaId')
        const empresaId = user.empresaId;
        if (!empresaId) {
           throw new Error('Usuário não está associado a uma empresa.');
        }

        // 3. Busca os selos emitidos para essa empresa
        const data = await apiClient.get(`/selos-emitidos/empresa/${empresaId}`);
        setIssuedBadges(data);

      } catch (error: any) {
        addNotification(`Erro ao carregar selos: ${error.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBadges();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateExpiryDate = (issueDateStr: string, validityMonths: number) => {
    const expiry = new Date(issueDateStr);
    expiry.setMonth(expiry.getMonth() + validityMonths);
    return expiry;
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <Link to="/industry/dashboard/" className="text-sm font-semibold text-blue-600 hover:underline">← Voltar para o Portal</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">Meus Selos</h1>
          </div>
        </header>

      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <p className="text-center text-gray-500 py-12">Carregando selos...</p>
        ) : issuedBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issuedBadges.map(issued => {
              const issueDate = new Date(issued.issueDate);
              const expiryDate = calculateExpiryDate(issued.issueDate, issued.badge.validadeMeses);
              const isExpired = new Date() > expiryDate;

              return (
                <div 
                  key={issued.id} 
                  className={`bg-white p-6 rounded-lg shadow-md border ${isExpired ? 'border-red-200 opacity-70' : 'border-gray-100'} flex flex-col items-center text-center hover:shadow-xl transition-shadow`}
                >
                  {isExpired && (
                    <span className="flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                      <ShieldAlert size={14} /> Expirado
                    </span>
                  )}
                  <img src={issued.badge.icon} alt={issued.badge.name} className="h-24 w-24 rounded-full mb-4 border-4 border-gray-200" />
                  
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Award size={20} className="text-blue-600" />
                    {issued.badge.name}
                  </h2>
                  <p className="text-lg font-semibold text-gray-700 mt-2 mb-4 flex items-center gap-2">
                    <Building size={18} className="text-gray-500" />
                    {issued.company.nome_fantasia}
                  </p>

                  <div className="text-sm text-gray-600 space-y-2 w-full border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold flex items-center gap-1.5"><Calendar size={14} /> Data de Emissão:</span>
                      <span>{issueDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className={`flex justify-between ${isExpired ? 'text-red-600 font-bold' : ''}`}>
                      <span className="font-semibold flex items-center gap-1.5"><ShieldCheck size={14} /> Data de Validade:</span>
                      <span>{expiryDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  {/* Link para validação pública */}
                  <Link 
                    to={`/verificacao/${issued.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                  >
                    Verificar autenticidade
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShieldAlert size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-700">Nenhum selo conquistado</h3>
            <p className="mt-1 text-gray-500">Sua empresa ainda não possui selos FIEA emitidos.</p>
          </div>
        )}
      </main>
    </div>
  );
}