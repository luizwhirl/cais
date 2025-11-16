// selo-fiea-frontend/src/components/BadgesTable.tsx

import type { Badge } from '../pages/BadgesPage'; 
import { Edit, Trash2 } from 'lucide-react';

interface BadgesTableProps {
  badges: Badge[];
  onEdit: (badge: Badge) => void;
  onDelete: (badgeId: number) => void;
}

export function BadgesTable({ badges, onEdit, onDelete }: BadgesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Ícone</th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Nome do Selo</th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Descrição</th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {badges.map((badge) => (
            <tr key={badge.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4">
                <img src={badge.icon} alt={`Ícone do selo ${badge.name}`} className="h-12 w-12 rounded-full object-cover" />
              </td>
              <td className="py-3 px-4 font-medium">{badge.name}</td>
              <td className="py-3 px-4">{badge.description}</td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-4">
                  <button onClick={() => onEdit(badge)} className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => onDelete(badge.id)} className="text-red-600 hover:text-red-800 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
