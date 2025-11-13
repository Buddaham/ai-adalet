
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import CaseLibrary from './components/CaseLibrary';
import CaseWorkspace from './components/CaseWorkspace';
import LegalPage from './components/LegalPage';
import { CASES } from './constants';
import type { Case } from './types';

type Page = 'landing' | 'library' | 'workspace' | 'legal';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [activeCase, setActiveCase] = useState<Case | null>(null);

  const handleSelectCase = (caseId: string) => {
    const selectedCase = CASES.find(c => c.id === caseId);
    if (selectedCase && selectedCase.status === 'beta') {
      setActiveCase(selectedCase);
      setCurrentPage('workspace');
    }
  };

  const handleGoToLibrary = () => {
    setCurrentPage('library');
  };

  const handleGoHome = () => {
    setActiveCase(null);
    setCurrentPage('landing');
  };
  
  const handleBackToLibrary = () => {
    setActiveCase(null);
    setCurrentPage('library');
  };

  const handleGoToLegal = () => {
    setCurrentPage('legal');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGoToLibrary={handleGoToLibrary} onSelectCase={handleSelectCase} onGoToLegal={handleGoToLegal} />;
      case 'library':
        return <CaseLibrary cases={CASES} onSelectCase={handleSelectCase} onGoHome={handleGoHome} />;
      case 'workspace':
        if (activeCase) {
          return <CaseWorkspace caseData={activeCase} onBackToLibrary={handleBackToLibrary} />;
        }
        setCurrentPage('library'); 
        return null;
      case 'legal':
        return <LegalPage onGoHome={handleGoHome} onGoToLibrary={handleGoToLibrary} />;
      default:
        return <LandingPage onGoToLibrary={handleGoToLibrary} onSelectCase={handleSelectCase} onGoToLegal={handleGoToLegal} />;
    }
  };

  return (
    <div className="h-screen font-sans bg-gray-900 text-gray-200">
      {renderPage()}
    </div>
  );
};

export default App;
