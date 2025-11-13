import React from 'react';
import { Case } from '../types';

interface CaseSelectorProps {
  cases: Case[];
  activeCaseId: string;
  onChange: (caseId: string) => void;
}

export const CaseSelector: React.FC<CaseSelectorProps> = ({
  cases,
  activeCaseId,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-400">
        Dava:
      </span>
      <select
        value={activeCaseId}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
      >
        {cases.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};