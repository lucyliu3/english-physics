"""
engine_api.py — English Physics 规则引擎 FastAPI 服务

三层 fallback 管线:
  1. annotation_loader → 读预标注 JSON
  2. realtime_l2 → 实时词源+L2推理
  3. l3_fallback → 词源故事兜底

运行: uvicorn engine_api:app --port 3002 --reload
"""
import sys
import os

# 确保能找到同目录下的模块
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from annotation_loader import load_annotation
from realtime_l2 import try_l2
from l3_fallback import generate_l3

app = FastAPI(
    title="English Physics Engine",
    description="三层 fallback 规则引擎：L1 预标注 → L2 物理意象推理 → L3 词源兜底",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 前端输出适配
# ============================================================
# 前端 WordDetailPage.jsx 消费 JSON 的字段名与引擎内部字段名有差异，
# 在此层做统一映射，不改前端也不改引擎核心模块。

def _make_svg_placeholder(word: str, layer: str, carrier: str | None = None) -> str:
    """为没有手工 SVG 的词生成占位 SVG。"""
    carrier_line = f"载体：{carrier}" if carrier else ""
    return f'''<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="400" fill="#fafaf8" rx="8"/>
  <text x="380" y="160" text-anchor="middle" fill="#e67e22" font-size="28" font-weight="700" font-family="sans-serif">{word.upper()}</text>
  <text x="380" y="200" text-anchor="middle" fill="#b0a69c" font-size="14" font-family="sans-serif">[{layer}] {carrier_line}</text>
  <text x="380" y="240" text-anchor="middle" fill="#d0c8bc" font-size="12" font-family="sans-serif">SVG 图表待生成 — 当前为实时推理结果</text>
</svg>'''


def _adapt_phrases(phrases: list) -> list:
    """将引擎 phrases 格式转成前端期望的格式。

    引擎: {"phrase": "run into", "scene": "xx → yy", "meaning": "yy", "examples": []}
    前端: {"en": "<strong>run</strong> into", "cn": "yy", "eg": "例句"}
    """
    adapted = []
    for p in (phrases or []):
        en = p.get("phrase") or p.get("en", "")
        # 粗体核心词
        parts = en.split()
        if parts:
            en_html = f"<strong>{parts[0]}</strong> " + " ".join(parts[1:])
        else:
            en_html = en
        meaning = p.get("meaning") or p.get("cn", "") or p.get("scene", "").split("→")[-1].strip()
        eg = p.get("examples") or p.get("eg") or ""
        if isinstance(eg, list):
            eg = " | ".join(eg[:2])
        adapted.append({"en": en_html, "cn": meaning, "eg": eg})
    return adapted


def _adapt_output(data: dict, word: str, source: str) -> dict:
    """对引擎输出做前端兼容适配。"""
    word_upper = word.upper()
    out = dict(data)

    # 标注来源
    out["_source"] = source

    # 3. svg 占位（如果引擎没输出）
    if not out.get("svg"):
        out["svg"] = _make_svg_placeholder(word_upper, out.get("layer", "L2"), out.get("carrier"))

    # 4. phrases 字段适配
    raw_phrases = out.get("phrases") or []
    if raw_phrases:
        # 检查是否是引擎格式（有 "phrase" 键）还是前端格式（有 "en" 键）
        if "en" not in raw_phrases[0]:
            out["phrases"] = _adapt_phrases(raw_phrases)
    else:
        out["phrases"] = []

    # 5. leap 和 logic 占位（前端可能显示）
    if not out.get("leap"):
        carrier = out.get("carrier")
        change = out.get("change")
        if carrier and change:
            out["leap"] = f"{carrier} → 抽象含义"
        else:
            out["leap"] = ""

    if not out.get("logic"):
        scene = out.get("scene", "")
        core_image = ""
        if out.get("static_axis"):
            core_image = out["static_axis"].get("core_image", "")
        out["logic"] = f"<strong>{word_upper}</strong> — {scene}<br/>{core_image}" if core_image else f"<strong>{word_upper}</strong> — {scene}"

    # 6. spectrum 字段适配：如果是 dict 保留（前端能处理 dict），删掉占位 string
    # 目前引擎的 spectrum 是 dict，前端 152 行用 dangerouslySetInnerHTML，
    # 但 dict 被 innerHTML 会显示 [object Object] —— 转成描述文字
    if out.get("spectrum") and isinstance(out["spectrum"], dict):
        stages = out["spectrum"].get("stages", [])
        if stages:
            out["spectrumNote"] = out.get("spectrumNote") or " → ".join(stages)

    # 7. L3 特有处理：etymology 展示
    if out.get("layer") == "L3" and out.get("etymology"):
        ety = out["etymology"]
        orig = ety.get("original_meaning", "")
        lang = ety.get("original_lang", "")
        chain = ety.get("chain", "")
        out["logic"] = f"<strong>{word_upper}</strong> — 词源追溯<br/>" \
                       f"本义：{orig}（{lang}）<br/>" \
                       f"<small style='color:#b0a69c'>{chain}</small>"

    return out


# ============================================================
# API 端点
# ============================================================

@app.get("/api/health")
def health():
    return {"status": "ok", "engine": "english-physics v2.0"}


@app.get("/api/generate")
def generate(word: str = Query(..., description="查询词或词组")):
    """主端点：三层 fallback 生成词条图解。"""
    q = word.strip().lower()
    if not q:
        return {"error": "请提供要查询的词"}

    # L1: 预标注查表
    result = load_annotation(q)
    if result:
        return _adapt_output(result, q, "L1")

    # L2: 实时物理意象推理
    result = try_l2(q)
    if result:
        return _adapt_output(result, q, "L2")

    # L3: 词源追溯兜底
    result = generate_l3(q)
    return _adapt_output(result, q, "L3")


@app.get("/api/info")
def info():
    return {
        "engine": "english-physics",
        "version": "v2.0",
        "description": "基于物理意象的英语词汇图解引擎（三层 fallback）",
        "layers": [
            "L1: 预标注查表（5000 词已标注）",
            "L2: 物理意象推理（词源+载体匹配，实时生成）",
            "L3: 词源追溯兜底（永不返回空）",
        ],
        "coverage": "任何英语单词或词组",
    }


# ============================================================
# 启动入口
# ============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002, reload=True)
VERSION_MARKER = "v2-adapted-20260606"
