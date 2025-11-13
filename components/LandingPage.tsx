
import React from 'react';

interface LandingPageProps {
  onGoToLibrary: () => void;
  onSelectCase: (caseId: string) => void;
  onGoToLegal: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGoToLibrary, onSelectCase, onGoToLegal }) => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold text-cyan-400 mb-4">
            AI Adalet
          </h1>
          <p className="text-xl text-gray-300">
            Dava belgeleriyle konuşan dijital asistan
          </p>
          <p className="text-md text-gray-400 mt-4 max-w-2xl mx-auto">
            Türk ceza hukuku (TCK) odaklı büyük davaları; iddianame, bilirkişi raporu ve tutanaklardan beslenen şeffaf bir sohbet arayüzüyle keşfedin. Hukuki tavsiye değil, belge temelli bilgi sunar.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={onGoToLibrary} className="bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-transform hover:scale-105">
              Dava Kütüphanesine Git
            </button>
             <button onClick={() => onSelectCase('imamoglu-sogutlucesme')} className="bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-lg transition-transform hover:scale-105">
              İmamoğlu Davasını İncele &rarr;
            </button>
          </div>
        </header>

        <section id="how-it-works" className="py-12">
          <h2 className="text-3xl font-bold mb-8">Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <span className="text-2xl font-bold text-cyan-500">1.</span>
              <h3 className="text-xl font-semibold mt-2 mb-2">Dava Seç</h3>
              <p className="text-gray-400">Dava kütüphanesinden incelemek istediğiniz dosyayı seçin.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <span className="text-2xl font-bold text-cyan-500">2.</span>
              <h3 className="text-xl font-semibold mt-2 mb-2">Rolünü Belirle</h3>
              <p className="text-gray-400">"Vatandaş", "Hukuk Öğrencisi" veya "Araştırmacı" modlarından birini seçerek alacağınız cevabın dilini ve derinliğini ayarlayın.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <span className="text-2xl font-bold text-cyan-500">3.</span>
              <h3 className="text-xl font-semibold mt-2 mb-2">Sor ve Kaynakları Gör</h3>
              <p className="text-gray-400">Sorunuzu sorun; sistem hem yanıtı hem de dayandığı belge ve sayfa numaralarını şeffaf bir şekilde göstersin.</p>
            </div>
          </div>
        </section>
        
        <section id="trust" className="py-12">
           <h2 className="text-3xl font-bold mb-8">Güven & Şeffaflık</h2>
           <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4 text-left">
                <p>✅ Tüm cevaplar, sistemdeki dava belgelerine dayalıdır.</p>
                <p>✅ Her cevap sonunda ‘Kaynaklar:’ bölümü ile belge ve sayfa gösterilir.</p>
                <p>⚖️ Bu bir avukat değildir; hukuki tavsiye vermez, yalnızca bilgi amaçlıdır.</p>
           </div>
        </section>
      </div>
      <footer className="absolute bottom-8 text-center text-gray-500 text-sm">
        <a href="#" onClick={(e) => { e.preventDefault(); onGoToLegal(); }} className="hover:text-cyan-400 transition-colors">
          Kullanım Koşulları ve Gizlilik
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
