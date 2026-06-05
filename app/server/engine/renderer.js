// renderer.js — 主渲染管线
// 三层 fallback: L1 精确匹配 → L2 语义分类 → L3 POS 兜底

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parse as parseYaml } from './yaml-parse.js';
import { classify } from './classifier.js';
import { matchScene, getDefaultScene } from './scene-matcher.js';
import { composeResponse } from './response-composer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 加载配置
const patternsPath = join(__dirname, '..', 'rules', 'patterns.json');
const patterns = JSON.parse(readFileSync(patternsPath, 'utf-8')).patterns;

const vocabPath = join(__dirname, '..', 'rules', 'vocabulary.yaml');
let vocab = {};
try {
  const vocabRaw = readFileSync(vocabPath, 'utf-8');
  vocab = parseYaml(vocabRaw);
} catch (e) {
  // vocabulary.yaml 可选
}

/**
 * 主渲染函数
 * @param {string} word - 原始查询词
 * @param {object} analysis - analyzer.js 的分析结果
 * @returns {object|null} 完整的词条数据
 */
export function render(word, analysis) {
  // Layer 1: 精确匹配（手写内容，最高质量）
  const l1Result = renderL1(word, analysis);
  if (l1Result) return l1Result;

  // Layer 2: 语义分类
  const classification = classify(analysis);

  if (classification && classification.confidence >= 0.3) {
    const sceneResult = matchScene(classification, analysis, patterns);
    return composeResponse(word, analysis, classification, sceneResult);
  }

  // Layer 3: POS 兜底
  const defaultScene = getDefaultScene(analysis.pos, patterns);
  return composeResponse(word, analysis, null, defaultScene);
}

/**
 * L1: 精确匹配 — 从 vocabulary.yaml + 旧 renderer 返回手写内容
 */
function renderL1(word, analysis) {
  const entry = vocab[word];
  if (!entry) return null;

  const pattern = patterns.find(p => p.id === entry.pattern);
  if (!pattern) return null;

  const anchor = entry.anchor || word;
  const object = entry.object || '物体';
  const leap = entry.leap || word;

  // 核心逻辑（替换模板变量）
  let logic = pattern.core_logic || '';
  logic = logic.replace(/\{object\}/g, object)
               .replace(/\{anchor\}/g, anchor)
               .replace(/\{word\}/g, word);

  // SVG
  const svg = renderL1SVG(pattern, anchor, word);

  // 短语
  const phrases = entry.phrases?.map(p => ({
    en: `<strong>${p.pattern}</strong>`,
    cn: p.cn,
    eg: p.eg
  })) || [];

  // 对比词
  const compare = entry.compare_override || pattern.compare_words || [];

  const result = { word, leap, svg, logic, phrases, compare };

  // 如果这个词有手工扩展内容（如 snap 的 cards/spectrum 等），从本地数据取
  const localData = getLocalWordData(word);
  if (localData) {
    if (localData.cards) result.cards = localData.cards;
    if (localData.logicTree) result.logicTree = localData.logicTree;
    if (localData.spectrum) result.spectrum = localData.spectrum;
    if (localData.spectrumNote) result.spectrumNote = localData.spectrumNote;
    if (localData.compareCards) result.compareCards = localData.compareCards;
    if (localData.phraseGroups) result.phraseGroups = localData.phraseGroups;
    if (localData.references) result.references = localData.references;
  }

  return result;
}

/**
 * L1 SVG 生成（复用旧的硬编码模板）
 */
function renderL1SVG(pattern, anchor, word) {
  const templateId = pattern.visual?.template;

  switch (templateId) {
    case 'tension':
      return generateTensionSVG(anchor);
    case 'friction':
      return generateFrictionSVG();
    case 'obstacle':
      return generateObstacleSVG();
    default:
      return `    <svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="760" height="400" fill="#fafaf8" rx="8"/>
      <text x="380" y="200" text-anchor="middle" fill="#e67e22" font-size="24" font-weight="700" font-family="sans-serif">${word}</text>
      <text x="380" y="240" text-anchor="middle" fill="#b0a69c" font-size="14" font-family="sans-serif">图解生成中...</text>
    </svg>`;
  }
}

function generateTensionSVG(anchor) {
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadowS"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.10"/></filter>
      <linearGradient id="rubberGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#e67e22"/>
        <stop offset="100%" stop-color="#e63946"/>
      </linearGradient>
    </defs>
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="40" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${anchor.toUpperCase()}</text>
    <path d="M80,200 Q160,240 280,200" fill="none" stroke="url(#rubberGrad)" stroke-width="8" stroke-linecap="round" filter="url(#shadowS)">
      <animate attributeName="d"
        values="M80,200 Q160,240 280,200;M80,200 Q160,100 280,200;M80,200 Q160,60 280,200;M80,200 Q160,80 280,200;M80,200 Q160,260 280,200;M80,200 Q160,240 280,200"
        dur="5s" repeatCount="indefinite"/>
    </path>
    <circle cx="80" cy="200" r="8" fill="#666"/>
    <circle cx="280" cy="200" r="8" fill="#666"/>
    <g>
      <animate attributeName="opacity" values="0;0;0;0;1;0" dur="5s" repeatCount="indefinite"/>
      <path d="M80,200 Q130,140 170,170" fill="none" stroke="#e63946" stroke-width="6" stroke-linecap="round"/>
      <path d="M280,200 Q230,260 190,230" fill="none" stroke="#e63946" stroke-width="6" stroke-linecap="round"/>
      <circle cx="175" cy="185" r="3" fill="#e63946"><animateTransform type="translate" values="0,0;-15,-10" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/></circle>
      <rect x="185" y="195" width="5" height="3" fill="#e67e22" transform="rotate(30,187,196)"><animateTransform type="translate" values="0,0;10,-15" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite"/></rect>
      <text x="180" y="120" text-anchor="middle" fill="#e63946" font-size="22" font-weight="900" font-family="sans-serif">💥 ${anchor.toUpperCase()}!</text>
    </g>
    <text x="380" y="340" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">拉到极限 → 断裂 → 崩溃</text>
  </svg>`;
}

function generateFrictionSVG() {
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e63946"/><stop offset="100%" stop-color="#c1121f"/></linearGradient>
      <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#f8f4f0"/></linearGradient>
      <filter id="shadow"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.10"/></filter>
    </defs>
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">RUB OFF ON</text>
    <rect x="80" y="160" width="180" height="130" rx="6" fill="url(#redGrad)" filter="url(#shadow)"/>
    <text x="170" y="210" text-anchor="middle" fill="#fff" font-size="14" font-weight="600" font-family="sans-serif">红布</text>
    <text x="170" y="230" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="12" font-family="sans-serif">颜料附着</text>
    <g filter="url(#shadow)">
      <circle cx="210" cy="210" r="9" fill="#e63946">
        <animate attributeName="cx" values="210;270;320" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="210;270;300" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="9;7;5" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="230" cy="195" r="6" fill="#e63946" opacity="0.9">
        <animate attributeName="cx" values="230;300;350" dur="3s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="195;260;290" dur="3s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="r" values="6;4;3" dur="3s" begin="0.4s" repeatCount="indefinite"/>
      </circle>
    </g>
    <rect x="490" y="160" width="180" height="130" rx="6" fill="url(#whiteGrad)" filter="url(#shadow)"/>
    <text x="580" y="210" text-anchor="middle" fill="#bbb" font-size="14" font-weight="600" font-family="sans-serif">白布</text>
    <g>
      <animate attributeName="opacity" values="0;0;0;0;0;1;1" dur="3s" repeatCount="indefinite"/>
      <rect x="490" y="160" width="180" height="130" rx="6" fill="#e63946" opacity="0.4" filter="url(#shadow)"/>
      <text x="580" y="230" text-anchor="middle" fill="#e63946" font-size="12" font-weight="600" font-family="sans-serif">被染红 ✨</text>
    </g>
    <text x="390" y="195" text-anchor="middle" fill="#e67e22" font-size="28" font-weight="700">→</text>
    <text x="390" y="225" text-anchor="middle" fill="#e67e22" font-size="12" font-weight="600" font-family="sans-serif">颜料转移</text>
    <line x1="60" y1="340" x2="700" y2="340" stroke="#e8e0d0" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">摩擦（rub）→ 脱离（off）→ 附着（on）</text>
  </svg>`;
}

function generateObstacleSVG() {
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="shadowG"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.10"/></filter></defs>
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="40" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">GET AROUND TO</text>
    <rect x="340" y="120" width="80" height="160" rx="8" fill="#ddd"/>
    <text x="380" y="210" text-anchor="middle" fill="#999" font-size="13" font-weight="600" font-family="sans-serif">障碍</text>
    <text x="380" y="228" text-anchor="middle" fill="#bbb" font-size="11" font-family="sans-serif">（其他事情）</text>
    <g filter="url(#shadowG)">
      <animateTransform attributeName="transform" type="translate" values="-180,0; -120,0; -40,-40; 40,-40; 120,0; 180,0; 180,0; 120,0; 40,-40; -40,-40; -120,0; -180,0" dur="6s" repeatCount="indefinite"/>
      <circle cx="200" cy="180" r="16" fill="#f5e6d0"/>
      <circle cx="195" cy="176" r="2.5" fill="#333"/><circle cx="205" cy="176" r="2.5" fill="#333"/>
      <path d="M196,186 Q200,190 204,186" fill="none" stroke="#333" stroke-width="1.8"/>
      <line x1="200" y1="196" x2="200" y2="225" stroke="#333" stroke-width="2.5"/>
      <line x1="200" y1="200" x2="185" y2="215" stroke="#333" stroke-width="2"/>
      <line x1="200" y1="200" x2="215" y2="215" stroke="#333" stroke-width="2"/>
    </g>
    <rect x="610" y="180" width="100" height="60" rx="10" fill="#38a169" filter="url(#shadowG)"/>
    <text x="660" y="215" text-anchor="middle" fill="#fff" font-size="14" font-weight="600" font-family="sans-serif">✓ 目标</text>
    <path d="M20,200 Q80,140 200,140 Q300,140 320,200" fill="none" stroke="#e67e22" stroke-width="2" stroke-dasharray="6,4" opacity="0.5"/>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">绕过眼前的障碍，终于到达目标</text>
  </svg>`;
}

// 从 server/data/ 加载手工精修数据（含 cards/logicTree/spectrum 等扩展模块）
// 这些数据从 src/data/words.js 导出而来，放在 server 目录下确保 Vercel 部署时能包含
let _localWordsData = {};
try {
  const snapDataPath = join(__dirname, '..', 'data', 'snap.json');
  _localWordsData = JSON.parse(readFileSync(snapDataPath, 'utf-8'));
} catch (e) {
  // snap.json 可选
}

/**
 * 从本地 words.js 获取手工精修的数据（含 cards/logicTree/spectrum 等完整模块）
 * @param {string} word - 查询词
 * @returns {object|null} 包含扩展字段的数据对象，或 null
 */
function getLocalWordData(word) {
  const entry = _localWordsData[word];
  if (!entry) return null;

  const result = {};
  const fields = ['cards', 'logicTree', 'spectrum', 'spectrumNote',
                  'compareCards', 'phraseGroups', 'references'];
  for (const key of fields) {
    if (entry[key]) result[key] = entry[key];
  }
  return Object.keys(result).length > 0 ? result : null;
}
