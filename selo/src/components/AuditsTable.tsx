import { Edit, Trash2, FileCheck, Clock } from 'lucide-react';
import type { Audit } from '../pages/AuditsPage';
import type { User } from '../pages/AuditsPage';

interface AuditsTableProps {
    audits: Audit[];
    users: User[]; 
    onEdit: (audit: Audit) => void;
    onDelete: (auditId: number) => void;
}

export function AuditsTable({ audits, users, onEdit, onDelete }: AuditsTableProps) {
    
    const getAuditorName = (id: number | null) => {
        if (!id) return <span className="text-gray-400">N/A</span>;
        return users.find(u => u.id === id)?.name ?? 'Desconhecido';
    };

    const getStatusChip = (status: 'em_analise' | 'conforme' | 'nao_conforme') => {
        switch(status) {
            case 'conforme':
                return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Conforme</span>;
            case 'nao_conforme':
                return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Não Conforme</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Em Análise</span>;
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Título da Auditoria</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Auditor Principal</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Tópicos</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {audits.map((audit) => (
                        <tr key={audit.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="text-left py-3 px-4 font-medium">{audit.title}</td>
                            <td className="text-left py-3 px-4">{getStatusChip(audit.status)}</td>
                            <td className="text-left py-3 px-4">{getAuditorName(audit.mainAuditorId)}</td>
                            <td className="text-left py-3 px-4">{audit.topics.length}</td>
                            <td className="text-left py-3 px-4">
                              <button onClick={() => onEdit(audit)} className="text-blue-600 hover:text-blue-800 mr-4">
                                    <Edit size={20} />
                                </button>
                                <button onClick={() => onDelete(audit.id)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}