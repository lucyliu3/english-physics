// analyzer.js — 语义分析
// 接入 compromise NLP 库做词性标注，废弃硬编码 DICT

import nlp from 'compromise';

/**
 * 分析输入的查询词
 * @param {string} query - 用户输入的搜索词
 * @returns {{ word: string, pos: string, tags: string[], isPhrasal: boolean, particles: string[] }}
 */
export function analyze(query) {
  const q = query.trim().toLowerCase();

  // 检查是否是短语动词（含空格的查询）
  const parts = q.split(/\s+/);
  const isPhrasal = parts.length > 1;

  if (isPhrasal) {
    const verb = parts[0];
    const particles = parts.slice(1);
    return {
      word: q,
      pos: 'PhrasalVerb',
      tags: ['Verb', 'PhrasalVerb'],
      isPhrasal: true,
      particles,
      rootVerb: verb
    };
  }

  // 单次：用 compromise 做 POS 标注
  // 使用 doc.json() 获取结构化词条数据（兼容 compromise v14 API）
  const doc = nlp(q);
  const json = doc.json();

  // 提取所有 POS 标签
  const allTags = [];
  if (json && json.length > 0) {
    for (const sentence of json) {
      if (sentence.terms) {
        for (const term of sentence.terms) {
          if (term.tags && Array.isArray(term.tags)) {
            term.tags.forEach(tag => allTags.push(tag));
          }
        }
      }
    }
  }

  // 按优先级检查词性
  if (allTags.includes('Preposition')) {
    return {
      word: q, pos: 'Preposition', tags: ['Preposition', 'Particle'],
      isPhrasal: false, particles: []
    };
  }

  if (allTags.includes('Adverb')) {
    return {
      word: q, pos: 'Adverb', tags: ['Adverb'],
      isPhrasal: false, particles: []
    };
  }

  if (allTags.includes('Adjective')) {
    return {
      word: q, pos: 'Adjective', tags: ['Adjective'],
      isPhrasal: false, particles: []
    };
  }

  if (allTags.includes('Noun') || allTags.includes('Possessive')) {
    return {
      word: q, pos: 'Noun', tags: ['Noun'],
      isPhrasal: false, particles: []
    };
  }

  if (allTags.includes('Verb') || allTags.includes('PresentTense') ||
      allTags.includes('PastTense') || allTags.includes('Infinitive') ||
      allTags.includes('Gerund') || allTags.includes('Imperative')) {
    return {
      word: q, pos: 'Verb', tags: ['Verb'],
      isPhrasal: false, particles: []
    };
  }

  // 次级检查：用 compromise 的 POS 方法（兼容性兜底）
  if (doc.adverbs().length > 0) {
    return {
      word: q, pos: 'Adverb', tags: ['Adverb'],
      isPhrasal: false, particles: []
    };
  }

  if (doc.adjectives().length > 0) {
    return {
      word: q, pos: 'Adjective', tags: ['Adjective'],
      isPhrasal: false, particles: []
    };
  }

  if (doc.nouns().length > 0) {
    return {
      word: q, pos: 'Noun', tags: ['Noun'],
      isPhrasal: false, particles: []
    };
  }

  if (doc.verbs().length > 0) {
    return {
      word: q, pos: 'Verb', tags: ['Verb'],
      isPhrasal: false, particles: []
    };
  }

  // 兜底：从 compromise 标签推断
  if (allTags.length > 0) {
    const posMap = {
      'Noun': 'Noun', 'Verb': 'Verb', 'Adjective': 'Adjective',
      'Adverb': 'Adverb', 'Preposition': 'Preposition', 'Determiner': 'Determiner'
    };
    for (const tag of allTags) {
      if (posMap[tag]) {
        return {
          word: q, pos: posMap[tag], tags: allTags.slice(0, 3),
          isPhrasal: false, particles: []
        };
      }
    }
  }

  // 最终兜底
  return {
    word: q, pos: 'Unknown', tags: ['Unknown'],
    isPhrasal: false, particles: []
  };
}

/**
 * 测试 compromise 对某个词的分析
 */
export function debugAnalyze(query) {
  const doc = nlp(query.trim().toLowerCase());
  const json = doc.json();
  const terms = (json && json[0]?.terms || []).map(t => ({
    word: t.text,
    tags: t.tags || []
  }));
  return {
    terms,
    hasVerb: doc.verbs().length > 0,
    hasNoun: doc.nouns().length > 0,
    hasAdj: doc.adjectives().length > 0,
    hasAdv: doc.adverbs().length > 0,
    hasPrep: doc.prepositions().length > 0,
  };
}
