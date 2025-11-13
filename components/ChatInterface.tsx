import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { MessageAuthor, Role } from '../types';
import { generateCaseAnalysis } from '../services/geminiService';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';
import { SendIcon } from './icons/SendIcon';
import { BotMessage } from './BotMessage';
import { ExamplePrompts } from './ExamplePrompts';

interface ChatInterfaceProps {
  role: Role;
  caseId: string;
  examplePrompts: string[];
  onNewBotMessage: (message: Message) => void;
  onSourceHighlight: (sourceId: string | null) => void;
  highlightedSourceId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ role, caseId, examplePrompts, onNewBotMessage, onSourceHighlight, highlightedSourceId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      author: MessageAuthor.BOT,
      text: 'Merhaba! Bu dava dosyasıyla ilgili neyi merak ediyorsun? Aşağıdaki örnek sorulardan birini seçebilir veya kendi sorunu yazabilirsin.',
      role: role,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

   useEffect(() => {
    // Clear chat and sources when case changes
    setMessages([
      {
        author: MessageAuthor.BOT,
        text: 'Merhaba! Bu dava dosyasıyla ilgili neyi merak ediyorsun? Aşağıdaki örnek sorulardan birini seçebilir veya kendi sorunu yazabilirsin.',
        role: role,
      },
    ]);
    onNewBotMessage({ author: MessageAuthor.BOT, text: '', sources:[] });
  }, [caseId, role]);

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { author: MessageAuthor.USER, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    onNewBotMessage({ author: MessageAuthor.BOT, text: '', sources: [] }); // Clear sources panel while loading

    const botMessage = await generateCaseAnalysis(input, role, caseId);
    setMessages((prev) => [...prev, botMessage]);
    onNewBotMessage(botMessage);
    setIsLoading(false);
  };
  
  const getPlaceholderText = () => {
    switch(role) {
        case Role.CITIZEN:
            return "Bu davada ne iddia ediliyor? Sorun.";
        case Role.LAW_STUDENT:
            return "TCK 235'in bu davada nasıl uygulandığını sorabilirsiniz.";
        case Role.RESEARCHER:
            return "İddianame-bilirkişi tutarsızlıklarını sorabilirsiniz.";
        default:
            return "Sorunu buraya yaz...";
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full overflow-hidden border border-gray-700">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.author === MessageAuthor.USER ? 'justify-end' : ''
              }`}
            >
              {msg.author === MessageAuthor.BOT && (
                <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center">
                  <BotIcon />
                </div>
              )}
              <div
                className={`max-w-xl rounded-lg ${
                  msg.author === MessageAuthor.USER
                    ? 'bg-cyan-600 text-white p-3'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {msg.author === MessageAuthor.BOT ? (
                    <BotMessage 
                        message={msg} 
                        onSourceHighlight={onSourceHighlight} 
                        highlightedSourceId={highlightedSourceId}
                    />
                ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
              {msg.author === MessageAuthor.USER && (
                 <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center">
                  <UserIcon />
                </div>
              )}
            </div>
          ))}
          {messages.length <= 1 && <ExamplePrompts prompts={examplePrompts} onSelect={handlePromptSelect} />}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center"><BotIcon /></div>
              <div className="max-w-xl p-3 rounded-lg bg-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                  <span>Analiz ediliyor...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholderText()}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 text-white rounded-lg p-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;