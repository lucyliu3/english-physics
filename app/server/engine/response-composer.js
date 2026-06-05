// response-composer.js — 响应组装器
// 组合所有模块的输出，生成与前端 WordDetailPage 兼容的完整响应

import { renderSVG } from './svg-renderer.js';
import { buildLogic, buildLeap, buildPhrases, buildCompare, buildLogicTree, buildSpectrum } from './logic-builder.js';

/**
 * 组装完整的 API 响应
 * @param {string} word - 查询词
 * @param {object} analysis - analyzer 输出
 * @param {object} classification - classifier 输出（可为 null）
 * @param {object} sceneResult - scene-matcher 输出
 * @returns {object} 与前端兼容的响应对象
 */
export function composeResponse(word, analysis, classification, sceneResult) {
  const { pattern, sceneConfig } = sceneResult;
  const pos = analysis.pos;
  const confidence = sceneConfig?.confidence || 0;

  // 基础数据
  const svg = renderSVG(pattern, word, pos);
  const leap = buildLeap(pattern, word, pos);
  const logic = buildLogic(pattern, word, pos);
  const phrases = buildPhrases(word, pos, pattern);
  const compare = buildCompare(pattern);

  // 可选模块
  const logicTree = buildLogicTree(pattern, word);
  const spectrum = buildSpectrum(pattern);

  const result = {
    word,
    leap,
    svg,
    logic,
    phrases,
    compare,
  };

  // 只有高置信度时添加完整模块
  if (confidence >= 0.5 || classification) {
    if (logicTree) result.logicTree = logicTree;
    if (spectrum) result.spectrum = spectrum;
  }

  // 标注生成来源
  if (confidence >= 0.8) {
    // L1: 精确匹配 — 不标注
  } else if (confidence >= 0.3) {
    result._generated = true;
    result._note = '基于规则自动生成';
  } else {
    result._generated = true;
    result._note = '基于词性自动生成，仅供参考';
  }

  return result;
}
