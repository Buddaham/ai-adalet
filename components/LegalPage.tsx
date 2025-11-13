
import React from 'react';

const LegalPage: React.FC<{ onGoHome: () => void; onGoToLibrary: () => void }> = ({ onGoHome, onGoToLibrary }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="max-w-4xl mx-auto p-8">
        <header className="mb-12">
          <nav className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-cyan-400">AI Adalet</h1>
              <div>
                  <button onClick={onGoHome} className="text-sm text-gray-400 hover:text-cyan-400 mr-4">Ana Sayfa</button>
                  <button onClick={onGoToLibrary} className="text-sm text-gray-400 hover:text-cyan-400">Dava Kütüphanesi</button>
              </div>
          </nav>
          <h2 className="text-3xl font-bold text-center text-gray-100">Kullanım Koşulları, Gizlilik ve SSS</h2>
        </header>

        <main>
          {/* Existing Sections */}
          <section className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Önemli Yasal Bilgilendirme
            </h2>
            <p className="text-gray-400">
              AI Adalet, deneysel bir araştırma projesi ve bir eğitim aracıdır. Bu platformu kullanarak aşağıda belirtilen koşulları anladığınızı ve kabul ettiğinizi beyan edersiniz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Kullanım Koşulları
            </h2>
            <div className="space-y-4 text-gray-300">
               <h3 className="font-semibold text-lg text-gray-200">1. Hukuki Tavsiye Reddi (UPL Uyarısı)</h3>
              <p>AI Adalet bir avukat değildir ve hiçbir yanıtı, hukuki tavsiye veya avukatlık hizmeti niteliği taşımaz. Platform, yalnızca kamuya açık dava dosyalarından hareketle bilgi amaçlı özetler üretir. Somut hukuki durumlarınız, davalarınız veya işlemleriniz için mutlaka ruhsatlı bir avukata danışmalısınız.</p>

              <h3 className="font-semibold text-lg text-gray-200">2. Avukat-Müvekkil İlişkisi Yoktur</h3>
              <p>Bu platformu kullanmanız, platformun geliştiricileri veya kendisi ile aranızda Avukatlık Kanunu kapsamında bir avukat-müvekkil ilişkisi kurmaz. Platform üzerinden sağlanan bilgiler, hiçbir şekilde vekalet ilişkisi veya gizlilik taahhüdü yerine geçmez.</p>

              <h3 className="font-semibold text-lg text-gray-200">3. Sorumluluğun Sınırlandırılması</h3>
              <p>AI Adalet tarafından üretilen bilgilerde hatalar, eksiklikler veya güncel olmayan veriler bulunabilir. Bilgilerin doğruluğu garanti edilmez. Bu bilgilere dayanarak alacağınız kararlardan veya yapacağınız işlemlerden doğacak sonuçlardan tamamen siz sorumlusunuz.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Gizlilik Politikası
            </h2>
             <div className="space-y-4 text-gray-300">
                <h3 className="font-semibold text-lg text-gray-200">1. Kişisel Verilerin Girilmemesi</h3>
                <p>Lütfen bu platforma kendi davanıza veya üçüncü kişilere ilişkin kişisel, hassas, gizli veya kimlik belirleyici bilgiler (isim, T.C. kimlik numarası, adres, dava numarası vb.) GİRMEYİN. Sistem, sadece tanımlı örnek davalar üzerinde çalışmak üzere tasarlanmıştır.</p>

                <h3 className="font-semibold text-lg text-gray-200">2. Veri İşleme ve Geri Bildirim</h3>
                <p>Kapalı beta sürecinde, sistemin performansını ve doğruluğunu iyileştirmek amacıyla, anonimleştirilmiş soru-cevap çiftleri, seçilen roller ve verdiğiniz 👍/👎 geri bildirimleri kayıt altına alınabilir. Bu veriler, kişisel kimliğinizle ilişkilendirilmez ve yalnızca istatistiksel analiz ve sistemin geliştirilmesi için kullanılır.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Yapay Zekâ Sorumluluk Reddi (AI Disclaimer)
            </h2>
             <div className="space-y-4 text-gray-300">
                <h3 className="font-semibold text-lg text-gray-200">1. Yapay Zekâ Tarafından Üretilmiştir</h3>
                <p>Bu platformdaki yanıtlar, bir yapay zekâ (Büyük Dil Modeli) tarafından üretilmektedir. Yapay zekâ sistemleri doğaları gereği hatalar yapabilir, yanlış bilgiler üretebilir (halüsinasyon) veya belgelerdeki nüansları kaçırabilir.</p>

                <h3 className="font-semibold text-lg text-gray-200">2. Doğrulama Sorumluluğu</h3>
                <p>Üretilen yanıtlara dayanarak herhangi bir eylemde bulunmadan önce, yanıtta belirtilen kaynakları (dava belgesi, sayfa numarası vb.) bizzat incelemeniz ve bilgiyi teyit etmeniz kritik öneme sahiptir. Nihai doğrulama sorumluluğu kullanıcıya aittir.</p>
            </div>
          </section>
          
          {/* New FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Sıkça Sorulan Sorular (SSS)
            </h2>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="font-semibold text-lg text-gray-200">
                  1. AI Adalet hukuki tavsiye veriyor mu?
                </h3>
                <p className="text-gray-400 mt-1">
                  Hayır. AI Adalet bir avukat değildir ve hukuki tavsiye vermez. Yalnızca sisteme tanımlanmış dava dosyalarına ait belgeleri (iddianame, bilirkişi raporu, tutanaklar vb.) özetleyerek bilgi amaçlı açıklamalar üretir. Somut hukuki işlemleriniz için her zaman bir avukata danışmanız gerekir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-200">
                  2. Kendi davamla ilgili soru sorabilir miyim?
                </h3>
                <p className="text-gray-400 mt-1">
                  Hayır. Platform şu anda yalnızca sistemde önceden tanımlanmış örnek davalar üzerinde çalışmaktadır. Kendi kişisel davanızla ilgili bilgi veya belge paylaşmamanız önemlidir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-200">
                  3. Sorduğum sorular ve geri bildirimler nasıl kullanılıyor?
                </h3>
                <p className="text-gray-400 mt-1">
                  Beta sürecinde, sistemin iyileştirilmesi amacıyla soru–cevap etkileşimleri ve geri bildirimleriniz anonimleştirilmiş şekilde analiz edilir. Bu veriler, yalnızca AI Adalet’in doğruluğunu, açıklayıcılığını ve kullanıcı deneyimini geliştirmek için kullanılır.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-200">
                  4. Şu anda hangi davalar sistemde var?
                </h3>
                <p className="text-gray-400 mt-1">
                  Beta aşamasında AI Adalet, sınırlı sayıda örnek dava dosyası üzerinde çalışmaktadır (örneğin: İmamoğlu – Söğütlüçeşme ihalesi davası). Geri bildirimleriniz, hangi yeni davalara öncelik verileceğini belirlememizde bize yol gösterecektir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-200">
                  5. Hatalı veya eksik bir cevap görürsem ne yapmalıyım?
                </h3>
                <p className="text-gray-400 mt-1">
                  İlk adım olarak, ilgili cevabın altındaki **👎** butonunu kullanabilirsiniz. Ek olarak, beta programı iletişim kanallarımız üzerinden (örneğin size gönderilen hoş geldin e-postasına yanıt vererek) hangi soruda neyin yanlış veya eksik olduğunu kısaca paylaşabilirsiniz. Bu tür örnekler, bizim için en değerli test vakalarıdır.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LegalPage;
