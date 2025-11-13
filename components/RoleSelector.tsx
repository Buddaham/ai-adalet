import React from 'react';
import { Role } from '../types';

interface RoleSelectorProps {
  activeRole: Role;
  onChange: (role: Role) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onChange }) => {
  const roles = Object.values(Role);

  return (
    <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-lg">
      <span className="text-sm font-medium text-gray-400 pl-2">Mod:</span>
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => onChange(role)}
          className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
            activeRole === role
              ? 'bg-cyan-600 text-white font-semibold shadow'
              : 'text-gray-300 hover:bg-gray-600'
          }`}
        >
          {role === Role.CITIZEN ? 'Vatandaş' : 
           role === Role.LAW_STUDENT ? 'Hukuk Öğrencisi' : 
           'Araştırmacı'}
        </button>
      ))}
    </div>
  );
};
