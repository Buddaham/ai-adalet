// src/services/geminiService.ts

import { GoogleGenAI } from "@google/genai";
import {
  Role,
  MessageAuthor,
  type CaseDocument,
  type TckArticle,
  type Message,
  type Source,
} from "../types";
import { CASE_DOCUMENTS, TCK_ARTICLES } from "../constants";

// 🔐 API key'i sadece environment variable'lardan oku
const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_API_KEY ||
  "";

if (!API_KEY) {
  console.warn(
    "VITE_GEMINI_API_KEY environment variable set edilmemiş. AI özellikleri çalışmayacak."
  );
}

// GoogleGenAI client'ını env'den okunan key ile başlat
const ai = new GoogleGenAI({
  apiKey: API_KEY || "NO_API_KEY_FOUND",
});

function getRoleBasedSystemInstruction(role: Role): string {
  const base = `
Sen "AI Adalet" adlı, sadece bu uygulamada yüklü olan dava dosyasına ait
resmi / kamuya açık belgeleri (iddianname, mahkeme kararı, duruşma tutanağı,
bilirkişi raporu vb.) okuyup açıklayan bir yapay zekâ dava asistanısın.

- Bir avukat değilsin, hukuki danışmanlık vermezsin; sadece bilgilendirirsin.
- Yalnızca BU davayla ilgili konuşursun. Farklı davalar, soruşturmalar,
  siyasi tartışmalar, genel "Türkiye siyaseti / FETÖ / Gezi / Ergenekon / ekonomi"
  soruları geldiğinde şu cevabı verirsin ve başka açıklama yapmazsın:
  "Bu mod yalnızca bu dava dosyasına odaklıdır. Bu soru kapsam dışıdır."
- Cevaplarını daima sağlanan belgelere dayandırırsın. Belgede olmayan bilgiyi
  tahmin etmez, uydurmazsın. Yeterli bilgi yoksa açıkça:
  "Bu konuda elimdeki belgelerde bilgi bulunmuyor." dersin.
- Masumiyet karinesine uygun, tarafsız ve saygılı bir dil kullanırsın.
  "Sanık", "hakkında şu iddia vardır", "mahkeme kararında şöyle kabul edilmiştir"
  gibi nötr ifadeler kullanırsın.
- Siyasi propaganda, hakaret, alaycı üslup kullanmazsın.
- Her cevabın en sonunda mutlaka şu cümleyi eklersin:
  "Bu bir hukuki tavsiye değildir."
`;

  switch (role) {
    case Role.CITIZEN:
      return (
        base +
        `
Vatandaş modu:
- Basit ve anlaşılır Türkçe kullan.
- Hukuk terimlerini (örneğin "ihaleye fesat", "zimmet") kullandığında
  parantez içinde kısaca açıkla.
- Önce 1–2 cümlelik kısa bir özet ver, ardından 3–5 maddelik detay sun.
`
      );
    case Role.LAW_STUDENT:
      return (
        base +
        `
Hukuk öğrencisi modu:
- Daha teknik bir dil kullanabilirsin.
- İlgili olabilecek TCK maddelerini belirt ve belgedeki ifadeleri bu maddelerle ilişkilendir.
- Örnek: "İddianamede TCK m.252'ye şu bölümde atıf yapılıyor: [İddianame, s. 34]".
- Önce kısa özet, sonra maddeli, gerektiğinde paragraf içi alıntılarla detay ver.
`
      );
    case Role.RESEARCHER:
      return (
        base +
        `
Araştırmacı modu:
- Daha detaylı, analitik ve uzun yanıtlar ver.
- İddialar, deliller, bilirkişi tespitleri ve mahkeme gerekçelerini ayrı ayrı özetle.
- Metinden alıntı yaparken belge ve sayfa bilgisini köşeli parantezle göster
  (örneğin [İddianame, s. 12], [Bilirkişi Raporu, s. 8]).
- Cevabın sonunda "Kaynaklar:" başlığıyla kullandığın belge/sayfa referanslarını listele.
`
      );
    default:
      return base;
  }
}

const TOP_K_CHUNKS = 10; // Context için seçilecek en iyi chunk sayısı

function retrieveRelevantContext(query: string, caseId: string): string {
  const queryLower = query.toLowerCase();
  // Basit tokenizer: boşluklara göre ayır ve 2 karakterden uzun kelimeleri al
  const queryTokens = queryLower
    .split(/\s+/)
    .filter((token) => token.length > 2);

  // 1. Aktif davaya ait belgeleri filtrele
  const caseDocs: CaseDocument[] = CASE_DOCUMENTS.filter(
    (doc) => doc.caseId === caseId
  );
  const caseArticles: TckArticle[] = TCK_ARTICLES.filter(
    (article) => !article.caseId || article.caseId === caseId
  );

  // 2. Belgeleri sorguyla alaka düzeyine göre puanla
  const scoredDocs = caseDocs
    .map((doc) => {
      const contentLower = doc.content.toLowerCase();
      const typeLower = doc.type.toLowerCase();

      let score = 0;
      // İçerikteki token eşleşmelerine göre puan ver
      queryTokens.forEach((token) => {
        if (contentLower.includes(token)) {
          score++;
        }
      });

      // Belge tipi sorguda geçiyorsa puanı artır
      if (queryLower.includes(typeLower)) {
        score += 3;
      }

      return { ...doc, score };
    })
    .filter((doc) => (doc as any).score > 0); // Sadece en az bir eşleşme olanları tut

  // 3. TCK Maddelerini benzer şekilde puanla
  const scoredArticles = caseArticles
    .map((article) => {
      const contentLower = article.content.toLowerCase();
      const titleLower = article.title.toLowerCase();
      const maddeNoStr = String(article.madde_no);

      let score = 0;
      queryTokens.forEach((token) => {
        if (contentLower.includes(token) || titleLower.includes(token)) {
          score++;
        }
      });

      // Madde numarası direkt geçiyorsa puanı ciddi artır
      if (query.includes(maddeNoStr)) {
        score += 5;
      }

      return { ...article, score };
    })
    .filter((article) => (article as any).score > 0);

  // 4. Puana göre sırala ve en iyi K tanesini al
  scoredDocs.sort((a, b) => (b as any).score - (a as any).score);
  scoredArticles.sort((a, b) => (b as any).score - (a as any).score);

  const topDocs = scoredDocs.slice(0, TOP_K_CHUNKS);
  const topArticles = scoredArticles.slice(0, 3); // Maddelerden daha az alalım

  // 5. Standartlaştırılmış başlıklarla context metnini oluştur
  let context = "İlgili Dava Belgeleri:\n";
  if (topDocs.length > 0) {
    topDocs.forEach((doc) => {
      const pageInfo = doc.page ? `Sayfa: ${doc.page}` : "Sayfa: ?";
      const chunkInfo =
        doc.chunk_index !== undefined
          ? `Chunk: ${doc.chunk_index}`
          : "Chunk: 0";
      context += `--- [Belge: ${doc.type} | Tarih: ${doc.date} | ${pageInfo} | ${chunkInfo}] ---\n${doc.content}\n\n`;
    });
  } else {
    context += "Sorunuzla ilgili spesifik bir belge parçası bulunamadı.\n\n";
  }

  context += "İlgili Mevzuat (Türk Ceza Kanunu):\n";
  if (topArticles.length > 0) {
    topArticles.forEach((article) => {
      context += `--- [Mevzuat: TCK Madde ${article.madde_no}: ${article.title}] ---\n${article.content}\n\n`;
    });
  } else {
    context += "Sorunuzla ilgili spesifik bir TCK maddesi bulunamadı.\n\n";
  }

  // Eşleşme bulunamazsa verilecek fallback cevabı
  if (topDocs.length === 0 && topArticles.length === 0) {
    return "Bu konuda dava dosyalarında veya ilgili mevzuatta spesifik bir bilgi bulunamadı.";
  }

  return context;
}

const HEADER_REGEX =
  /--- \[Belge: ([^|]+) \| Tarih: ([^|]+) \| Sayfa: ([^|]+) \| Chunk: ([^\]]+)\] ---/g;

function parseSourcesFromText(text: string): Source[] {
  const sources: Source[] = [];
  const kaynaklarSection = text.split("Kaynaklar:")[1];
  if (!kaynaklarSection) return [];

  let match: RegExpExecArray | null;
  const regex =
    /--- \[Belge:\s*([^|]+?)\s*\|\s*Tarih:\s*([^|]+?)\s*\|\s*Sayfa:\s*([^|]+?)\s*\|\s*Chunk:\s*([^\]]+?)\] ---/g;

  while ((match = regex.exec(kaynaklarSection)) !== null) {
    const pageStr = match[3].trim();
    const page =
      pageStr === "?" || Number.isNaN(parseInt(pageStr, 10))
        ? null
        : parseInt(pageStr, 10);
    const chunkIndexRaw = parseInt(match[4].trim(), 10);
    const chunkIndex = Number.isNaN(chunkIndexRaw) ? null : chunkIndexRaw;

    sources.push({
      id: match[0], // Tüm header benzersiz ID
      type: match[1].trim(),
      date: match[2].trim(),
      page,
      chunkIndex,
    });
  }

  return sources;
}

export async function generateCaseAnalysis(
  query: string,
  role: Role,
  caseId: string
): Promise<Message> {
  if (!API_KEY) {
    return {
      author: MessageAuthor.BOT,
      text:
        "AI anahtarı yapılandırılmamış görünüyor. " +
        "Lütfen Vercel ayarlarında VITE_GEMINI_API_KEY ortam değişkenini ekleyin. " +
        "Şu an gösterilen metin sadece yer tutucudur.",
    };
  }

  try {
    const systemInstruction = getRoleBasedSystemInstruction(role);
    const context = retrieveRelevantContext(query, caseId);

    const prompt = `
Kullanıcı rolü: ${role}
Kullanıcı sorusu: ${query}

Aşağıda bu davaya ait belgelerden ve TCK'dan alınmış ilgili kısımlar yer alıyor.
Bu bağlamın DIŞINA ÇIKMA. Belgelerde olmayan bilgi üretme.
Yeterli bilgi yoksa açıkça "Bu konuda elimdeki belgelerde bilgi bulunmuyor." de.

[BAĞLAM BAŞLANGICI]
${context}
[BAĞLAM BİTİŞİ]

YANIT FORMATIN:
1. Önce 1–2 cümlelik kısa bir özet yaz.
2. Ardından 3–7 maddelik detaylı açıklama yap.
3. Cevabının en sonunda mutlaka "Kaynaklar:" başlığını kullan ve kullandığın belge referanslarını
   (context içinde gördüğün --- [Belge: ... | Tarih: ... | Sayfa: ... | Chunk: ...] ---
   veya --- [Mevzuat: ...] --- satırlarından) madde madde aynen kopyalayarak listele.
   Eğer context içinde hiç böyle satır yoksa veya sağlam referans bulamıyorsan,
   "Kaynaklar:" başlığından sonra "- Bu konuda elimdeki belgelerde yeterli bilgi bulunmuyor." yaz.

Her cevabının en sonunda şu cümle mutlaka yer almalı:
"Bu bir hukuki tavsiye değildir."
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    // Farklı SDK versiyonları için olası text alanlarını güvenli şekilde yakala
    const anyRes = response as any;
    const text =
      (typeof anyRes.text === "function" && anyRes.text()) ||
      anyRes.text ||
      anyRes.response?.text?.() ||
      "";

    const sources = parseSourcesFromText(text);

    return {
      author: MessageAuthor.BOT,
      text,
      sources,
      role,
    };
  } catch (error) {
    console.error("Error generating analysis:", error);
    return {
      author: MessageAuthor.BOT,
      text:
        "İsteği analiz ederken bir hata oluştu. Lütfen daha sonra tekrar deneyin. " +
        "Bu bir hukuki tavsiye değildir.",
    };
  }
}

// ⬇️ Testlerde kullanmak için basit bir wrapper export edelim:
export function debugRetrieveContext(query: string, caseId: string): string {
  return retrieveRelevantContext(query, caseId);
}
