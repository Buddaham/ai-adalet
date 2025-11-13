// tests/run_answer_eval.ts
import * as fs from 'fs';
import * as path from 'path';
import { generateCaseAnalysis } from '../services/geminiService';
import { Role } from '../types';

type GoldenTest = {
  id: string;
  caseId: string;
  question: string;
  // Retrieval fields (not used here, but part of the file)
  relevant_doc_types: string[];
  relevant_pages: number[];
  notes?: string;

  // Answer evaluation fields
  answer_should_contain?: string[];
  answer_must_include_disclaimer?: boolean;
  answer_must_have_sources_section?: boolean;
};

// --- 1. Golden set'i yükle ---

function loadGoldenSet(): GoldenTest[] {
  // Assuming the test script is run from the project root.
  const jsonPath = path.resolve('tests', 'retrieval_golden_set.json');
  if (!fs.existsSync(jsonPath)) {
     throw new Error(`Golden set file not found at: ${jsonPath}`);
  }
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw) as GoldenTest[];
  return data;
}

// --- 2. Tek bir test case'i değerlendir ---

type SingleTestResult = {
  test: GoldenTest;
  generatedAnswer: string;
  passed: boolean;
  checks: {
    containsKeywords: boolean;
    hasDisclaimer: boolean;
    hasSources: boolean;
  };
};

const DISCLAIMER_TEXT = "Bu bir hukuki tavsiye değildir.";
const SOURCES_HEADER = "Kaynaklar:";

async function evaluateSingleTest(test: GoldenTest, role: Role): Promise<SingleTestResult> {
  const response = await generateCaseAnalysis(test.question, role, test.caseId);
  const answerText = response.text.toLowerCase();

  // Keyword check
  const keywords = test.answer_should_contain || [];
  const foundKeywords = keywords.filter(kw => answerText.includes(kw.toLowerCase()));
  const containsKeywords = keywords.length > 0 ? foundKeywords.length === keywords.length : true;

  // Disclaimer check
  const hasDisclaimer = test.answer_must_include_disclaimer === false ? true : answerText.includes(DISCLAIMER_TEXT.toLowerCase());
  
  // Sources check
  const hasSources = test.answer_must_have_sources_section === false ? true : answerText.includes(SOURCES_HEADER.toLowerCase());
  
  const passed = containsKeywords && hasDisclaimer && hasSources;

  return {
    test,
    generatedAnswer: response.text, // Return original case text
    passed,
    checks: {
      containsKeywords,
      hasDisclaimer,
      hasSources,
    },
  };
}

// --- 3. Tüm testleri çalıştır ve raporla ---

async function run(): Promise<void> {
  let goldenSet: GoldenTest[];
  try {
     goldenSet = loadGoldenSet();
  } catch (error: any) {
     console.error("Error loading golden set:", error.message);
     throw new Error("Failed to load golden set.");
  }
  
  const testsToRun = goldenSet.filter(t => t.answer_should_contain || t.answer_must_include_disclaimer || t.answer_must_have_sources_section);

  if (!testsToRun.length) {
    console.log("Golden set'te cevap testi kriteri içeren test bulunamadı.");
    return;
  }

  console.log(`Toplam cevap testi sayısı: ${testsToRun.length}`);
  console.log(`Kullanılan rol: ${Role.CITIZEN}`);
  console.log('---\n');

  let passedCount = 0;
  const results: SingleTestResult[] = [];
  
  // Run tests sequentially to avoid rate limiting issues
  for (const test of testsToRun) {
     console.log(`Çalıştırılıyor: ${test.id}...`);
     const result = await evaluateSingleTest(test, Role.CITIZEN);
     results.push(result);
  }

  console.log('--- TEST SONUÇLARI ---\n');

  for (const result of results) {
    if (result.passed) {
      passedCount += 1;
    }
    
    const { test, checks } = result;

    console.log(`Test ID: ${test.id}`);
    console.log(`Soru: ${test.question}`);
    
    const keywordCheck = checks.containsKeywords ? '✅' : '❌';
    const disclaimerCheck = checks.hasDisclaimer ? '✅' : '❌';
    const sourcesCheck = checks.hasSources ? '✅' : '❌';
    const overallCheck = result.passed ? '✅ GEÇTİ' : '❌ KALDI';

    console.log(
      `Kontroller: Anahtar Kelimeler: ${keywordCheck}, Yasal Uyarı: ${disclaimerCheck}, Kaynaklar: ${sourcesCheck}`
    );
     console.log(`Genel: ${overallCheck}`);
    
    if (!result.passed) {
        console.log("--- ÜRETİLEN CEVAP (İnceleme için) ---");
        console.log(result.generatedAnswer);
        console.log("------------------------------------");
    }

    console.log('---\n');
  }

  const ratio = (passedCount / results.length) * 100;
  console.log(
    `ÖZET: ${passedCount}/${results.length} test geçti (%${ratio.toFixed(1)}).`
  );
}

run().catch(e => {
  console.error("Test runner failed with an error:", e);
});
