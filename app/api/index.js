// Vercel Serverless Function 入口
// 将 Express 应用包装为 Vercel 兼容的 handler

import express from 'express';
import cors from 'cors';
import { analyze, debugAnalyze } from '../server/engine/analyzer.js';
import { render } from '../server/engine/renderer.js';

const app = express();

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'from-physics v1.0' });
});

// 核心接口：生成词条图解
app.get('/api/generate', (req, res) => {
  const word = req.query.word?.trim().toLowerCase();
  if (!word) {
    return res.status(400).json({ error: '请提供要查询的词' });
  }

  const analysis = analyze(word);
  const result = render(word, analysis);

  if (!result) {
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

// 导出为 Vercel serverless function
export default app;
