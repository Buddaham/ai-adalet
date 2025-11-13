export interface Case {
  id: string;            // "imamoglu-sogutlucesme" gibi
  name: string;          // Kullanıcıya görünen ad
  description: string;   // Kısa açıklama (1–2 cümle)
  summary: string;       // Kartlarda kullanılacak daha kısa özet
  tags: string[];        // TCK maddeleri gibi etiketler
  status: 'beta' | 'coming_soon'; // Dava durumu
  docTypes: string[];    // "İddianame", "Bilirkişi" gibi
  pageCount: number;     // Toplam sayfa sayısı (yaklaşık)
  examplePrompts: string[]; // Sohbet için örnek sorular
}

export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export enum Role {
  CITIZEN = 'Citizen',
  LAW_STUDENT = 'Law Student',
  RESEARCHER = 'Researcher',
}

export interface Message {
  author: MessageAuthor;
  text: string;
  sources?: Source[];
  role?: Role;
}

export interface Source {
  id: string; // "--- [Belge: ... | ... ] ---" formatındaki tam başlık
  type: string;
  date: string | null;
  page: number | null;
  chunkIndex: number | null;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  type: string;
  date: string;
  content: string;
  page?: number;
  chunk_index?: number;
}

export interface TckArticle {
  id: string;
  caseId?: string;
  madde_no: number;
  title: string;
  content: string;
  korunan_hukuki_deger: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  caseId: string;
}