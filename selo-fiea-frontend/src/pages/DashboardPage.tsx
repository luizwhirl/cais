// selo-fiea-frontend/src/pages/DashboardPage.tsx

import { Link } from "react-router-dom";
import { Shield, Users, FileText, Award, ListChecks, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { Audit } from './AuditsPage'; 
import { apiClient } from "../services/apiClient"; 


//  KpiCard
interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}

function KpiCard({ title, value, icon: Icon, colorClass }: KpiCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center space-x-4 ${colorClass}`}>
      <div className="p-3 rounded-full bg-white bg-opacity-50">
        <Icon size={32} />
      </div>
      <div>
        <p className="text-4xl font-bold">{value}</p>
        <h4 className="text-sm font-semibold uppercase tracking-wide">{title}</h4>
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL DO DASHBOARD ---
export function DashboardPage() {
    const [audits, setAudits] = useState<Audit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAudits = async () => {
          setIsLoading(true);
          try {
            const data = await apiClient.get('/auditorias');
            setAudits(data);
          } catch (error) {
            console.error("Falha ao buscar resumo de auditorias:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchAudits();
    }, []);

    // Calcula os totais usando useMemo para performance
    const summary = useMemo(() => {
        const emAnalise = audits.filter(a => a.status === 'em_analise').length;
        const conforme = audits.filter(a => a.status === 'conforme').length;
        const naoConforme = audits.filter(a => a.status === 'nao_conforme').length;
        return { emAnalise, conforme, naoConforme };
    }, [audits]); // Recalcula somente se a lista de auditorias mudar

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Simples */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Selo FIEA</h1>
                    <Link 
                      to="/login" 
                      onClick={() => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('user');
                      }}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Sair
                    </Link>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container mx-auto px-6 py-8">
                <h2 className="text-3xl font-bold text-gray-700 mb-6">Bem-vindo, Gestor!</h2>

                {/* --- SEÇÃO DE KPIs --- */}
                <section className="mb-10">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Resumo dos Ciclos de Auditoria</h3>
                    {isLoading ? (
                      <p className="text-gray-500">Carregando resumo...</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <KpiCard
                              title="Em Análise"
                              value={summary.emAnalise}
                              icon={Clock}
                              colorClass="bg-yellow-100 text-yellow-800"
                          />
                          <KpiCard
                              title="Conformes"
                              value={summary.conforme}
                              icon={CheckCircle2}
                              colorClass="bg-green-100 text-green-800"
                          />
                          <KpiCard
                              title="Não Conformes"
                              value={summary.naoConforme}
                              icon={AlertCircle}
                              colorClass="bg-red-100 text-red-800"
                          />
                      </div>
                    )}
                </section>
                {/* --- FIM DA SEÇÃO --- */}

                {/* --- SEÇÃO DE GERENCIAMENTO (Existente) --- */}
                <section>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Painéis de Gerenciamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card de Gerenciar Perfis */}
                        <Link to="/dashboard/perfis" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start">
                            <div className="bg-blue-100 text-blue-700 p-3 rounded-full mb-4">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Perfis de Acesso</h3>
                            <p className="text-gray-600 mb-4">Crie, edite e defina as permissões para os perfis de usuários do sistema.</p>
                            <span className="mt-auto font-semibold text-blue-600">Acessar →</span>
                        </Link>

                        <Link to="/dashboard/selos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start">
                            <div className="bg-yellow-100 text-yellow-500 p-3 rounded-full mb-4">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Selos</h3>
                            <p className="text-gray-600 mb-4">Crie, edite e gerencie os selos da plataforma.</p>
                            <span className="mt-auto font-semibold text-blue-600">Acessar →</span>
                        </Link>

                        {/* Card de Gerenciar Critérios */}
                        <Link to="/dashboard/criterios" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start">
                            <div className="bg-red-100 text-red-500 p-3 rounded-full mb-4">
                                <ListChecks size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Critérios</h3>
                            <p className="text-gray-600 mb-4">Crie, edite e gerencie os critérios dos selos da plataforma.</p>
                            <span className="mt-auto font-semibold text-blue-600">Acessar →</span>
                        </Link>

                        {/* Card de Gerenciar Auditorias */}
                        <Link to="/dashboard/auditorias" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start">
                            <div className="bg-orange-100 text-orange-700 p-3 rounded-full mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Auditorias</h3>
                            <p className="text-gray-600 mb-4">Crie, configure e acompanhe os processos de auditoria.</p>
                            <span className="mt-auto font-semibold text-blue-600">Acessar →</span>
                        </Link>
                        
                        {/* Card de Gerenciar Usuários */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-start opacity-50 cursor-not-allowed">
                            <div className="bg-green-100 text-green-700 p-3 rounded-full mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Usuários</h3>
                            <p className="text-gray-600 mb-4">Adicione ou remova usuários da plataforma.</p>
                            <span className="mt-auto font-semibold text-gray-500">Em breve</span>
                        </div>

                        {/* Card de Relatórios */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-start opacity-50 cursor-not-allowed">
                            <div className="bg-orange-100 text-orange-700 p-3 rounded-full mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Relatórios</h3>
                            <p className="text-gray-600 mb-4">Visualize os relatórios de auditoria e conformidade.</p>
                            <span className="mt-auto font-semibold text-gray-500">Em breve</span>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}