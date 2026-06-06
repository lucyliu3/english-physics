"""
annotation_loader.py — 从 skill/vocab/annotations/ 加载预标注 JSON

查表流程：
  1. 精确匹配 <word>.json
  2. 如果找到，对 phrases 为空的动词自动补上短语知识库内容
  3. 如果找不到，返回 None（交给实时推理层）
"""
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
ANNO_DIR = os.path.join(BASE, "skill", "vocab", "annotations")

# 从 realtime_l2.py 复用词组常识库
# 直接内联避免交叉依赖
COMMON_PHRASE_SCENES = {
    ("run", "into"):   "人跑步时没刹住撞上某人/某物 → 偶然遇到（没预料到的接触）",
    ("run", "out"):    "人从容器/房间里跑出去 → 里面的东西渐渐空了 → 用完耗尽",
    ("run", "over"):   "车辆从物体上方碾过去 → 碾压/碾压式审核 → 快速过一遍",
    ("run", "away"):   "人朝远处跑脱离当前位置 → 逃离/逃避",
    ("run", "down"):   "从上往下跑 → 能量/状态逐渐降低 → 耗尽/撞倒",
    ("run", "off"):    "跑着脱离某个范围 → 离开/逃走/复印（脱离原稿）",
    ("run", "after"):  "追着某人/某物跑 → 追赶/追求",
    ("cut", "off"):    "一刀切下去，东西从连接处断开 → 切断/中断/隔绝",
    ("cut", "out"):    "从内部切出一块拿掉 → 删除/剪掉/停止",
    ("cut", "down"):   "从上往下砍 → 砍倒/减少/削减",
    ("cut", "up"):     "切成很多小块 → 切碎/割伤/使痛苦",
    ("cut", "through"):"用力切开穿过某物 → 穿透/抄近路穿过",
    ("break", "down"): "东西从完整状态垮塌成碎片 → 崩溃/分解/故障",
    ("break", "up"):   "整体从内部碎裂成多块 → 分手/解散/打碎",
    ("break", "out"):  "从封闭状态冲出来 → 爆发/逃脱/出疹子",
    ("break", "into"): "冲入封闭空间 → 闯入/破门而入/突然开始",
    ("break", "off"):  "从整体掰下一块 → 折断/中断/断绝关系",
    ("break", "through"): "冲破障碍到达另一侧 → 突破/重大发现",
    ("come", "in"):    "从外面走进来 → 进入/流行/到站",
    ("come", "out"):   "从里面走出来 → 出来/结果是/出柜/出版",
    ("come", "back"):  "从别处返回原处 → 回来/恢复/回想",
    ("come", "up"):    "从下往上移动 → 出现/即将发生/被提及",
    ("come", "across"):"从一边走到另一边遇到某物 → 偶然发现/被理解",
    ("come", "off"):   "从附着状态脱离 → 脱落/发生/成功或失败",
    ("take", "off"):   "用手把东西从表面拿起脱离 → 脱掉/起飞/休假",
    ("take", "over"):  "伸手覆盖并接管某物 → 接管/取代/主导",
    ("take", "in"):    "用手接住并放进内部 → 吸收/理解/欺骗（放进圈套）",
    ("take", "out"):   "从内部取出到外部 → 拿出/消灭/带外出",
    ("take", "up"):    "从低处拿起 → 开始从事/占据空间/继续",
    ("get", "up"):     "从躺/坐状态向上移动 → 起床/起身/上升",
    ("get", "out"):    "从内部移动到外部 → 出去/离开/泄露",
    ("get", "in"):     "从外部移动到内部 → 进入/上车/被录取",
    ("get", "off"):    "从接触面脱离 → 下车/离开/豁免",
    ("get", "over"):   "越过障碍物/困难 → 克服/从疾病恢复",
    ("get", "through"):"穿过通道/障碍 → 通过/接通电话/完成",
    ("get", "along"):  "沿着某路径一起移动 → 相处/进展",
    ("go", "out"):     "从内部出去到外面 → 出去/熄灭/过时/约会",
    ("go", "in"):      "从外部进入内部 → 进去/进入/被理解",
    ("go", "up"):      "从低处向高处移动 → 上升/上涨/被烧毁",
    ("go", "down"):    "从高处向低处移动 → 下降/下跌/被记录/沉没",
    ("go", "off"):     "从稳定状态突然离开 → 爆炸/响铃/变质/失去兴趣",
    ("go", "through"): "穿过某物 → 经历/仔细检查/用完",
    ("go", "back"):    "往反方向移动 → 返回/追溯/违约",
    ("turn", "on"):    "旋转开关接触到导电位置 → 打开/启动/开启",
    ("turn", "off"):   "旋转开关脱离导电位置 → 关闭/关掉/使厌烦",
    ("turn", "up"):    "把音量/热度朝上旋转 → 调高/出现/发生",
    ("turn", "down"):  "把音量/热度朝下旋转 → 调低/拒绝",
    ("turn", "into"):  "转动方向进入另一种形态 → 变成/转为",
    ("turn", "over"):  "整个翻转过来 → 翻转/移交/翻面",
    ("pick", "up"):    "从低处把东西拿起带到高处 → 接人/学会/加速/捡起",
    ("pick", "out"):   "从一堆中挑选出来 → 挑出/认出/分辨",
    ("pick", "on"):    "把某人当作目标接触 → 挑选/欺负/找茬",
    ("put", "on"):     "把东西放在表面 → 穿上/打开/假装/增加体重",
    ("put", "off"):    "把东西推离当前位置 → 推迟/使厌恶/脱掉",
    ("put", "out"):    "从内部推出去 → 熄灭/发布/使不方便",
    ("put", "down"):   "把东西放在低处 → 放下/记下/贬低",
    ("put", "up"):     "把东西从低处放到高处 → 举起/张贴/容忍/提供住宿",
    ("put", "in"):     "把东西放进容器/空间 → 放入/投入时间/安装",
    ("look", "after"): "目光追随某人/某物 → 照顾/照看",
    ("look", "for"):   "目光扫视寻找 → 寻找/期待",
    ("look", "into"):  "目光投入内部 → 调查/研究",
    ("look", "up"):    "目光向上看 → 查字典/改善/仰望",
    ("look", "forward"): "目光投向前方 → 期待/盼望",
    ("set", "up"):     "把东西从低处立起来 → 建立/设置/安排",
    ("set", "off"):    "从原地出发离开 → 出发/触发/引爆",
    ("set", "out"):    "从原地向外出发 → 出发/陈述/陈列",
    ("set", "down"):   "把东西放低 → 放下/记下/制定",
    ("bring", "up"):   "从低处带上来 → 提出/养育/呕吐",
    ("bring", "in"):   "从外面带进来 → 引入/赚钱/收获",
    ("bring", "out"):  "从内部带到外部 → 拿出/使显现/出版",
    ("bring", "back"): "带回到原处 → 带回/恢复/使想起",
    ("bring", "about"):"带领事情发生 → 导致/引起",
    ("call", "off"):   "喊叫声脱离目标 → 取消/叫走",
    ("call", "out"):   "喊叫声向外发出 → 大声喊叫/召集/点名",
    ("call", "up"):    "喊叫声向上传递 → 打电话/征召/唤起回忆",
    ("call", "on"):    "喊叫声落在某人身上 → 拜访/号召/利用",
    ("show", "up"):    "从隐藏状态向上出现 → 出现/到场/暴露",
    ("show", "off"):   "向外展示脱离常规 → 炫耀/卖弄",
    ("show", "in"):    "带领进入内部 → 领进来/引入",
    ("hold", "on"):    "手抓在表面不放开 → 坚持/稍等/紧紧抓住",
    ("hold", "up"):    "从下面托住不让掉下 → 举起/支撑/延误/抢劫",
    ("hold", "back"):  "拉住不让向前移动 → 阻止/隐瞒/退缩",
    ("hold", "out"):   "伸出手/物维持状态 → 伸出/坚持/提供希望",
    ("keep", "up"):    "维持在较高的位置 → 保持/继续/跟上",
    ("keep", "on"):    "停留在表面上不脱离 → 继续/坚持/穿着不脱",
    ("keep", "out"):   "挡在外面不让进入 → 阻止进入/不参与",
    ("keep", "away"):  "保持距离远离某物 → 远离/回避",
    ("fall", "down"):  "从上往下坠落 → 跌倒/倒塌/失败",
    ("fall", "off"):   "从表面坠落脱离 → 跌落/减少/下降",
    ("fall", "apart"): "整体碎裂成碎片 → 破碎/崩溃/关系破裂",
    ("fall", "behind"):"跟不上前进的步伐 → 落后/逾期",
    ("fall", "out"):   "从内部掉出去 → 掉落/脱落/争吵（关系掉出）",
    ("fall", "into"):  "掉进内部 → 陷入/落入/开始进入（某种状态）",
    ("pull", "off"):   "用力拉使脱离 → 成功做到/脱掉/驶离",
    ("pull", "out"):   "从内部拉出来 → 退出/撤出/拿出",
    ("pull", "over"):  "拉到一边/上方 → 靠边停车/覆盖",
    ("pull", "through"):"拉过困难/通道 → 渡过难关/康复",
    ("pull", "up"):    "向上拉 → 停下/拔起/拉近/责备",
    ("push", "through"):"用力推穿过阻碍 → 推行通过/完成/挤过",
    ("push", "off"):   "推离接触面 → 离开/出发/推开",
    ("push", "back"):  "向后推 → 推迟/反击/反驳",
    ("fill", "in"):    "填满内部空间 → 填入/填写/代替/补上",
    ("fill", "out"):   "填充到使表面胀起 → 填写/使丰满/扩大",
    ("fill", "up"):    "填到满 → 加满/充满/吃饱",
    ("give", "up"):    "把手里的东西向上交出去 → 放弃/投降/戒掉",
    ("give", "out"):   "向外分发/能量向外散 → 分发/耗尽/公布",
    ("give", "away"):  "把东西给出去远离自己 → 赠送/泄露/出卖",
    ("give", "in"):    "把手里的东西交给内部 → 屈服/让步/上交",
    ("give", "back"):  "归还到原处 → 归还/恢复/回报",
    ("stand", "up"):   "从坐/躺状态直立 → 起立/经得起/放鸽子",
    ("stand", "out"):  "从群体中站出来 → 突出/显眼/坚持",
    ("stand", "for"):  "站在某物的代表位置 → 代表/象征/容忍",
    ("stand", "by"):   "站在旁边等待/准备 → 旁观/支持/做好准备",
    ("work", "out"):   "通过工作把问题梳理出来 → 解决/锻炼/结果是",
    ("work", "on"):    "持续在表面工作 → 致力于/影响/努力改善",
    ("work", "up"):    "逐渐向上工作 → 逐步建立/激发/升职",
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


def _enrich_phrases(data: dict, word: str) -> dict:
    """对预标注的结果做 phrases 字段的智能补充。

    如果预标注的 phrases 为空，且这个词在 COMMON_PHRASE_SCENES 常识库中，
    自动补上高频短语。不考虑 pos（batch_annotate 的 pos 判断可能不准）。
    """
    current_phrases = data.get("phrases") or []
    if current_phrases:
        return data  # 已有预标短语，不覆盖

    word_lower = word.lower()
    enriched = list(current_phrases)
    for (core, particle), scene in COMMON_PHRASE_SCENES.items():
        if core == word_lower:
            enriched.append({
                "phrase": f"{core} {particle}",
                "particle": particle,
                "layer": "L2",
                "scene": scene,
                "meaning": scene.split("→")[-1].strip() if "→" in scene else scene,
                "logic": f"物理上 {scene} → 抽象含义",
                "examples": [],
            })

    if enriched:
        data["phrases"] = enriched
        data["_phrases_source"] = "auto_enriched"
    return data


def load_annotation(word: str) -> dict | None:
    """加载预标注 JSON 文件。

    Args:
        word: 查询词（大小写不敏感，自动转小写）

    Returns:
        词条 dict（含自动短语补充）或 None（未命中）
    """
    word_lower = word.strip().lower()
    path = os.path.join(ANNO_DIR, f"{word_lower}.json")

    if not os.path.exists(path):
        return None

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError):
        return None

    # 对短语为空的动词自动补充
    data = _enrich_phrases(data, word_lower)

    return data
