import React from 'react';

interface ExamplePromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ prompts, onSelect }) => {
  if (!prompts || prompts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 justify-center">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onSelect(prompt)}
          className="bg-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-lg border border-gray-600 transition-colors hover:bg-gray-600 hover:text-white"
        >
          "{prompt}"
        </button>
      ))}
    </div>
  );
};