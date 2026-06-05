// scene-matcher.js — 物理场景选择器
// 根据分类结果选择最佳物理场景，并提供场景配置

/**
 * 根据分类结果获取场景配置
 * @param {{ category: string, scene: string, spectrum_type?: string, confidence: number }} classification
 * @param {{ word: string, pos: string }} analysis
 * @param {object[]} patterns - 从 patterns.json 加载的场景模式列表
 * @returns {{ pattern: object, sceneConfig: object }} 匹配的场景模式
 */
export function matchScene(classification, analysis, patterns) {
  const sceneId = classification.scene;

  // 在 patterns 中找匹配的场景
  let pattern = patterns.find(p => p.id === sceneId);
  if (!pattern) {
    pattern = patterns.find(p => p.id === 'generic');
  }
  if (!pattern) {
    pattern = patterns[0]; // 兜底
  }

  return {
    pattern,
    sceneConfig: {
      category: classification.category,
      spectrum_type: classification.spectrum_type || null,
      confidence: classification.confidence
    }
  };
}

/**
 * 根据 POS 获取默认场景（L3 兜底）
 */
export function getDefaultScene(pos, patterns) {
  const posToScene = {
    'Verb': 'body_action',
    'Adjective': 'scale_gradient',
    'Noun': 'scale_gradient',
    'Adverb': 'scale_bar',
    'Preposition': 'spatial_direction',
    'PhrasalVerb': 'spatial_direction',
    'Unknown': 'generic'
  };

  const sceneId = posToScene[pos] || 'generic';
  let pattern = patterns.find(p => p.id === sceneId);
  if (!pattern) {
    pattern = patterns.find(p => p.id === 'generic') || patterns[0];
  }

  return {
    pattern,
    sceneConfig: {
      category: 'generic',
      spectrum_type: null,
      confidence: 0.2
    }
  };
}
