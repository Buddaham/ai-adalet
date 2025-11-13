// tests/run_retrieval_eval.ts
import * as fs from 'fs';
import * as path from 'path';
import { debugRetrieveContext } from '../services/geminiService';

type GoldenTest = {
  id: string;
  caseId: string;
  question: string;
  relevant_doc_types: string[];
  relevant_pages: number[];
  must_mention_keywords?: string[];
  notes?: string;
};

type RetrievedHeader = {
  raw: string;
  docType: string;
  date: string | null;
  page: number | null;
  chunkIndex: number | null;
};

/**
 * Normalizes document type strings for consistent comparison.
 * Uses Turkish locale for correct case conversion of characters like 'İ'/'ı'.
 * @param s The string to normalize.
 * @returns The normalized string.
 */
function normalizeDocType(s: string): string {
  return s
    .trim()
    .toLocaleLowerCase('tr') // Use Turkish locale for proper case conversion
    .replace(/\s+/g, ' ');
}

// --- 1. Golden set'i yükle ---

function loadGoldenSet(): GoldenTest[] {
  // Assuming the test script is run from the project root.
  const jsonPath = path.resolve('tests', 'retrieval_golden_set.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw) as GoldenTest[];
  return data;
}

// --- 2. Context içinden header'ları parse et ---
// Format varsayımımız:
// --- [Belge: {type} | Tarih: {date} | Sayfa: {page} | Chunk: {chunk_index}] ---

const HEADER_REGEX =
  /--- \[Belge:\s*([^|]+?)\s*\|\s*Tarih:\s*([^|]+?)\s*\|\s*Sayfa:\s*(\d+|\?)\s*\|\s*Chunk:\s*(\d+)\] ---/g;

function extractHeadersFromContext(context: string): RetrievedHeader[] {
  const headers: RetrievedHeader[] = [];
  let match: RegExpExecArray | null;

  while ((match = HEADER_REGEX.exec(context)) !== null) {
    const [, docTypeRaw, dateRaw, pageRaw, chunkIndexRaw] = match;
    const docType = docTypeRaw.trim();
    const date = dateRaw.trim();
    const page = pageRaw.trim() === '?' ? null : parseInt(pageRaw.trim(), 10);
    const chunkIndex = parseInt(chunkIndexRaw.trim(), 10);

    headers.push({
      raw: match[0],
      docType,
      date,
      page: page === null || isNaN(page) ? null : page,
      chunkIndex: isNaN(chunkIndex) ? null : chunkIndex,
    });
  }

  return headers;
}

// --- 3. Tek bir test case'i değerlendir ---

type SingleTestResult = {
  test: GoldenTest;
  headers: RetrievedHeader[];
  hasDocTypeHit: boolean;
  hasPageHit: boolean;
  passed: boolean;
};

function evaluateSingleTest(test: GoldenTest): SingleTestResult {
  const context = debugRetrieveContext(test.question, test.caseId);
  const headers = extractHeadersFromContext(context);

  const relevantDocTypes = new Set(
    (test.relevant_doc_types || []).map(normalizeDocType)
  );
  const relevantPages = new Set(test.relevant_pages || []);

  let hasDocTypeHit = false;
  let hasPageHit = false;

  for (const h of headers) {
    const docTypeNorm = normalizeDocType(h.docType);

    if (relevantDocTypes.has(docTypeNorm)) {
      hasDocTypeHit = true;
    }
    if (h.page !== null && relevantPages.has(h.page)) {
      hasPageHit = true;
    }
  }

  const passed = hasDocTypeHit && hasPageHit;

  return {
    test,
    headers,
    hasDocTypeHit,
    hasPageHit,
    passed,
  };
}

// --- 4. Tüm testleri çalıştır ve raporla ---

function run(): void {
  const goldenSet = loadGoldenSet();
  if (!goldenSet.length) {
    throw new Error('Golden set boş görünüyor. `tests/retrieval_golden_set.json` dosyasını kontrol et.');
  }

  console.log(`Toplam test sayısı: ${goldenSet.length}`);
  console.log('---\n');

  let passedCount = 0;
  let docTypeOnly = 0;
  let pageOnly = 0;
  let noneHit = 0;

  for (const test of goldenSet) {
    const result = evaluateSingleTest(test);

    if (result.passed) {
      passedCount += 1;
    } else {
      if (result.hasDocTypeHit && !result.hasPageHit) {
        docTypeOnly += 1;
      } else if (!result.hasDocTypeHit && result.hasPageHit) {
        pageOnly += 1;
      } else {
        noneHit += 1;
      }
    }

    console.log(`Test ID: ${test.id}`);
    console.log(`Soru: ${test.question}`);
    console.log(`Beklenen belge tipleri: ${test.relevant_doc_types.join(', ')}`);
    console.log(`Beklenen sayfalar: ${test.relevant_pages.join(', ')}`);

    console.log('Seçilen header\'lar:');
    if (!result.headers.length) {
      console.log('  (Hiç header bulunamadı)');
    } else {
      for (const h of result.headers) {
        console.log(
          `  - ${h.raw}  => type="${h.docType}", page=${h.page}, chunk=${h.chunkIndex}`
        );
      }
    }

    console.log(
      `DocType hit: ${result.hasDocTypeHit ? '✅' : '❌'}, ` +
        `Page hit: ${result.hasPageHit ? '✅' : '❌'}, ` +
        `Genel: ${result.passed ? '✅ GEÇTİ' : '❌ KALDI'}`
    );
    console.log('---\n');
  }

  const ratio = (passedCount / goldenSet.length) * 100;
  console.log(
    `ÖZET: ${passedCount}/${goldenSet.length} test geçti (%${ratio.toFixed(1)}).`
  );
  console.log(
    `Detay: Sadece belge tipi isabeti: ${docTypeOnly}, Sadece sayfa isabeti: ${pageOnly}, Tamamen kaçırılan: ${noneHit}.`
  );
}

run();
