// api.js — 规则引擎 API 客户端
// 优先调后端 API，失败时降级到本地静态数据

const API_BASE = '/api';

/**
 * 从后端规则引擎获取词条数据
 * @param {string} word
 * @returns {Promise<object|null>} 词条数据，失败返回 null
 */
export async function fetchWordFromEngine(word) {
  try {
    const url = `${API_BASE}/generate?word=${encodeURIComponent(word)}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return null;  // uncovered
      console.warn(`API error: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    // 网络错误（后端没启动），静默降级
    console.warn('API 不可用，降级到本地数据:', err.message);
    return null;
  }
}

/**
 * 智能获取词条：优先 API，降级本地
 * @param {string} word
 * @param {Function} localFallback - getWordData 函数
 * @returns {Promise<object|null>}
 */
export async function getWordDataSmart(word, localFallback) {
  // 先尝试 API
  const engineResult = await fetchWordFromEngine(word);
  if (engineResult) return engineResult;

  // 降级到本地
  return localFallback(word);
}
