import React from 'react';
import type { Message, Role } from '../types';
import { LegalDisclaimer } from './LegalDisclaimer';

interface BotMessageProps {
  message: Message;
  highlightedSourceId: string | null;
  onSourceHighlight: (sourceId: string | null) => void;
}

const getRoleDisplayName = (role?: Role) => {
    if (!role) return null;
    switch(role) {
        case 'Citizen': return 'Vatandaş';
        case 'Law Student': return 'Hukuk Öğrencisi';
        case 'Researcher': return 'Araştırmacı';
        default: return role;
    }
}

export const BotMessage: React.FC<BotMessageProps> = ({ message, highlightedSourceId, onSourceHighlight }) => {
  const { text, sources, role } = message;

  if (!text) return null;

  const parts = text.split("Kaynaklar:");
  const mainContent = parts[0];
  const sourcesText = parts.length > 1 ? `Kaynaklar:${parts[1]}` : null;

  const renderContentWithHighlights = (content: string | null) => {
    if (!content) return null;
    if (!sources || sources.length === 0) {
        return <div className="whitespace-pre-wrap">{content}</div>;
    }
    
    // Create a regex from all source IDs to split the text
    const regex = new RegExp(`(${sources.map(s => s.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    const contentParts = content.split(regex);
    
    return (
         <div className="whitespace-pre-wrap">
             {contentParts.map((part, index) => {
                const isSource = sources.some(s => s.id === part);
                if (isSource) {
                    return (
                        <button 
                            key={index} 
                            onClick={() => onSourceHighlight(part)}
                            className={`font-semibold text-cyan-400 bg-gray-600 px-1 py-0.5 rounded transition-all ${highlightedSourceId === part ? 'ring-2 ring-cyan-300' : 'ring-0'}`}
                        >
                            {part.match(/\[Belge: ([^|]+)/)?.[1].trim() || 'Kaynak'}
                        </button>
                    );
                }
                return part;
             })}
         </div>
    )
  }
  
  const roleName = getRoleDisplayName(role);

  return (
    <div className="text-sm flex flex-col">
        {roleName && (
             <div className="text-xs text-cyan-300 bg-gray-600 rounded-full px-2 py-0.5 self-start mb-2">
                Mod: {roleName}
            </div>
        )}
        <div className="p-3">
            {renderContentWithHighlights(mainContent)}
        </div>
        {sourcesText && (
             <div className="border-t border-gray-600 mt-2 pt-2 px-3 pb-1">
                 {renderContentWithHighlights(sourcesText)}
             </div>
        )}
        <LegalDisclaimer />
    </div>
  );
};