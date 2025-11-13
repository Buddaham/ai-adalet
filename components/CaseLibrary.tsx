import React from 'react';
import type { Case } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';
import { LawIcon } from './icons/LawIcon';

interface CaseLibraryProps {
  cases: Case[];
  onSelectCase: (caseId: string) => void;
  onGoHome: () => void;
}

const CaseCard: React.FC<{ caseInfo: Case; onSelect: () => void }> = ({ caseInfo, onSelect }) => {
  const isComingSoon = caseInfo.status === 'coming_soon';
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col justify-between transition-all hover:border-cyan-500 hover:shadow-cyan-500/10 ${isComingSoon ? 'opacity-50' : 'hover:scale-[1.02]'}`}>
      <div>
        {isComingSoon && <span className="absolute top-4 right-4 text-xs bg-yellow-600 text-white font-bold py-1 px-3 rounded-full">ÇOK YAKINDA</span>}
        <h2 className="text-xl font-bold text-cyan-400 mb-2">{caseInfo.name}</h2>
        <p className="text-sm text-gray-400 mb-4">{caseInfo.summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {caseInfo.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="text-sm text-gray-500 space-y-2 border-t border-gray-700 pt-4">
           <p className="flex items-center gap-2"><DocumentIcon /> <span>{caseInfo.docTypes.join(', ')}</span></p>
           <p className="flex items-center gap-2"><LawIcon /> <span>~{caseInfo.pageCount.toLocaleString('tr-TR')} sayfa belge</span></p>
        </div>
      </div>
      <button 
        onClick={onSelect}
        disabled={isComingSoon}
        className="mt-6 w-full bg-cyan-600 text-white font-semibold py-2 rounded-lg transition-colors hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isComingSoon ? 'Hazırlanıyor' : 'Dava Alanına Gir'}
      </button>
    </div>
  );
};


const CaseLibrary: React.FC<CaseLibraryProps> = ({ cases, onSelectCase, onGoHome }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
       <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
            <button onClick={onGoHome} className="text-sm text-cyan-400 hover:underline mb-4">&larr; Ana Sayfaya Dön</button>
            <h1 className="text-4xl font-bold text-cyan-400">Dava Kütüphanesi</h1>
            <p className="text-lg text-gray-400 mt-2">İncelemek istediğiniz dava dosyasını seçin.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map(c => (
            <CaseCard key={c.id} caseInfo={c} onSelect={() => onSelectCase(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseLibrary;