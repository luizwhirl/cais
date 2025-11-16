// selo-fiea-frontend/src/pages/BadgeVerificationPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, ShieldAlert, Award, Building } from 'lucide-react';
import { LoginHeader } from "../components/LoginHeader";
import { apiClient } from "../services/apiClient"; // Importa o cliente

interface DigitalBadge {
  id: string;
  badge: { name: string; validadeMeses: number };
  company: { nome_fantasia: string; cnpj: string };
  issueDate: string; 
}

export function BadgeVerificationPage() {
  const { verificationId } = useParams<{ verificationId: string }>();
  const [issuedBadge, setIssuedBadge] = useState<DigitalBadge | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyBadge = async () => {
      if (!verificationId) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // API REAL (PÚBLICA)
        const found: DigitalBadge = await apiClient.publicGet(`/selos-emitidos/validar/${verificationId}`);
        
        setIssuedBadge(found);

        // Lógica de validação
        const issueDate = new Date(found.issueDate);
        const expiryDate = new Date(issueDate);
        expiryDate.setMonth(expiryDate.getMonth() + found.badge.validadeMeses);
        
        setIsValid(new Date() < expiryDate);
        
      } catch (error) {
        console.error("Falha ao verificar selo:", error);
        setIssuedBadge(null);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyBadge();
  }, [verificationId]);

  const expiryDate = issuedBadge ? new Date(issuedBadge.issueDate) : null;
  if (expiryDate && issuedBadge) {
    expiryDate.setMonth(expiryDate.getMonth() + issuedBadge.badge.validadeMeses);
  }
  const issueDate = issuedBadge ? new Date(issuedBadge.issueDate) : null;


  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-600">Verificando...</p>;
    }

    if (isValid && issuedBadge && issueDate && expiryDate) {
      return (
        <div className="text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Selo Verificado!</h2>
          
          <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-bold text-lg flex items-center gap-2"><Award size={20} /> {issuedBadge.badge.name}</h3>
            <p className="mt-2 flex items-center gap-2 text-gray-700"><Building size={18} /> Concedido a: <span className="font-semibold">{issuedBadge.company.nome_fantasia}</span></p>
            <p className="mt-1 text-sm text-gray-500">CNPJ: {issuedBadge.company.cnpj}</p>
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <p className="flex justify-between"><span>Data de Emissão:</span> <strong>{issueDate.toLocaleDateString('pt-BR')}</strong></p>
              <p className="flex justify-between"><span>Data de Validade:</span> <strong>{expiryDate.toLocaleDateString('pt-BR')}</strong></p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Selo Inválido ou Expirado</h2>
        <p className="mt-2 text-gray-600">Não foi possível verificar a autenticidade deste selo. Ele pode não existir ou sua validade pode ter expirado.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LoginHeader />
      <main className="hero-bg flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md border border-gray-100">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}