// logic-builder.js — 逻辑链 + 短语 + 对比生成器
// 根据场景类型和语义参数生成默认内容

/**
 * 构建核心逻辑 HTML
 * @param {object} pattern - patterns.json 中的场景模式
 * @param {string} word - 查询词
 * @param {string} pos - 词性
 * @returns {string} HTML 字符串
 */
export function buildLogic(pattern, word, pos) {
  const logic = pattern.core_logic || '';
  const object = getObjectForWord(word, pos);
  return logic.replace(/\{word\}/g, word).replace(/\{object\}/g, object);
}

/**
 * 构建跳转标语
 */
export function buildLeap(pattern, word, pos) {
  const template = pattern.leap_template || '{word}';
  const object = getObjectForWord(word, pos);
  return template.replace(/\{word\}/g, word).replace(/\{object\}/g, object);
}

/**
 * 生成默认短语列表
 */
export function buildPhrases(word, pos, pattern) {
  const sceneName = pattern.name || '通用';
  return [
    {
      en: `<strong>${word}</strong>`,
      cn: `${sceneName}的核心用法`,
      eg: `"${word}" 的基础物理含义。`
    },
    {
      en: `<strong>${word}</strong> in context`,
      cn: `在上下文中使用 ${word}`,
      eg: `用 ${word} 来${getDefaultActionDesc(pos)}。`
    }
  ];
}

/**
 * 生成对比词
 */
export function buildCompare(pattern) {
  return pattern.compare_words || [];
}

/**
 * 生成逻辑演化树（如果有多个延伸含义）
 */
export function buildLogicTree(pattern, word) {
  const chainLabels = pattern.logic_chain_labels || [];
  if (chainLabels.length < 3) return null;

  return {
    insight: `"${word}" 的物理画面展示了：${chainLabels.join(' → ')}。每一步都是从一个状态到下一个状态的过渡。`,
    branches: [
      { label: `① ${chainLabels[0]}`, color: '#38a169', usage: `初始状态`, note: `还没有发生${pattern.name}的状态` },
      { label: `② ${chainLabels[1]}`, color: '#e67e22', usage: `${chainLabels[1]}的过程`, note: `变化的开始` },
      { label: `③ ${chainLabels[Math.floor(chainLabels.length/2)]}`, color: '#e63946', usage: `关键时刻`, note: `变化的关键节点` },
      { label: `④ ${chainLabels[chainLabels.length-1]}`, color: '#7b4ad9', usage: `新的状态`, note: `变化完成后的结果` },
    ]
  };
}

/**
 * 生成程度光谱（如果场景启用）
 */
export function buildSpectrum(pattern) {
  if (!pattern.spectrum?.enabled) return null;

  const stages = pattern.spectrum.stages || ['弱', '中', '强'];
  const numStages = stages.length;

  // 构建简易光谱 SVG
  const barWidth = 600;
  const segmentWidth = barWidth / (numStages - 1);
  const svg = `<svg viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="760" height="200" fill="#fafaf8" rx="8"/>
    <rect x="80" y="80" width="${barWidth}" height="16" rx="8" fill="#e8e0d0"/>
    <rect x="80" y="80" width="${barWidth}" height="16" rx="8" fill="url(#primaryGrad)" opacity="0.5">
      <animate attributeName="width" values="0;${barWidth}" dur="5s" repeatCount="indefinite"/>
    </rect>
    ${stages.map((s, i) => {
      const x = 80 + i * segmentWidth;
      const arrowY = 60;
      return `<text x="${x}" y="${arrowY}" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">${s}</text>
        <line x1="${x}" y1="96" x2="${x}" y2="110" stroke="#ccc" stroke-width="1"/>`;
    }).join('\n    ')}
    <text x="380" y="170" text-anchor="middle" fill="#998e84" font-size="11" font-family="sans-serif">${pattern.spectrum.title || '程度光谱'}</text>
  </svg>`;

  return svg;
}

function getObjectForWord(word, pos) {
  const wordObj = {
    'snap': '橡皮筋', 'break': '树枝', 'crack': '蛋壳', 'burst': '气球',
    'run': '人', 'walk': '人', 'jump': '人', 'swim': '人', 'fly': '鸟',
    'grow': '植物', 'melt': '冰块', 'freeze': '水', 'boil': '水',
    'tighten': '绳子', 'loosen': '绳子', 'stretch': '橡皮筋',
    'push': '手', 'pull': '手', 'throw': '球', 'catch': '球',
    'cut': '纸', 'tear': '纸', 'fold': '纸',
    'rain': '云', 'wind': '空气', 'snow': '云', 'fog': '雾',
    'rub': '表面', 'wipe': '表面', 'paint': '刷子',
    'up': '箭头', 'down': '箭头',
  };

  if (wordObj[word]) return wordObj[word];
  if (pos === 'Verb') return '物体';
  if (pos === 'Adjective') return '某物';
  if (pos === 'Noun') return word;
  if (pos === 'Adverb') return '程度';
  if (pos === 'Preposition') return '方向';
  return '物体';
}

function getDefaultActionDesc(pos) {
  const descs = {
    'Verb': '描述一个动作',
    'Adjective': '描述一种状态',
    'Noun': '指代一个事物',
    'Adverb': '描述程度或方式',
    'Preposition': '描述空间关系',
    'PhrasalVerb': '描述一个动作组合',
  };
  return descs[pos] || '表达一个概念';
}
