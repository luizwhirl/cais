// selo-fiea-frontend/src/pages/DashboardPage.tsx

import { Link } from "react-router-dom";
import { Shield, Users, FileText, Award, ListChecks } from 'lucide-react'; // ícones para os cards

// o ideal aqui seria um header e footer, mas vamos simplificar por agora
export function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Simples */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Selo FIEA</h1>
                    <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">Sair</Link>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container mx-auto px-6 py-8">
                <h2 className="text-3xl font-bold text-gray-700 mb-6">Bem-vindo, Gestor!</h2>

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

                    {/* Card de Gerenciar Critérios (Único na Versão 2) */}
                    <Link to="/dashboard/criterios" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start">
                        <div className="bg-red-100 text-red-500 p-3 rounded-full mb-4">
                            <ListChecks size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Critérios</h3>
                        <p className="text-gray-600 mb-4">Crie, edite e gerencie os critérios dos selos da plataforma.</p>
                        <span className="mt-auto font-semibold text-blue-600">Acessar →</span>
                    </Link>

                    {/* Card de Gerenciar Auditorias (Único na Versão 1) */}
                    <Link to="/dashboard/auditorias" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start">
                        <div className="bg-orange-100 text-orange-700 p-3 rounded-full mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Auditorias</h3>
                        <p className="text-gray-600 mb-4">Crie, configure e acompanhe os processos de auditoria.</p>
                        <span className="mt-auto font-semibold text-blue-600">Acessar →</span>
                    </Link>
                    
                    {/* Card de Gerenciar Usuários (Desativado em ambas) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-start opacity-50 cursor-not-allowed">
                        <div className="bg-green-100 text-green-700 p-3 rounded-full mb-4">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Usuários</h3>
                        <p className="text-gray-600 mb-4">Adicione ou remova usuários da plataforma.</p>
                        <span className="mt-auto font-semibold text-gray-500">Em breve</span>
                    </div>

                    {/* Card de Relatórios (Desativado - Único na Versão 2) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-start opacity-50 cursor-not-allowed">
                        <div className="bg-orange-100 text-orange-700 p-3 rounded-full mb-4">
                            <FileText size={32} /> {/* Reutilizando o ícone, se necessário, ou trocando por um de relatório */}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Relatórios</h3>
                        <p className="text-gray-600 mb-4">Visualize os relatórios de auditoria e conformidade.</p>
                        <span className="mt-auto font-semibold text-gray-500">Em breve</span>
                    </div>

                </div>
            </main>
        </div>
    );
}

// export default DashboardAdmin;