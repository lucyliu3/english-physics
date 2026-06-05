// pattern-matcher.js — 匹配物理模式
// 通过关键词 + 粒子模式匹配 patterns.json 中的规则

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const patternsPath = join(__dirname, '..', 'rules', 'patterns.json');
const patterns = JSON.parse(readFileSync(patternsPath, 'utf-8')).patterns;

/**
 * 加载所有模式
 */
export function getAllPatterns() {
  return patterns;
}

/**
 * 根据分析结果匹配物理模式
 * @param {{ word: string, tokens: Array, phrasal?: object, pos: string[] }} analysis
 * @returns {{ pattern: object, vocab?: object } | null}
 */
export function matchPattern(analysis) {
  const { word, tokens, phrasal } = analysis;

  // 1. 尝试关键词精确匹配（检查每个 token 是否在 pattern 的 keywords 中）
  for (const pattern of patterns) {
    for (const token of tokens) {
      if (pattern.keywords.includes(token.word)) {
        return { pattern };
      }
    }
  }

  // 2. 尝试粒子模式匹配（短语动词）
  if (phrasal) {
    for (const pattern of patterns) {
      const pp = pattern.particle_patterns;
      if (pp.length > 0) {
        const match = pp.some(ppp =>
          ppp.length === phrasal.particles.length &&
          ppp.every((p, i) => p === phrasal.particles[i])
        );
        if (match) return { pattern };
      }
    }
  }

  // 3. 尝试主词匹配（短语动词的 verb 部分）
  if (phrasal) {
    for (const pattern of patterns) {
      if (pattern.keywords.includes(phrasal.verb)) {
        return { pattern };
      }
    }
  }

  return null;
}
