import React from 'react';
import type { TckArticle, CaseDocument } from '../types';
import { TCK_ARTICLES, CASE_DOCUMENTS } from '../constants';
import { LawIcon } from './icons/LawIcon';
import { DocumentIcon } from './icons/DocumentIcon';

interface SidebarProps {
  activeCaseId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCaseId }) => {
  
  return (
    <aside className="w-80 bg-gray-800 p-4 flex flex-col gap-6 border-r border-gray-700 overflow-y-auto">
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-400">
          <LawIcon />
          Öne Çıkan TCK Maddeleri
        </h2>
        <ul className="space-y-2">
          {TCK_ARTICLES.filter(a => !a.caseId || a.caseId === activeCaseId).map((article) => (
            <li key={article.id}>
              <div
                className="w-full text-left px-3 py-2 rounded-md text-sm cursor-not-allowed opacity-60"
              >
                <span className="font-bold">Madde {article.madde_no}:</span> {article.title}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-400">
          <DocumentIcon />
          Dava Dosyaları
        </h2>
        <ul className="space-y-2">
          {CASE_DOCUMENTS.filter(d => d.caseId === activeCaseId).map((doc) => (
            <li key={doc.id}>
              <div
                 className="w-full text-left px-3 py-2 rounded-md text-sm cursor-not-allowed opacity-60"
              >
                {doc.type} <span className="text-xs text-gray-400">({doc.date})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;