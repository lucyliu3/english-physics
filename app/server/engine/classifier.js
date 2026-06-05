// classifier.js — 语义分类器
// 从 SKILL 的 vocab 分类表推断词的语义类别
// 规则：关键词匹配 + 后缀规则 + 粒子模式

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const categoriesPath = join(__dirname, '..', 'rules', 'categories.json');
const categories = JSON.parse(readFileSync(categoriesPath, 'utf-8'));

/**
 * 分类一个词
 * @param {{ word: string, pos: string, tags: string[], isPhrasal: boolean, particles: string[], rootVerb?: string }} analysis
 * @returns {{ category: string, scene: string, spectrum_type?: string, confidence: number } | null}
 */
export function classify(analysis) {
  const { word, pos, isPhrasal, particles, rootVerb } = analysis;

  // 短语动词 → 根据粒子分类
  if (isPhrasal && particles && particles.length > 0) {
    return classifyPhrasal(particles, rootVerb);
  }

  // 根据词性找对应的分类表
  const posCategories = categories[pos];
  if (!posCategories) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const [categoryName, rules] of Object.entries(posCategories)) {
    let score = 0;

    // 1. 关键词匹配（核心匹配）
    for (const keyword of rules.keywords || []) {
      if (word === keyword) {
        score += 3;  // 完全匹配得分最高
      } else if (word.startsWith(keyword) || word.endsWith(keyword)) {
        score += 1.5;  // 部分匹配
      } else if (word.includes(keyword)) {
        score += 0.5;
      }
    }

    // 2. 后缀规则
    for (const suffix of rules.suffixes || []) {
      if (word.endsWith(suffix) && word.length > suffix.length + 1) {
        // 检查词干是否在关键词中（如 tighten → tight 在 tension_force 中）
        const stem = word.slice(0, -suffix.length);
        for (const otherCat of Object.values(posCategories)) {
          for (const kw of otherCat.keywords || []) {
            if (kw === stem) {
              score += 2;
            }
          }
        }
        // 即使词干不在列表中，后缀也能给一定权重
        if (score === 0) score += 0.5;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        category: categoryName,
        scene: rules.scene,
        spectrum_type: rules.spectrum_type,
        confidence: Math.min(score / 3, 1)
      };
    }
  }

  return bestMatch;
}

/**
 * 短语动词分类
 */
function classifyPhrasal(particles, rootVerb) {
  const pvCategories = categories['PhrasalVerb'];
  if (!pvCategories || !pvCategories.particle_direction) return null;

  const particlePatterns = pvCategories.particle_direction.particle_patterns;

  // 按粒子匹配（优先第一个粒子）
  const primaryParticle = particles[0];
  for (const pattern of particlePatterns) {
    if (pattern.particle === primaryParticle) {
      return {
        category: `phrasal_${primaryParticle}`,
        scene: pattern.scene,
        core_image: pattern.core_image,
        confidence: 0.6
      };
    }
  }

  return null;
}
