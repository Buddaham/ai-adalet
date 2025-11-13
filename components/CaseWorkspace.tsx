import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import Timeline from './Timeline';
import SourcesPanel from './SourcesPanel';
import { RoleSelector } from './RoleSelector';
import { type Message, type Source, Role, Case } from '../types';

interface CaseWorkspaceProps {
    caseData: Case;
    onBackToLibrary: () => void;
}

const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({ caseData, onBackToLibrary }) => {
  const [activeRole, setActiveRole] = useState<Role>(Role.CITIZEN);
  const [lastBotSources, setLastBotSources] = useState<Source[] | undefined>();
  const [highlightedSourceId, setHighlightedSourceId] = useState<string | null>(null);

  const handleNewBotMessage = (message: Message) => {
    setLastBotSources(message.sources);
    setHighlightedSourceId(null); // Clear highlight on new message
  };

  const handleSourceHighlight = (sourceId: string | null) => {
    setHighlightedSourceId(sourceId);
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        activeCaseId={caseData.id}
      />
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <header className="bg-gray-800 p-4 rounded-lg shadow-md">
           <div className="flex justify-between items-start">
            <div>
              <button onClick={onBackToLibrary} className="text-sm text-cyan-400 hover:underline mb-2">
                &larr; Dava Kütüphanesine Dön
              </button>
              <h1 className="text-xl font-bold text-cyan-400">{caseData.name}</h1>
              <p className="text-sm text-gray-400 mt-1 max-w-2xl">{caseData.description}</p>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <RoleSelector
                activeRole={activeRole}
                onChange={setActiveRole}
              />
            </div>
          </div>
        </header>
        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="w-2/3 flex flex-col gap-4">
            <ChatInterface 
                role={activeRole} 
                caseId={caseData.id} 
                examplePrompts={caseData.examplePrompts}
                onNewBotMessage={handleNewBotMessage}
                onSourceHighlight={handleSourceHighlight}
                highlightedSourceId={highlightedSourceId}
            />
            <Timeline activeCaseId={caseData.id} />
          </div>
          <div className="w-1/3">
            <SourcesPanel 
                sources={lastBotSources} 
                onSourceHighlight={handleSourceHighlight}
                highlightedSourceId={highlightedSourceId}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseWorkspace;