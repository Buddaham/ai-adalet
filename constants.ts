import { Case, CaseDocument, TckArticle, TimelineEvent } from './types';
import { imamogluIddianameChunks } from './src/data/imamoglu_iddianame_chunks';

export const CASES: Case[] = [
  {
    id: 'imamoglu-sogutlucesme',
    name: 'İmamoğlu Söğütlüçeşme İhalesi Davası',
    description:
      'Söğütlüçeşme aktarma merkezi ihalesi sürecinde belirli şirketlere avantaj sağlandığı ve rekabetin bozulduğu iddialarına ilişkin kamu ihalesi davası.',
    summary: 'İhale sürecine ilişkin yolsuzluk / kamu zararı iddiaları. TCK 235, 257 odaklı.',
    tags: ['TCK 235', 'TCK 257', 'Kamu Zararı', 'Yolsuzluk'],
    status: 'beta',
    docTypes: ['İddianame', 'Bilirkişi Raporu', 'Duruşma Tutanağı'],
    pageCount: 4000,
    examplePrompts: [
        "Bu davada temel iddialar nelerdir?",
        "Bilirkişi raporunda kamu zararı nasıl hesaplanmış?",
        "Zaman çizelgesine göre kritik tarihler nelerdir?"
    ]
  },
  {
    id: 'gezi-park',
    name: 'Gezi Parkı Olayları Davası',
    description:
      'Gezi Parkı protestoları sırasında gerçekleşen eylemler ve bu eylemlere ilişkin örgütlenme iddiaları üzerine açılan ceza davası.',
    summary: 'Toplantı ve gösteri yürüyüşleri kanununa muhalefet ve hükümeti devirmeye teşebbüs iddiaları.',
    tags: ['TCK 312', 'TCK 220', 'Toplantı ve Gösteri'],
    status: 'coming_soon',
    docTypes: ['İddianame', 'Mahkeme Kararı', 'Tanık İfadeleri'],
    pageCount: 10000,
    examplePrompts: []
  },
];

export const CASE_DOCUMENTS: CaseDocument[] = [
  // Eskiden elle yazılan iddianame yerine, script'ten gelen chunk'lar eklendi
  ...imamogluIddianameChunks,
  {
    id: 'bilirkisi-01',
    caseId: 'imamoglu-sogutlucesme',
    type: 'Bilirkişi Raporu',
    date: '2021-06-10',
    page: 8,
    content: `
[Bilirkişi Raporu – Örnek Parçalar]

Bölüm 3.1 – İhale Bedeli Analizi:
Bilirkişi heyeti, ihale konusu iş için sunulan teklifleri,
piyasa rayiç bedelleri ve önceki benzer projelerle karşılaştırmıştır.
Rapor, kazanan teklifin bazı kalemlerde emsallerine göre anlamlı biçimde yüksek,
bazı kalemlerde ise olağandışı şekilde düşük olduğunu tespit ettiğini bildirmektedir.

Bölüm 4.2 – Teknik Yeterlilik Değerlendirmesi:
Bazı firmaların teknik yeterlilik evraklarında eksiklik olmasına rağmen
değerlendirmeye dahil edildiği, buna karşılık bazı firmaların küçük eksiklikler
nedeniyle elendiği ifade edilmekte; bu durumun eşitlik ilkesine aykırılık
iddialarını güçlendirdiği belirtilmektedir.

Bölüm 5.4 – Kamu Zararı Hesabı:
Rapor, ihale sürecinin mevzuata uygun yürütülmemesi halinde
oluşabilecek yaklaşık kamu zararını farklı senaryolarla hesaplamakta
ve ilgili tablolara atıf yapmaktadır.
`,
  },
  {
    id: 'durusma-01',
    caseId: 'imamoglu-sogutlucesme',
    type: 'Duruşma Tutanağı',
    date: '2022-03-01',
    page: 2,
    content: `
[Duruşma Tutanağı – Örnek Parçalar]

Duruşma Tarihi: 01.03.2022

- Mahkeme başkanı, iddianamenin özetini duruşma salonunda okumuş,
  sanıklara isnat edilen suçları ana hatlarıyla açıklamıştır.
- Sanıklardan biri, ihale sürecine ilişkin tüm kararların
  ilgili mevzuat ve üst makamların talimatları doğrultusunda alındığını savunmuş,
  herhangi bir kişisel menfaat sağlamadığını ifade etmiştir.
- Katılan vekili, ihalenin kamu zararına yol açtığını,
  rekabetin engellendiğini ve belediyenin mali açıdan zarara uğratıldığını ileri sürmüştür.
- Mahkeme, bir sonraki celsede dinlenmek üzere yeni tanıkların çağrılmasına
  ve ek bilirkişi raporu alınmasına karar vermiştir.
`,
  },
  {
    id: 'gezi-iddianame-01',
    caseId: 'gezi-park',
    type: 'İddianame',
    date: '2019-02-19',
    page: 1,
    content: `
[Gezi Parkı Davası – İddianame Özet Parçası]

İddianamede, sanıkların Gezi Parkı protestolarını organize ederek
Türkiye Cumhuriyeti Hükümeti'ni ortadan kaldırmaya veya görevlerini yapmasını
kısmen ya da tamamen engellemeye teşebbüs ettikleri iddia edilmektedir.

Belgede, sanıklar arasında koordinasyon sağlandığı, finansman desteği verildiği
ve sosyal medya üzerinden eylemlerin yaygınlaştırılmaya çalışıldığı ileri sürülmektedir.
[Not: Örnek içerik; gerçek davadan alıntı yapmak istersen burayı değiştir.]
`,
  },
];

export const TCK_ARTICLES: TckArticle[] = [
  {
    id: 'tck-247',
    caseId: 'imamoglu-sogutlucesme',
    madde_no: 247,
    title: 'Zimmet',
    korunan_hukuki_deger: 'Kamu idaresine duyulan güven ve kamu malının korunması',
    content: `
TCK m.247, kamu görevlisinin sorumluluğuna bırakılan malı
kendisi veya başkası lehine kullanmasını veya sahiplenmesini
"zimmet" suçu olarak düzenler.
Bu maddede, kamu görevlisinin görevi nedeniyle zilyet olduğu malın
kamuya ait olması ve fiilin kasten gerçekleştirilmesi önemli unsurlardır.
`,
  },
  {
    id: 'tck-252',
    caseId: 'imamoglu-sogutlucesme',
    madde_no: 252,
    title: 'Rüşvet',
    korunan_hukuki_deger: 'Kamu idaresinin tarafsızlığı ve dürüstlüğü',
    content: `
TCK m.252, bir kamu görevlisinin göreviyle ilgili bir işin yapılması veya yapılmaması için
menfaat temin etmesini veya talep etmesini rüşvet suçu olarak ele alır.
Suçun oluşması için hem menfaat sağlayan hem de menfaat kabul eden tarafın iradesi önemlidir.
İhale süreçlerinde belirli firmalara avantaj sağlanması karşılığında menfaat temini iddiaları,
bu madde kapsamında değerlendirilebilir.
`,
  },
  {
    id: 'tck-235',
    caseId: 'imamoglu-sogutlucesme',
    madde_no: 235,
    title: 'İhaleye Fesat Karıştırma',
    korunan_hukuki_deger: 'Kamu ihalelerinde şeffafflık, eşitlik ve rekabet',
    content: `
TCK m.235, kamu kurumlarının yaptığı ihalelere hile karıştırmayı,
rekabeti ortadan kaldıracak anlaşmalar yapmayı veya süreci manipüle etmeyi
suç olarak düzenler.
İhale şartnamesinin belli firmaları kayıracak şekilde hazırlanması
veya ihale komisyonu kararlarının objektif kriterlerden sapması,
bu madde kapsamında tartışma konusu olabilir.
`,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: '2020-08-01',
    title: 'İhale İlanı Yayınlandı',
    description: 'Söğütlüçeşme aktarma merkezi projesine ilişkin ihale ilanı resmi olarak duyuruldu.',
    caseId: 'imamoglu-sogutlucesme',
  },
  {
    date: '2020-11-10',
    title: 'İhale Sonucu Açıklandı',
    description: 'İhale komisyonu, belirli bir şirketin ekonomik açıdan en avantajlı teklif verdiğini açıklayarak ihaleyi sonuçlandırdı.',
    caseId: 'imamoglu-sogutlucesme',
  },
  {
    date: '2020-12-15',
    title: 'Soruşturma ve İddianame Düzenlendi',
    description: 'Savcılık, ihale sürecinde usulsüzlük iddialarına ilişkin soruşturma sonucunda iddianame hazırladı.',
    caseId: 'imamoglu-sogutlucesme',
  },
  {
    date: '2022-03-01',
    title: 'İlk Duruşma Görüldü',
    description: 'Mahkeme, davanın ilk duruşmasında sanıkların savunmalarını aldı ve yeni deliller toplanmasına karar verdi.',
    caseId: 'imamoglu-sogutlucesme',
  },
];