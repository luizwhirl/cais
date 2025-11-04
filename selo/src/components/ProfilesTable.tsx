// selo-fiea-frontend/src/components/ProfilesTable.tsx

import { Edit, Trash2 } from 'lucide-react';
import type { Profile } from '../pages/ProfilesPage';

interface ProfilesTableProps {
    profiles: Profile[];
    onEdit: (profile: Profile) => void;
    onDelete: (profileId: number) => void;
}

export function ProfilesTable({ profiles, onEdit, onDelete }: ProfilesTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Nome do Perfil</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Descrição</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {profiles.map((profile) => (
                        <tr key={profile.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="text-left py-3 px-4 font-medium">{profile.name}</td>
                            <td className="text-left py-3 px-4">{profile.description}</td>
                            <td className="text-left py-3 px-4">
                                <button onClick={() => onEdit(profile)} className="text-blue-600 hover:text-blue-800 mr-4">
                                    <Edit size={20} />
                                </button>
                                <button onClick={() => onDelete(profile.id)} className="text-red-600 hover:text-red-800">
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