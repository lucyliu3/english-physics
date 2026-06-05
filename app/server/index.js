// English Physics — 规则引擎 API 服务
// 接收前端查询 → 分析 → 语义分类 → 匹配物理场景 → 渲染输出
// 三层 fallback，永远不返回"无法生成"

import express from 'express';
import cors from 'cors';
import { analyze, debugAnalyze } from './engine/analyzer.js';
import { render } from './engine/renderer.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'from-physics v1.0' });
});

// 核心接口：生成词条图解
// 任何词都会返回结果（三层 fallback 保证）
app.get('/api/generate', (req, res) => {
  const word = req.query.word?.trim().toLowerCase();
  if (!word) {
    return res.status(400).json({ error: '请提供要查询的词' });
  }

  // Step 1: 语义分析 (使用 compromise NLP)
  const analysis = analyze(word);

  // Step 2: 渲染 (三层 fallback 内部处理)
  const result = render(word, analysis);

  if (!result) {
    // 理论上不会触发，因为 L3 总能生成
    return res.status(500).json({ error: 'render_failed', message: '图解生成失败' });
  }

  res.json(result);
});

// 调试接口：查看 compromise 对某个词的词性分析
app.get('/api/debug', (req, res) => {
  const word = req.query.word?.trim().toLowerCase();
  if (!word) return res.status(400).json({ error: '请提供要查询的词' });
  const analysis = debugAnalyze(word);
  res.json(analysis);
});

// 获取 API 信息
app.get('/api/info', (req, res) => {
  res.json({
    engine: 'from-physics',
    version: 'v1.0',
    description: '基于物理意象的英语词汇图解引擎',
    layers: ['L1: 精确匹配（手写内容）', 'L2: 语义分类（规则推导）', 'L3: 词性兜底（通用模板）'],
    coverage: '任何英语单词'
  });
});

app.listen(PORT, () => {
  console.log(`🧠 English Physics API 服务运行在 http://localhost:${PORT}`);
  console.log(`📖 语义规则引擎已加载，覆盖所有英语单词`);
});
