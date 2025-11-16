// selo-fiea-frontend/src/components/ProfileModal.tsx

import { useState, useEffect } from "react";
import type { Profile } from '../pages/ProfilesPage';
import type { Permission } from '../pages/ProfilesPage';
import { X } from 'lucide-react';

interface ProfileModalProps {
    profile: Profile | null;
    allPermissions: Permission[];
    onClose: () => void;
    onSave: (profile: Profile) => void;
}

export function ProfileModal({ profile, allPermissions, onClose, onSave }: ProfileModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setDescription(profile.description);
            setSelectedPermissions(new Set(profile.permissions));
        } else {
            setName('');
            setDescription('');
            setSelectedPermissions(new Set());
        }
    }, [profile]);

    const handlePermissionChange = (permissionId: string) => {
        const newPermissions = new Set(selectedPermissions);
        if (newPermissions.has(permissionId)) {
            newPermissions.delete(permissionId);
        } else {
            newPermissions.add(permissionId);
        }
        setSelectedPermissions(newPermissions);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const profileData = {
            id: profile?.id ?? 0, 
            name,
            description,
            permissions: Array.from(selectedPermissions),
        };
        onSave(profileData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{profile ? 'Editar Perfil' : 'Criar Novo Perfil'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24}/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    {/* Aumentei o espaçamento de 'space-y-4' para 'space-y-6' para polimento */}
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Perfil</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
            _           </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Permissões</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg max-h-60 overflow-y-auto">
                                {allPermissions.map(permission => (
                                    <label key={permission.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedPermissions.has(permission.id)}
                                            onChange={() => handlePermissionChange(permission.id)}
                                        />
                                        <span className="text-gray-700">{permission.description}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="font-semibold text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 mr-2">
                            Cancelar
                D     </button>
                        <button type="submit" className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800">
                            {profile ? 'Salvar Alterações' : 'Criar Perfil'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}