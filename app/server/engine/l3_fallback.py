"""
l3_fallback.py — L3 词源追溯兜底

当 L1 预标注和 L2 实时推理都无法确定物理意象时，
从词源数据库提取词源故事 + 演变路径。
"""
import sys
import os

# 确保能导入 scripts/ 目录下的 etymology_query.py
BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
SCRIPTS_DIR = os.path.join(BASE, "scripts")
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from etymology_query import load_etymology, extract_original_meaning


def generate_l3(word: str) -> dict:
    """生成 L3 词源兜底数据。

    Args:
        word: 查询词

    Returns:
        符合交付格式的词条 dict（layer = "L3"）
    """
    results = None
    try:
        results = load_etymology(word)
    except Exception:
        pass

    original_meaning, lang = extract_original_meaning(results) if results else (None, None)

    # 构造词源链文字描述
    chain_text = ""
    if results:
        lines = []
        for r in results:
            src = r.get("related_term", "")
            rlang = r.get("related_lang", "")
            reltype = r.get("reltype", "")
            if src and rlang:
                lines.append(f"  {reltype}: {src} ({rlang})")
            elif src:
                lines.append(f"  {reltype}: {src}")
        chain_text = "\n".join(lines) if lines else "未找到词源信息。"
    else:
        chain_text = "未找到词源信息。"

    return {
        "word": word.upper(),
        "pos": "unknown",
        "layer": "L3",
        "carrier": None,
        "change": None,
        "scene": None,
        "etymology": {
            "original_meaning": original_meaning,
            "original_lang": lang,
            "chain": chain_text,
        },
        "static_axis": None,
        "dynamic_axis": None,
        "phrases": [],
        "comparisons": [],
        "spectrum": None,
    }
