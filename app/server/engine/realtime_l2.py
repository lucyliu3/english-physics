"""
realtime_l2.py — L2 实时物理意象推理

当预标注未命中时，实时：
  1. 查词源数据库提取本义
  2. 匹配物理载体 + 变化类型
  3. 生成两轴一对比内容

也负责词组（phrasal verb）的实时推导：
  核心词 L2 画面 + 小品词空间关系 → 组合画面描述
"""
import sys
import os

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
SCRIPTS_DIR = os.path.join(BASE, "scripts")
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from etymology_query import load_etymology, extract_original_meaning

# ---------- 复用 batch_annotate.py 的映射表和匹配逻辑 ----------
# 载体定义
CARRIERS = {
    "tension":     { "name": "张力/拉伸",     "desc": "绳子/弹性体两端被拉，从松弛到绷紧到断裂" },
    "friction":    { "name": "摩擦/接触",     "desc": "两个表面相对运动，产生阻力/磨损" },
    "movement":    { "name": "移动/位移",     "desc": "物体从A点运动到B点（含速度、方向、轨迹）" },
    "transition":  { "name": "过渡/变化",     "desc": "某物从一种状态转变为另一种状态" },
    "temperature": { "name": "温度/热",       "desc": "物体的热量变化，从冷到热或反之" },
    "body":        { "name": "身体姿态/表情", "desc": "人的身体部位/面部表情/姿态变化" },
    "direction":   { "name": "方向/空间",     "desc": "物体在空间中的位置关系和运动方向" },
    "separation":  { "name": "分离/切断",     "desc": "原本连接的整体被分开" },
    "connection":  { "name": "连接/附着",     "desc": "两个物体粘合/连接在一起" },
    "container":   { "name": "容器/填充",     "desc": "容器从空到满（或反之）的空间变化" },
    "liquid":      { "name": "液体/流动",     "desc": "液体沿路径运动，含流速、流向、形态" },
    "growth":      { "name": "生长/扩张",     "desc": "物体由小变大/由内向外扩展" },
    "light":       { "name": "光/影/可见性",  "desc": "光线被遮挡/释放，物体可见性变化" },
    "rotation":    { "name": "旋转/转动",     "desc": "物体绕轴做圆周运动" },
    "oscillation": { "name": "振荡/摇摆",     "desc": "物体绕平衡点做往复运动" },
    "deformation": { "name": "形变/折叠",     "desc": "物体受外力改变形状" },
    "mixing":      { "name": "混合/融合",     "desc": "两种以上物质混合在一起" },
    "burning":     { "name": "燃烧/消耗",     "desc": "物体被火焰/热消耗" },
}

CHANGES = {
    "accumulate":  { "name": "累积/叠加",     "desc": "从少到多、从低到高的垂直/数量堆积" },
    "diminish":    { "name": "消失/减少",     "desc": "从多到少、从有到无的递减过程" },
    "diffuse":     { "name": "扩散/传播",     "desc": "从中心向四周辐射" },
    "converge":    { "name": "聚集/收缩",     "desc": "从四周向中心收拢" },
    "separate":    { "name": "分离/断开",     "desc": "从整到分" },
    "connect":     { "name": "连接/结合",     "desc": "从分到合" },
    "displace":    { "name": "位移/移动",     "desc": "从A点到B点的位置变化" },
    "rotate":      { "name": "旋转/转动",     "desc": "绕轴做圆周运动" },
    "oscillate":   { "name": "振荡/往复",     "desc": "绕平衡点来回运动" },
    "reshape":     { "name": "形变/重塑",     "desc": "物体的形状改变" },
    "temp_change": { "name": "温度变化",       "desc": "物体的热量增减" },
    "blend":       { "name": "混合/融合",     "desc": "两种不同物质合为一体" },
}

# 关键词映射表（完全复用 batch_annotate.py 的三级优先级）
BODY_KEYWORDS = [
    (["head", "头顶", "首", "caput", "kopf"], "body", "displace"),
    (["foot", "足", "脚", "ped", "pod", "pes"], "body", "displace"),
    (["hand", "手", "manus", "man", "manu"], "body", "displace"),
    (["arm", "臂", "brachium"], "body", "displace"),
    (["leg", "腿", "crus"], "body", "displace"),
    (["back", "背", "后背", "dorsum"], "body", "displace"),
    (["eye", "眼", "目", "ocul", "opt", "ophthalm"], "body", "displace"),
    (["ear", "耳", "aur", "aud"], "body", "displace"),
    (["nose", "鼻", "nas"], "body", "displace"),
    (["mouth", "嘴", "口", "os", "oris"], "body", "displace"),
    (["tongue", "舌", "lingu"], "body", "displace"),
    (["tooth", "牙", "dent"], "body", "displace"),
    (["skin", "皮肤", "cutis", "derm"], "body", "displace"),
    (["bone", "骨", "oss"], "body", "displace"),
    (["blood", "血", "sanguin", "hem"], "body", "liquid"),
    (["heart", "心", "cord", "cardi"], "body", "displace"),
    (["finger", "指", "digit"], "body", "displace"),
    (["stand", "站", "立", "stare", "stat"], "body", "displace"),
    (["sit", "坐", "sed", "sess"], "body", "displace"),
    (["lie", "躺", "卧", "cub"], "body", "displace"),
    (["breathe", "呼吸", "spir", "hal"], "body", "displace"),
    (["see", "看", "vid", "vis", "spec", "spect"], "body", "displace"),
    (["hear", "听", "aud"], "body", "displace"),
    (["smell", "闻", "嗅", "odor", "ol"], "body", "displace"),
    (["touch", "触", "触", "tact", "tang"], "body", "friction"),
    (["taste", "尝", "味", "gust"], "body", "displace"),
]

NATURE_KEYWORDS = [
    (["water", "水", "aqua", "hydr", "aqu"], "liquid", "displace"),
    (["flow", "流", "flu", "flux"], "liquid", "displace"),
    (["wave", "波", "浪", "und", "wave"], "liquid", "oscillate"),
    (["rain", "雨", "pluv"], "liquid", "accumulate"),
    (["river", "河", "riv"], "liquid", "displace"),
    (["stream", "溪", "流", "stream"], "liquid", "displace"),
    (["drip", "滴", "stil"], "liquid", "diminish"),
    (["pour", "倒", "倾", "fund"], "liquid", "displace"),
    (["splash", "溅", "splash"], "liquid", "diffuse"),
    (["ripple", "涟漪", "波纹"], "liquid", "diffuse"),
    (["ice", "冰", "glac"], "temperature", "temp_change"),
    (["melt", "融化", "溶", "liqu"], "temperature", "temp_change"),
    (["freeze", "冻", "结冰", "gel"], "temperature", "temp_change"),
    (["boil", "沸", "bull"], "temperature", "temp_change"),
    (["burn", "烧", "火", "flagr", "ust"], "burning", "temp_change"),
    (["fire", "火", "ign", "pyro"], "burning", "temp_change"),
    (["flame", "火焰", "flamm"], "burning", "temp_change"),
    (["light", "光", "luc", "lumin", "lux", "phot"], "light", "diffuse"),
    (["shadow", "影", "umbra"], "light", "diminish"),
    (["dark", "暗", "黑", "nigr", "noct"], "light", "diminish"),
    (["bright", "亮", "明", "clar"], "light", "diffuse"),
    (["grow", "生长", "长", "cre", "aug"], "growth", "accumulate"),
    (["plant", "植物", "种", "plant"], "growth", "accumulate"),
    (["bloom", "花", "开花", "flor"], "growth", "diffuse"),
    (["spread", "扩展", "散布", "sparg"], "growth", "diffuse"),
    (["expand", "膨胀", "pand"], "growth", "accumulate"),
    (["wind", "风", "vent"], "movement", "displace"),
    (["blow", "吹", "flat"], "movement", "displace"),
    (["shake", "摇", "震", "quass"], "oscillation", "oscillate"),
    (["swing", "摆", "pend"], "oscillation", "oscillate"),
    (["vibrate", "振动", "vibr"], "oscillation", "oscillate"),
    (["sound", "声音", "son", "phon"], "oscillation", "oscillate"),
    (["ring", "响", "铃"], "oscillation", "oscillate"),
]

SYSTEM_RULES = [
    (["go", "去", "走", "行进", "grad", "gress", "ced", "cess"], "movement", "displace"),
    (["come", "来", "ven", "vent"], "movement", "displace"),
    (["move", "动", "移动", "mot", "mov"], "movement", "displace"),
    (["walk", "走", "步", "ambul"], "movement", "displace"),
    (["run", "跑", "curr", "curs", "cour"], "movement", "displace"),
    (["fly", "飞", "vol", "vola"], "movement", "displace"),
    (["swim", "游", "nat"], "movement", "displace"),
    (["jump", "跳", "sal", "sult"], "movement", "displace"),
    (["roll", "滚", "rot"], "movement", "displace"),
    (["climb", "爬", "攀", "scand"], "movement", "displace"),
    (["follow", "跟", "seq", "secut"], "movement", "displace"),
    (["lead", "领", "导", "duc", "duct"], "movement", "displace"),
    (["arrive", "到达", "riv"], "movement", "displace"),
    (["leave", "离开", "lict", "lingu"], "movement", "displace"),
    (["enter", "进入", "tr"], "movement", "displace"),
    (["return", "回", "返回", "torn"], "movement", "displace"),
    (["approach", "靠近", "prope"], "movement", "displace"),
    (["travel", "旅行", "trip"], "movement", "displace"),
    (["cross", "穿过", "cruc", "trans"], "movement", "displace"),
    (["pass", "经过", "pass"], "movement", "displace"),
    (["reach", "到达", "reac"], "movement", "displace"),
    (["wander", "漫游", "wand"], "movement", "displace"),
    (["escape", "逃", "fug"], "movement", "displace"),
    (["up", "上", "向上"], "direction", "displace"),
    (["down", "下", "向下"], "direction", "displace"),
    (["in", "内", "里", "进入"], "direction", "displace"),
    (["out", "外", "出"], "direction", "displace"),
    (["on", "上", "接触面"], "direction", "connection"),
    (["off", "脱离", "off"], "direction", "separation"),
    (["over", "上方", "越过"], "direction", "displace"),
    (["under", "下方"], "direction", "displace"),
    (["take", "拿", "取", "cap", "cept"], "movement", "displace"),
    (["put", "放", "pos", "posit"], "movement", "displace"),
    (["get", "获得", "得到"], "movement", "displace"),
    (["give", "给", "don", "dat"], "movement", "displace"),
    (["bring", "带来", "fer"], "movement", "displace"),
    (["carry", "带", "携带", "port"], "movement", "displace"),
    (["hold", "握", "持", "ten", "tain"], "connection", "connection"),
    (["pull", "拉", "tract", "trah"], "tension", "reshape"),
    (["push", "推", "pell"], "movement", "displace"),
    (["throw", "扔", "抛", "jac"], "movement", "displace"),
    (["catch", "接", "抓", "cap"], "connection", "connection"),
    (["lift", "提", "升", "lev"], "movement", "displace"),
    (["drop", "掉", "落", "still"], "movement", "displace"),
    (["open", "开", "aper"], "separation", "separate"),
    (["close", "关", "clud", "clus"], "connection", "connection"),
    (["cut", "切", "割", "cide", "cis"], "separation", "separate"),
    (["break", "打破", "破裂", "frag", "frang"], "separation", "separate"),
    (["split", "裂", "分", "sci"], "separation", "separate"),
    (["connect", "连接", "nect"], "connection", "connect"),
    (["attach", "附着", "tach"], "connection", "connect"),
    (["separate", "分离", "par"], "separation", "separate"),
    (["divide", "划分", "divid"], "separation", "separate"),
    (["tie", "绑", "系"], "connection", "connect"),
    (["fill", "填", "满", "plen"], "container", "accumulate"),
    (["empty", "空", "vac"], "container", "diminish"),
    (["contain", "包含", "tain"], "container", "connect"),
    (["change", "变", "mut"], "transition", "reshape"),
    (["become", "成为", "com"], "transition", "reshape"),
    (["turn", "转", "vert", "vers"], "transition", "reshape"),
    (["transform", "转变", "form"], "transition", "reshape"),
    (["make", "做", "造", "fact", "fect"], "transition", "accumulate"),
    (["build", "建", "筑", "aedif"], "transition", "accumulate"),
    (["create", "创造", "cre"], "transition", "accumulate"),
    (["form", "形成", "form"], "transition", "reshape"),
    (["start", "开始", "init"], "transition", "accumulate"),
    (["stop", "停", "st", "sist"], "transition", "diminish"),
    (["finish", "结束", "fin"], "transition", "diminish"),
    (["continue", "继续", "tin"], "transition", "connect"),
    (["tight", "紧", "tight"], "tension", "reshape"),
    (["loose", "松", "lax", "langu"], "tension", "reshape"),
    (["stretch", "拉伸", "伸展"], "tension", "reshape"),
    (["snap", "啪", "断"], "tension", "separation"),
    (["slack", "松弛"], "tension", "reshape"),
    (["rub", "擦", "摩擦"], "friction", "friction"),
    (["scratch", "刮", "抓"], "friction", "separation"),
    (["wipe", "擦掉"], "friction", "diminish"),
    (["grind", "磨", "碾"], "friction", "reshape"),
    (["bump", "碰", "撞"], "friction", "displace"),
    (["rotate", "旋转", "rot"], "rotation", "rotate"),
    (["spin", "自旋"], "rotation", "rotate"),
    (["twist", "扭", "tort"], "rotation", "reshape"),
    (["revolve", "公转", "volv"], "rotation", "rotate"),
    (["bend", "弯曲", "flect", "flex"], "deformation", "reshape"),
    (["fold", "折叠", "plic"], "deformation", "reshape"),
    (["squeeze", "挤压", "press"], "deformation", "reshape"),
    (["crumple", "揉皱"], "deformation", "reshape"),
    (["flatten", "压扁"], "deformation", "reshape"),
    (["know", "知道", "cogn", "gnos", "know"], "body", "displace"),
    (["think", "想", "思考", "cogit", "put"], "body", "displace"),
    (["believe", "相信", "cred"], "body", "displace"),
    (["remember", "记住", "memor"], "body", "displace"),
    (["forget", "忘记", "obl"], "body", "diminish"),
    (["understand", "理解", "stand"], "body", "displace"),
    (["learn", "学", "lern"], "body", "accumulate"),
    (["teach", "教", "doc", "doct"], "body", "displace"),
    (["find", "找到", "发现", "ven"], "body", "displace"),
    (["show", "展示", "示"], "light", "diffuse"),
    (["hide", "隐藏", "cel"], "light", "diminish"),
    (["seem", "看起来"], "body", "displace"),
    (["say", "说", "dic", "dict"], "body", "displace"),
    (["tell", "告诉", "tale"], "body", "displace"),
    (["speak", "说", "讲", "loqu", "locut"], "body", "displace"),
    (["talk", "谈", "talk"], "body", "displace"),
    (["call", "叫", "cal"], "body", "displace"),
    (["ask", "问", "quaer"], "body", "displace"),
    (["answer", "答", "spond"], "body", "displace"),
    (["read", "读", "leg", "lect"], "body", "displace"),
    (["write", "写", "scrib", "script"], "body", "displace"),
    (["sing", "唱", "can", "cant"], "body", "oscillate"),
    (["laugh", "笑"], "body", "oscillate"),
    (["cry", "哭"], "body", "displace"),
    (["mix", "混合", "mix", "mixt"], "mixing", "blend"),
    (["blend", "搅拌"], "mixing", "blend"),
    (["combine", "结合", "bin"], "mixing", "connect"),
    (["merge", "合并", "merg"], "mixing", "connect"),
    (["dissolve", "溶解", "solv"], "mixing", "blend"),
    (["stir", "搅", "stir"], "mixing", "blend"),
    (["live", "活", "viv", "vit"], "body", "displace"),
    (["die", "死", "mort"], "transition", "diminish"),
    (["eat", "吃", "ed", "vor"], "body", "displace"),
    (["drink", "喝", "bib"], "body", "displace"),
    (["sleep", "睡", "somn", "dorm"], "body", "displace"),
    (["work", "工作", "oper"], "body", "displace"),
    (["play", "玩", "lud"], "body", "displace"),
    (["buy", "买", "em"], "movement", "displace"),
    (["sell", "卖", "vend"], "movement", "displace"),
    (["pay", "付", "sol"], "movement", "displace"),
    (["use", "用", "ut", "us"], "body", "displace"),
    (["need", "需要", "nec"], "body", "displace"),
    (["want", "想要"], "body", "displace"),
    (["have", "有", "hab"], "connection", "connect"),
    (["try", "试", "tempt"], "body", "displace"),
    (["keep", "保持", "serv"], "connection", "connect"),
    (["let", "让", "permit"], "body", "displace"),
    (["do", "做", "作", "act", "fac"], "transition", "accumulate"),
    (["watch", "看", "注视", "vigil"], "body", "displace"),
    (["feel", "感觉", "触", "感", "sent"], "body", "displace"),
    (["begin", "开始", "init"], "transition", "accumulate"),
    (["set", "放", "设置", "sed"], "movement", "displace"),
    (["lose", "丢", "失", "loss"], "movement", "diminish"),
    (["meet", "遇", "会见", "meet"], "connection", "connect"),
    (["include", "包括", "clud"], "container", "connect"),
    (["provide", "提供", "vid"], "movement", "displace"),
    (["happen", "发生", "hap"], "transition", "displace"),
]


# ============================================================
# 小品词空间含义映射（用于词组实时推导）
# ============================================================
PARTICLE_SPACE = {
    "up":     "向上移动/增加/完成",
    "down":   "向下移动/减少/压制",
    "in":     "进入内部/被包围",
    "out":    "向外/脱离/耗尽",
    "on":     "接触表面/继续/附着",
    "off":    "脱离/离开/去除",
    "over":   "越过上方/覆盖/翻转",
    "under":  "在下方/被压制",
    "into":   "进入内部",
    "onto":   "附着到表面",
    "through":"穿过/穿透",
    "across": "横越/从一边到另一边",
    "along":  "沿着/顺着",
    "around": "环绕/绕行/在周围",
    "about":  "各处/大约/围绕",
    "away":   "离开/远离",
    "back":   "向后/返回",
    "forward":"向前",
    "ahead":  "在前面/向前",
    "behind": "在后面/落后",
    "apart":  "分开/分离",
    "together":"一起/聚集",
    "aside":  "到一边/撇开",
    "forth":  "向前/向外",
}


def _match_keyword(text: str, kw: str) -> bool:
    """智能关键词匹配：长词（>=4）子串匹配，短词（<=3）要求独立单词边界。"""
    if len(kw) >= 4:
        return kw in text
    # 短关键词：必须作为独立单词出现（前后是单词边界）
    import re
    return bool(re.search(r'\b' + re.escape(kw) + r'\b', text))


def match_carrier_change(word_origin: str) -> tuple:
    """将词根本义映射到载体+变化类型（三级优先级）。

    改进：短词根（<=3 字符）不再无差别子串匹配，
    避免 'ten' 匹配到 'sprenten' 这类假阳性。
    """
    if not word_origin:
        return None, None

    text = word_origin.lower()

    for kw_list, carrier_key, change_key in BODY_KEYWORDS:
        for kw in kw_list:
            if _match_keyword(text, kw):
                return carrier_key, change_key

    for kw_list, carrier_key, change_key in NATURE_KEYWORDS:
        for kw in kw_list:
            if _match_keyword(text, kw):
                return carrier_key, change_key

    for kw_list, carrier_key, change_key in SYSTEM_RULES:
        for kw in kw_list:
            if _match_keyword(text, kw):
                return carrier_key, change_key

    return None, None


def match_carrier_change_direct(word: str) -> tuple:
    """在所有映射表中直接匹配词本身（不依赖词源返回的文本）。"""
    w = word.lower()
    all_rules = BODY_KEYWORDS + NATURE_KEYWORDS + SYSTEM_RULES
    for kw_list, carrier_key, change_key in all_rules:
        if kw_list and kw_list[0] == w:
            return carrier_key, change_key
    return None, None


def detect_pos(word: str) -> str:
    """简单词性检测。"""
    w = word.lower()

    PARTICLES = {
        "up", "down", "in", "out", "on", "off", "over", "under",
        "to", "for", "with", "by", "at", "from", "into", "onto",
        "upon", "within", "without", "through", "across",
        "around", "about", "between", "among", "behind", "beneath",
        "beside", "beyond", "toward", "towards", "during", "since",
        "until", "of", "as", "than",
    }
    ADVERBS = {
        "never", "always", "often", "sometimes", "usually", "rarely",
        "seldom", "already", "just", "still", "yet", "once", "twice",
        "again", "very", "too", "enough", "almost", "nearly", "quite",
        "rather", "pretty", "much", "little", "well", "fast", "hard",
        "late", "early", "soon", "now", "then", "today", "tomorrow",
        "yesterday", "here", "there", "everywhere",
        "anywhere", "nowhere", "why", "where", "when", "how",
    }
    NOUN_SUFFIXES = (
        "tion", "sion", "ment", "ness", "ity", "dom", "ship",
        "ance", "ence", "ure", "ism", "ist",
        "ation", "ition", "logy", "graphy", "metry",
    )
    ADJ_SUFFIXES = ("ous", "ful", "less", "ive", "able", "ible", "al",
                     "ic", "ical", "ish", "like", "ent", "ant")

    if w in PARTICLES:
        return "particle"
    if w in ADVERBS or (w.endswith("ly") and len(w) > 4):
        return "adverb"
    if w.endswith(NOUN_SUFFIXES):
        return "noun"

    if w.endswith(("er", "or")) and len(w) > 5 and w not in {
        "offer", "cover", "order", "enter", "wonder", "alter",
        "filter", "gather", "render", "suffer",
    }:
        return "noun"

    if w.endswith(ADJ_SUFFIXES) and len(w) > 4:
        if w not in {"feel", "deal", "appeal", "reveal", "cancel", "label"}:
            return "adjective"

    return "verb"


# ============================================================
# L2 内容生成
# ============================================================

def generate_l2(word: str, carrier_key: str, change_key: str, etymology_results: list | None = None) -> dict:
    """按照两轴一对比生成 L2 标注 JSON。"""
    carrier = CARRIERS.get(carrier_key, {}).get("name", "")
    change = CHANGES.get(change_key, {}).get("name", "")

    scene = generate_scene(carrier_key)
    core_image = generate_core_image(carrier_key)
    derivations = generate_derivations(carrier_key, word)
    stages = generate_stages(carrier_key)

    dynamic_axis = {
        "type": "spectrum",
        "carrier": f"{word}的程度变化",
        "stages": stages,
        "description": f"从弱到强，{word}的程度逐级递增",
    } if len(stages) >= 3 else None

    spectrum = {
        "stages": stages,
        "carrier": core_image,
        "color_gradient": ["#38a169", "#7cb342", "#e67e22", "#e63946"],
    } if len(stages) >= 3 else None

    return {
        "word": word.upper(),
        "pos": detect_pos(word),
        "layer": "L2",
        "carrier": carrier,
        "change": change,
        "scene": scene,
        "static_axis": {
            "core_image": core_image,
            "derivations": derivations,
        },
        "dynamic_axis": dynamic_axis,
        "phrases": [],
        "comparisons": [],
        "spectrum": spectrum,
    }


def generate_scene(carrier_key: str) -> str:
    scenes = {
        "tension": "绳子/弹性体两端被拉，从松弛到绷紧到断裂",
        "friction": "两个表面接触并相对运动，产生摩擦/磨损",
        "movement": "某物从A点移动到B点",
        "transition": "某物从一种状态转变为另一种状态",
        "temperature": "物体的热量发生变化",
        "body": "人的身体部位/姿态发生变化",
        "direction": "物体在空间中的位置或方向发生变化",
        "separation": "原本连接的整体被分开",
        "connection": "两个物体连接/附着在一起",
        "container": "容器从空到满（或反之）的空间变化",
        "liquid": "液体沿路径运动",
        "growth": "物体由小变大/由内向外扩展",
        "light": "光线被遮挡或释放，物体可见性变化",
        "rotation": "物体绕轴做圆周运动",
        "oscillation": "物体绕平衡点做往复运动",
        "deformation": "物体受外力改变形状",
        "mixing": "两种以上物质混合在一起",
        "burning": "被火焰/热消耗",
    }
    return scenes.get(carrier_key, "物理画面")


def generate_core_image(carrier_key: str) -> str:
    images = {
        "tension": "一根绳子/弹性体两端被施加拉力",
        "friction": "两个表面在接触中相对运动",
        "movement": "一个物体在空间中从A点向B点移动",
        "transition": "一个物体正在从一种形态变成另一种形态",
        "temperature": "物体的温度正在升高或降低",
        "body": "人的身体部位在做动作或表达",
        "direction": "一个箭头指向某个方向，物体在空间中定位",
        "separation": "原本连在一起的东西被分开",
        "connection": "两个独立的东西连接在一起",
        "container": "一个容器中的内容物在增加或减少",
        "liquid": "液体沿着路径流动",
        "growth": "一个物体从小的状态逐渐变大",
        "light": "光线照射或遮挡产生的明暗变化",
        "rotation": "一个物体围绕轴心转动",
        "oscillation": "一个物体在平衡点两侧来回运动",
        "deformation": "一个物体在外力作用下形状改变",
        "mixing": "两种不同物质混合在一起",
        "burning": "火焰在消耗物体",
    }
    return images.get(carrier_key, "物理画面")


def generate_derivations(carrier_key: str, word: str) -> list:
    templates = {
        "tension": [
            {"meaning": "紧张/压力", "logic": "物理上的拉伸/绷紧 → 情绪上的紧张状态", "examples": []},
            {"meaning": "控制/约束", "logic": "用绳子拉住 → 对某人/某事的控制力", "examples": []},
        ],
        "friction": [
            {"meaning": "摩擦/冲突", "logic": "物理摩擦 → 人与人之间的摩擦/矛盾", "examples": []},
        ],
        "movement": [
            {"meaning": "进展/推进", "logic": "物理移动 → 事的进展/推进", "examples": []},
            {"meaning": "运行/运转", "logic": "人的移动 → 机器的持续运转", "examples": []},
        ],
        "transition": [
            {"meaning": "转变/转换", "logic": "物理形态变化 → 抽象的状态转变", "examples": []},
        ],
        "temperature": [
            {"meaning": "热情/冷淡", "logic": "物理的温度 → 情绪的温度", "examples": []},
        ],
        "body": [
            {"meaning": "延伸/抽象化", "logic": "身体部位/动作 → 抽象的功能或含义", "examples": []},
        ],
        "direction": [
            {"meaning": "方向/趋势", "logic": "物理空间的方向 → 抽象的发展方向", "examples": []},
        ],
        "separation": [
            {"meaning": "分离/区分", "logic": "物理上的分离 → 抽象上的区分/决定", "examples": []},
        ],
        "connection": [
            {"meaning": "关系/联系", "logic": "物理连接 → 人与人/事之间的关系", "examples": []},
        ],
        "container": [
            {"meaning": "包含/容纳", "logic": "物理容器 → 抽象上的包含关系", "examples": []},
        ],
        "liquid": [
            {"meaning": "流动/传递", "logic": "液体的流动 → 信息/情感的流动", "examples": []},
        ],
        "growth": [
            {"meaning": "增长/发展", "logic": "物理生长 → 抽象的增长/发展", "examples": []},
        ],
        "light": [
            {"meaning": "显现/明白", "logic": "光线照亮 → 明白/显示", "examples": []},
        ],
        "rotation": [
            {"meaning": "轮流/循环", "logic": "旋转一周 → 轮流/循环", "examples": []},
        ],
        "oscillation": [
            {"meaning": "犹豫/摇摆", "logic": "物理摇摆 → 主意不定", "examples": []},
        ],
        "deformation": [
            {"meaning": "扭曲/改变", "logic": "形状改变 → 事实/真相的扭曲", "examples": []},
        ],
        "mixing": [
            {"meaning": "混合/交融", "logic": "物质混合 → 文化/概念的融合", "examples": []},
        ],
        "burning": [
            {"meaning": "消耗/激情", "logic": "燃烧消耗 → 激情/精力的消耗", "examples": []},
        ],
    }

    base = templates.get(carrier_key, [])
    results = []
    for d in base:
        cp = dict(d)
        if not cp["examples"]:
            cp["examples"] = [f"{word.upper()} something.", f"The {word.lower()} is happening."]
        results.append(cp)
    return results


def generate_stages(carrier_key: str) -> list:
    stage_sets = {
        "tension": ["松弛", "微微绷紧", "拉紧", "绷紧", "即将断裂"],
        "friction": ["轻轻接触", "滑动摩擦", "滚动摩擦", "剧烈摩擦", "磨损"],
        "movement": ["静止", "慢速", "中速", "快速", "极速"],
        "transition": ["原始状态", "开始变化", "变化中", "变化完成", "新状态"],
        "temperature": ["冰冷", "凉", "常温", "温热", "滚烫"],
        "body": ["静止/放松", "轻微动作", "中等动作", "大幅动作", "极限动作"],
        "direction": ["远端", "靠近中", "到达", "在内部", "穿过"],
        "separation": ["连接", "开始分离", "分离中", "完全分开", "碎片化"],
        "connection": ["独立", "接近", "接触", "连接", "融合"],
        "container": ["空", "少量", "一半", "大部分满", "满溢"],
        "liquid": ["静止", "缓慢流动", "中速流动", "快速流动", "奔流"],
        "growth": ["极小", "较小", "中等", "较大", "巨大"],
        "light": ["全暗", "微弱光", "中等光", "明亮", "耀眼"],
        "rotation": ["静止", "慢速转动", "中速转动", "快速转动", "高速旋转"],
        "oscillation": ["静止", "微幅摆动", "中等摆动", "大幅摆动", "剧烈摆动"],
        "deformation": ["原始形状", "轻微变形", "明显变形", "严重变形", "完全变形"],
        "mixing": ["完全分离", "开始混合", "部分混合", "大部分混合", "完全融合"],
        "burning": ["未点燃", "小火", "中火", "大火", "熊熊燃烧"],
    }
    return stage_sets.get(carrier_key, ["阶段1", "阶段2", "阶段3", "阶段4", "阶段5"])


# ============================================================
# 词组实时推导
# ============================================================

# 常见词组组合画面常识库（核心词 + 小品词 → 实际画面）
# 处理：不在预标列表中、但属于常见组合的词组
COMMON_PHRASE_SCENES = {
    # run 系列
    ("run", "into"):   "人跑步时没刹住撞上某人/某物 → 偶然遇到（没预料到的接触）",
    ("run", "out"):    "人从容器/房间里跑出去 → 里面的东西渐渐空了 → 用完耗尽",
    ("run", "over"):   "车辆从物体上方碾过去 → 碾压/碾压式审核 → 快速过一遍",
    ("run", "away"):   "人朝远处跑脱离当前位置 → 逃离/逃避",
    ("run", "down"):   "从上往下跑 → 能量/状态逐渐降低 → 耗尽/撞倒",
    ("run", "off"):    "跑着脱离某个范围 → 离开/逃走/复印（脱离原稿）",
    ("run", "after"):  "追着某人/某物跑 → 追赶/追求",
    # cut 系列
    ("cut", "off"):    "一刀切下去，东西从连接处断开 → 切断/中断/隔绝",
    ("cut", "out"):    "从内部切出一块拿掉 → 删除/剪掉/停止",
    ("cut", "down"):   "从上往下砍 → 砍倒/减少/削减",
    ("cut", "up"):     "切成很多小块 → 切碎/割伤/使痛苦",
    ("cut", "through"):"用力切开穿过某物 → 穿透/抄近路穿过",
    # break 系列
    ("break", "down"): "东西从完整状态垮塌成碎片 → 崩溃/分解/故障",
    ("break", "up"):   "整体从内部碎裂成多块 → 分手/解散/打碎",
    ("break", "out"):  "从封闭状态冲出来 → 爆发/逃脱/出疹子",
    ("break", "into"): "冲入封闭空间 → 闯入/破门而入/突然开始",
    ("break", "off"):  "从整体掰下一块 → 折断/中断/断绝关系",
    ("break", "through"): "冲破障碍到达另一侧 → 突破/重大发现",
    # come 系列
    ("come", "in"):    "从外面走进来 → 进入/流行/到站",
    ("come", "out"):   "从里面走出来 → 出来/结果是/出柜/出版",
    ("come", "back"):  "从别处返回原处 → 回来/恢复/回想",
    ("come", "up"):    "从下往上移动 → 出现/即将发生/被提及",
    ("come", "across"):"从一边走到另一边遇到某物 → 偶然发现/被理解",
    ("come", "off"):   "从附着状态脱离 → 脱落/发生/成功或失败",
    # take 系列
    ("take", "off"):   "用手把东西从表面拿起脱离 → 脱掉/起飞/休假",
    ("take", "over"):  "伸手覆盖并接管某物 → 接管/取代/主导",
    ("take", "in"):    "用手接住并放进内部 → 吸收/理解/欺骗（放进圈套）",
    ("take", "out"):   "从内部取出到外部 → 拿出/消灭/带外出",
    ("take", "up"):    "从低处拿起 → 开始从事/占据空间/继续",
    # get 系列
    ("get", "up"):     "从躺/坐状态向上移动 → 起床/起身/上升",
    ("get", "out"):    "从内部移动到外部 → 出去/离开/泄露",
    ("get", "in"):     "从外部移动到内部 → 进入/上车/被录取",
    ("get", "off"):    "从接触面脱离 → 下车/离开/豁免",
    ("get", "over"):   "越过障碍物/困难 → 克服/从疾病恢复",
    ("get", "through"):"穿过通道/障碍 → 通过/接通电话/完成",
    ("get", "along"):  "沿着某路径一起移动 → 相处/进展",
    # go 系列
    ("go", "out"):     "从内部出去到外面 → 出去/熄灭/过时/约会",
    ("go", "in"):      "从外部进入内部 → 进去/进入/被理解",
    ("go", "up"):      "从低处向高处移动 → 上升/上涨/被烧毁",
    ("go", "down"):    "从高处向低处移动 → 下降/下跌/被记录/沉没",
    ("go", "off"):     "从稳定状态突然离开 → 爆炸/响铃/变质/失去兴趣",
    ("go", "through"): "穿过某物 → 经历/仔细检查/用完",
    ("go", "back"):    "往反方向移动 → 返回/追溯/违约",
    # turn 系列
    ("turn", "on"):    "旋转开关接触到导电位置 → 打开/启动/开启",
    ("turn", "off"):   "旋转开关脱离导电位置 → 关闭/关掉/使厌烦",
    ("turn", "up"):    "把音量/热度朝上旋转 → 调高/出现/发生",
    ("turn", "down"):  "把音量/热度朝下旋转 → 调低/拒绝",
    ("turn", "into"):  "转动方向进入另一种形态 → 变成/转为",
    ("turn", "over"):  "整个翻转过来 → 翻转/移交/翻面",
    # pick 系列
    ("pick", "up"):    "从低处把东西拿起带到高处 → 接人/学会/加速/捡起",
    ("pick", "out"):   "从一堆中挑选出来 → 挑出/认出/分辨",
    ("pick", "on"):    "把某人当作目标接触 → 挑选/欺负/找茬",
    # put 系列
    ("put", "on"):     "把东西放在表面 → 穿上/打开/假装/增加体重",
    ("put", "off"):    "把东西推离当前位置 → 推迟/使厌恶/脱掉",
    ("put", "out"):    "从内部推出去 → 熄灭/发布/使不方便",
    ("put", "down"):   "把东西放在低处 → 放下/记下/贬低",
    ("put", "up"):     "把东西从低处放到高处 → 举起/张贴/容忍/提供住宿",
    ("put", "in"):     "把东西放进容器/空间 → 放入/投入时间/安装",
    # look 系列
    ("look", "after"): "目光追随某人/某物 → 照顾/照看",
    ("look", "for"):   "目光扫视寻找 → 寻找/期待",
    ("look", "into"):  "目光投入内部 → 调查/研究",
    ("look", "up"):    "目光向上看 → 查字典/改善/仰望",
    ("look", "forward"): "目光投向前方 → 期待/盼望",
    # set 系列
    ("set", "up"):     "把东西从低处立起来 → 建立/设置/安排",
    ("set", "off"):    "从原地出发离开 → 出发/触发/引爆",
    ("set", "out"):    "从原地向外出发 → 出发/陈述/陈列",
    ("set", "down"):   "把东西放低 → 放下/记下/制定",
    # bring 系列
    ("bring", "up"):   "从低处带上来 → 提出/养育/呕吐",
    ("bring", "in"):   "从外面带进来 → 引入/赚钱/收获",
    ("bring", "out"):  "从内部带到外部 → 拿出/使显现/出版",
    ("bring", "back"): "带回到原处 → 带回/恢复/使想起",
    ("bring", "about"):"带领事情发生 → 导致/引起",
    # call 系列
    ("call", "off"):   "喊叫声脱离目标 → 取消/叫走",
    ("call", "out"):   "喊叫声向外发出 → 大声喊叫/召集/点名",
    ("call", "up"):    "喊叫声向上传递 → 打电话/征召/唤起回忆",
    ("call", "on"):    "喊叫声落在某人身上 → 拜访/号召/利用",
    # show 系列
    ("show", "up"):    "从隐藏状态向上出现 → 出现/到场/暴露",
    ("show", "off"):   "向外展示脱离常规 → 炫耀/卖弄",
    ("show", "in"):    "带领进入内部 → 领进来/引入",
    # hold 系列
    ("hold", "on"):    "手抓在表面不放开 → 坚持/稍等/紧紧抓住",
    ("hold", "up"):    "从下面托住不让掉下 → 举起/支撑/延误/抢劫",
    ("hold", "back"):  "拉住不让向前移动 → 阻止/隐瞒/退缩",
    ("hold", "out"):   "伸出手/物维持状态 → 伸出/坚持/提供希望",
    # keep 系列
    ("keep", "up"):    "维持在较高的位置 → 保持/继续/跟上",
    ("keep", "on"):    "停留在表面上不脱离 → 继续/坚持/穿着不脱",
    ("keep", "out"):   "挡在外面不让进入 → 阻止进入/不参与",
    ("keep", "away"):  "保持距离远离某物 → 远离/回避",
    # fall 系列
    ("fall", "down"):  "从上往下坠落 → 跌倒/倒塌/失败",
    ("fall", "off"):   "从表面坠落脱离 → 跌落/减少/下降",
    ("fall", "apart"): "整体碎裂成碎片 → 破碎/崩溃/关系破裂",
    ("fall", "behind"):"跟不上前进的步伐 → 落后/逾期",
    ("fall", "out"):   "从内部掉出去 → 掉落/脱落/争吵（关系掉出）",
    ("fall", "into"):  "掉进内部 → 陷入/落入/开始进入（某种状态）",
    # pull 系列
    ("pull", "off"):   "用力拉使脱离 → 成功做到/脱掉/驶离",
    ("pull", "out"):   "从内部拉出来 → 退出/撤出/拿出",
    ("pull", "over"):  "拉到一边/上方 → 靠边停车/覆盖",
    ("pull", "through"):"拉过困难/通道 → 渡过难关/康复",
    ("pull", "up"):    "向上拉 → 停下/拔起/拉近/责备",
    # push 系列
    ("push", "through"):"用力推穿过阻碍 → 推行通过/完成/挤过",
    ("push", "off"):   "推离接触面 → 离开/出发/推开",
    ("push", "back"):  "向后推 → 推迟/反击/反驳",
    # fill 系列
    ("fill", "in"):    "填满内部空间 → 填入/填写/代替/补上",
    ("fill", "out"):   "填充到使表面胀起 → 填写/使丰满/扩大",
    ("fill", "up"):    "填到满 → 加满/充满/吃饱",
    # give 系列
    ("give", "up"):    "把手里的东西向上交出去 → 放弃/投降/戒掉",
    ("give", "out"):   "向外分发/能量向外散 → 分发/耗尽/公布",
    ("give", "away"):  "把东西给出去远离自己 → 赠送/泄露/出卖",
    ("give", "in"):    "把手里的东西交给内部 → 屈服/让步/上交",
    ("give", "back"):  "归还到原处 → 归还/恢复/回报",
    # stand 系列
    ("stand", "up"):   "从坐/躺状态直立 → 起立/经得起/放鸽子",
    ("stand", "out"):  "从群体中站出来 → 突出/显眼/坚持",
    ("stand", "for"):  "站在某物的代表位置 → 代表/象征/容忍",
    ("stand", "by"):   "站在旁边等待/准备 → 旁观/支持/做好准备",
    # work 系列
    ("work", "out"):   "通过工作把问题梳理出来 → 解决/锻炼/结果是",
    ("work", "on"):    "持续在表面工作 → 致力于/影响/努力改善",
    ("work", "up"):    "逐渐向上工作 → 逐步建立/激发/升职",
    # 其他常用
    ("clean", "up"):   "把脏东西清理掉使空间变好 → 清理/打扫/赚钱",
    ("clear", "up"):   "把模糊的东西弄清晰 → 清理/放晴/澄清",
    ("close", "down"): "把运作中的东西关闭 → 关闭/倒闭/停业",
    ("count", "on"):   "把期待放在某人身上 → 依赖/指望",
    ("deal", "with"):  "处理/应对 = 用手对付某物 → 处理/做生意/涉及",
    ("end", "up"):     "最终到达某个终点 → 最终成为/结果",
    ("hang", "out"):   "挂在外面的状态 → 闲逛/晾晒/挂出",
    ("hang", "up"):    "挂在高处/挂断 → 挂断电话/悬挂/搁置",
    ("lead", "to"):    "带领走向某方向 → 导致/通向",
    ("leave", "out"):  "留在外面不纳入 → 遗漏/排除/不理会",
    ("line", "up"):    "排成一条线 → 排队/安排/对齐",
    ("live", "up"):    "活到期望的高度 → 达到期望/不辜负",
    ("miss", "out"):   "错过留在外面 → 错过/遗漏/失去机会",
    ("pass", "out"):   "从清醒状态向外出去 → 昏倒/分发/毕业",
    ("point", "out"):  "用手指指向外面 → 指出/指明",
    ("rule", "out"):   "用规则划出去 → 排除/取消/否决",
    ("sort", "out"):   "把混乱整理出来 → 解决/分类/整理",
    ("stick", "out"):  "从表面伸出来/突出 → 突出/坚持/忍耐",
    ("stop", "off"):   "停下并脱离主路线 → 中途停留/顺便造访",
    ("wait", "for"):   "等在某处面向某人/某物 → 等待/期待",
    ("watch", "out"):  "目光向外保持警觉 → 小心/留意/提防",
}


def derive_phrase_scene(core_word: str, particle: str) -> str | None:
    """对词组推导核心画面描述。

    逻辑：
      1. 优先查 COMMON_PHRASE_SCENES 常识库（常见组合直接返回有意义的描述）
      2. 查不到时，用核心词载体 + 小品词空间关系组合描述

    如果核心词本身无法确定载体，返回 None。
    """
    # 优先查常识库
    key = (core_word.lower(), particle.lower())
    if key in COMMON_PHRASE_SCENES:
        return COMMON_PHRASE_SCENES[key]

    # 查不到常识库，尝试实时组合
    carrier_key = None

    ck, _ = match_carrier_change_direct(core_word)
    carrier_key = ck

    if not carrier_key:
        try:
            results = load_etymology(core_word)
            orig, _ = extract_original_meaning(results) if results else (None, None)
            if orig:
                carrier_key, _ = match_carrier_change(orig)
        except Exception:
            pass

    if not carrier_key:
        return None

    particle_space = PARTICLE_SPACE.get(particle.lower(), particle)
    carrier_name = CARRIERS.get(carrier_key, {}).get("name", core_word)
    scene = f"{core_word.upper()}（{carrier_name}）+ {particle.lower()}（{particle_space}）→ 组合画面（需要人工精修）"

    return scene


def resolve_phrase(phrase: str) -> dict | None:
    """对一个词组进行实时推导。

    输入: "run into"
    输出: 包含 scene/meaning/logic 的 dict，或 None（无法推导）
    """
    parts = phrase.strip().lower().split()
    if len(parts) < 2:
        return None

    core_word = parts[0]
    particle = parts[1]

    scene = derive_phrase_scene(core_word, particle)
    if not scene:
        return None

    return {
        "phrase": phrase,
        "particle": particle,
        "layer": "L2",
        "scene": scene,
        "meaning": f"{core_word.upper()} + {particle.upper()} 的组合含义",
        "logic": f"物理上 {scene} → 抽象含义",
        "examples": [],
    }


# ============================================================
# 主入口：判断一个词能否走 L2
# ============================================================

def try_l2(word: str) -> dict | None:
    """尝试对一个词进行 L2 推理。

    Args:
        word: 查询词（可能含空格，如 "run into"）

    Returns:
        L2 结果 dict 或 None（无法确定物理意象）
    """
    # 如果是词组，尝试词组推导
    if " " in word.strip():
        return try_phrase_l2(word.strip())

    # 单词语
    return try_word_l2(word.strip())


def try_word_l2(word: str) -> dict | None:
    """对单个词尝试 L2 推理。"""
    # Step 1: 查词源
    results = None
    try:
        results = load_etymology(word)
    except Exception:
        pass

    original_meaning, lang = extract_original_meaning(results) if results else (None, None)

    # Step 2: 从本义匹配
    carrier_key, change_key = None, None
    if original_meaning:
        carrier_key, change_key = match_carrier_change(original_meaning)

    # Step 3: 如果词源没匹配到，直接匹配词本身
    if not carrier_key:
        carrier_key, change_key = match_carrier_change_direct(word)

    if not carrier_key or not change_key:
        return None

    return generate_l2(word, carrier_key, change_key, results)


def try_phrase_l2(phrase: str) -> dict | None:
    """对词组尝试 L2 推理。"""
    parts = phrase.strip().lower().split()
    core_word = parts[0]

    # 先推出核心词的 L2
    core_result = try_word_l2(core_word)
    if not core_result:
        return None

    # 如果有多于一个词（即含小品词），尝试推导词组画面
    if len(parts) >= 2:
        derived = resolve_phrase(phrase)
        if derived:
            # 以核心词 L2 为基础，增加词组推导信息
            core_result["phrases"] = core_result.get("phrases", []) + [derived]

    return core_result
