import React from 'react';
import type { Source } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';

interface SourcesPanelProps {
  sources: Source[] | undefined;
  highlightedSourceId: string | null;
  onSourceHighlight: (sourceId: string | null) => void;
}

const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, highlightedSourceId, onSourceHighlight }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg h-full flex flex-col border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-md font-semibold text-cyan-400 flex items-center gap-2">
          <DocumentIcon />
          Yanıt Kaynakları
        </h3>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {sources && sources.length > 0 ? (
          <ul className="space-y-3">
            {sources.map((source) => (
              <li key={source.id}>
                <button
                  onClick={() => onSourceHighlight(source.id === highlightedSourceId ? null : source.id)}
                  className={`w-full text-left bg-gray-700 p-3 rounded-md border border-gray-600 transition-all hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    highlightedSourceId === source.id ? 'border-cyan-400 ring-2 ring-cyan-500' : ''
                  }`}
                >
                  <p className="font-bold text-sm text-gray-200">
                    {source.type}
                    {source.page && <span className="font-normal text-gray-400"> - Sayfa {source.page}</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tarih: {source.date || 'Belirtilmemiş'} | Chunk: {source.chunkIndex ?? '?'}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            <p className="text-sm">Bir soru sorduktan sonra ilgili kaynaklar burada listelenir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourcesPanel;