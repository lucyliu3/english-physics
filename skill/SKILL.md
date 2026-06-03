---
name: from-physics
description: >
  Generate animated SVG visual illustration lessons for ANY English vocabulary —
  including particles (UP, DOWN, IN, OUT), verbs (GO, COME, GET, TAKE, PUT, RUN, CUT),
  adjectives (FLAKY, SLACK, TIGHT, LOOSE), nouns (RAIN, WIND, STREAM),
  adverbs (NEVER, ALWAYS), and more.
  Uses SVG vector graphics with animation to show how each word's abstract meanings
  evolve from its core physical image.
  Use whenever the user says "帮我拆解", "画一下", "图解", "做图", "分析一下这个词",
  "build a lesson", "create illustration for", "explain this word visually",
  or provides any English word they want to learn visually.
  Also triggers for batch requests like "批量生成", "生成这些词", "generate all these words".

  IMPORTANT: Only trigger for English vocabulary learning contexts. NOT for general drawing requests.
---

# Build English Visual Lesson

你是一个英语词汇视觉图解生成器。你能为任何词性（动词、名词、形容词、副词、介词/小品词）的英语单词生成直观的 HTML 图解页面，通过 **SVG 矢量绘图 + SVG 动画 + 小白框解释 + 🧠 逻辑链**，帮助学习者从核心意象推导出所有抽象用法。

## 核心原则

1. **每个页面解决一个"视觉难题"**：学习者的困惑是"为什么这个词有那么多看起来不相干的意思？"你的任务是用图画 + 逻辑链，展示它们其实是相通的。
2. **一句话定义核心意象**：所有用法都能回溯到同一个物理画面。
3. **小白框（white-box）= 逻辑桥梁**：凡是从物理意象跳到抽象用法的地方，都用小白框写上"如何从物理意义演变到这个抽象含义的？"。
4. **必须包含易混词对比**：如果有近义词、反义词或易混词，必须画出来做对比。
5. **SVG 是唯一输出格式**：矢量无限清晰，不需要处理 devicePixelRatio。永远不要使用 Canvas 或位图。
6. **优先使用动画**：空间关系、程度变化、运动过程都用 SVG `<animate>` 或 `<animateTransform>` 实现动画，而不是静态图。
7. **所有错误输出必须修正**：生成后检查 SVG `<animate>` 的 keyframe 对齐，确保页面打开无报错。

## 输出格式选择

| 场景 | 格式 | 说明 |
|------|------|------|
| 所有图解 | **SVG** | 矢量图，永远清晰，无 retina 模糊问题 |
| 动画 | **SVG + `<animate>`** | 替代 GIF，支持路径变形、位移、透明度、颜色过渡 |
| 页面容器 | HTML | 每个单词一个独立 HTML 文件，svg 嵌入其中 |

**注意**：
- ❌ 永远不要使用 `<canvas>` — Canvas 是位图，在高 DPI 屏上模糊，需要 devicePixelRatio 缩放处理
- ❌ 永远不要生成 GIF 或位图 — 无法直接生成二进制文件
- ✅ SVG viewBox 自动适配任何分辨率

## 页面结构

```
标题: [WORD] 图解
副标题: 一句话点明核心

1️⃣ 核心意象对比（卡片区 2列）
  - 每张卡 = SVG + 词性/释义 + 小白框
  - Card 1：本词核心意象（带动画）
  - Card 2：对比词/相关词（如果是单词深挖，则放另一个用法）
  - ⚠️ **Card 2 的对比词选择原则**：选择**最容易混淆或最有学习价值的对比**，不是随意选个反义词。例如 PUT 的对比应该是 PLACE（两个"放"的区别）而不是 PUT vs TAKE；MOVE 的对比应该是 SHIFT（近义区分）而不是 MOVE vs STAY。如果不存在好的对比词，可以展示该词的不同用法之间的对比。

2️⃣ 逻辑演化树（仅单词深挖模式）
  - 用小白框展示核心意象如何分流成不同语义分支
  - 每个分支 = 物理→抽象的 🧠 逻辑链

2.5️⃣ 🚗 驾车场景区块（仅动词有大量驾驶短语时，如 PULL、CUT、TURN）
  - 3行×2列网格，绿色系背景区分
  - 每张 SVG = 一个驾驶动作（道路+车辆+方向指示）
  - 动画必须是单向一次性到达（不是往返滑动）
  - 底部用一排小白框逐一解释每个短语的物理→抽象演变

3️⃣ 易混对比区（2列网格）
  - 每张对比卡 = SVG + 说明文字
  - 如果不存在易混词，改为展示该词不同用法之间的对比

4️⃣ 常见搭配/用法列表
  - 2列排列
  - 每项 = 英文 + 中文 + 📖 简短场景说明
  - 必须包含口语中最常见的搭配
  - 🚨 **页面中出现的每个固定搭配/口语短语，都必须在这个区（或紧邻的白框区）有对应的白框解释演变逻辑**。不能只在反义/相似区的列表里列出来就算了——列表中的每一项都必须在常见搭配区或白框中有解释。简单列了词组没有白框=不合格。

5️⃣ 反义/相似词扩展区
  - 3列卡片（红/蓝/紫底色）
  - 反义词、近义词辨析、易混提醒
  - 🚨 **此区只做快速索引参考**。如果在此区列出了固定搭配，每个搭配必须在前面的"常见搭配区"已经有白框解释。不允许在此区单独列出没有解释的搭配。

6️⃣ （可选）大场景图
  - 1720×400 宽幅 SVG，展示多个词在同一场景中的不同位置

7️⃣ （可选）程度光谱（任何有程度区分的词）
  - 用动画展示同一维度上的"由弱到强 / 由少到多 / 由浅入深"渐变
  - 意象载体根据词本身的物理画面决定（不限于绳子）
  - ⚠️ **推荐使用**：大多数动词/形容词/名词都有程度区分，**建议优先加入光谱**。只有当词没有明确程度维度（如 PUT 这样的纯动作动词）时才可省略。
```

## SVG 绘画规范

### 通用设置
- SVG viewBox 原则：`viewBox="0 0 760 400"`（标准卡片），`viewBox="0 0 760 340"`（对比图），`viewBox="0 0 1720 400"`（宽幅场景）
- SVG 本身不带背景色，用 `<rect width="100%" height="100%" fill="#fafaf8" rx="8"/>` 作为底色
- 配色方案（与 Canvas 时代相同）：
  - 主色（本词）：`#e67e22`（橙色）
  - 辅助色 1：`#38a169`（绿色，肯定/到达/正确）
  - 辅助色 2：`#e63946`（红色，否定/离开/错误）
  - 人物色：`#e63946`（红色圆 person）
  - 文字色：`#444`（正文）/ `#666`（辅助说明）/ `#999`（极次要）—— 避免大面积使用 #888 或 #999 作为正文，重要说明文字不低于 #666、字号不小于 13px
  - 结构物填充色：`#666` / `#888` / `#aaa` / `#ddd`（建筑物、路面、线条）

### 常用画法（SVG 元素）

**圆/人物**：
```svg
<circle cx="145" cy="70" r="32" fill="#f5e6d0"/>
<circle cx="135" cy="65" r="3.5" fill="#333"/>   <!-- 左眼 -->
<circle cx="155" cy="65" r="3.5" fill="#333"/>   <!-- 右眼 -->
<path d="M145,80 Q150,75 155,80" fill="none" stroke="#333" stroke-width="2"/>  <!-- 嘴 -->
```

**方向箭头**：
```svg
<line x1="100" y1="200" x2="300" y2="200" stroke="#e63946" stroke-width="3"/>
<polygon points="300,196 310,200 300,204" fill="#e63946"/>
```

**弧线/曲线**：使用二次贝塞尔 `<path d="Mx,y Qcx,cy ex,ey" />`
```svg
<path d="M110,220 Q380,280 650,220" fill="none" stroke="#e67e22" stroke-width="4" stroke-linecap="round"/>
```

**虚线**：`stroke-dasharray="4,4"`
```svg
<path d="..." fill="none" stroke="#ccc" stroke-width="2" stroke-dasharray="4,4"/>
```

**渐变背景**：使用 `<defs>` + `<linearGradient>`
```svg
<defs>
  <linearGradient id="myBg" x1="0" y1="0" x2="760" y2="400">
    <stop offset="0%" stop-color="#fdf6ee"/>
    <stop offset="100%" stop-color="#faf0e0"/>
  </linearGradient>
</defs>
<rect width="760" height="400" fill="url(#myBg)"/>
```

**投影/发光效果**：
```svg
<defs>
  <filter id="shadow">
    <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>
  </filter>
  <filter id="glow">
    <feGaussianBlur stdDeviation="5" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
```

### 小白框格式 (white-box)
```html
<div class="white-box"><strong>💡 核心逻辑</strong>：物理画面A → 第一步抽象B → 第二步抽象C。所以"X"引申为"Y"。</div>
<div class="white-box"><strong>🧠 如何演变的</strong>：物理画面 → 为什么这样引申 → 最终抽象含义</div>
```
小白框必须出现在：
- 每张核心卡片的下方
- 抽象用法/口语用法的附近
- 易混对比之后（解释为什么不同）

## SVG 动画规范

### 动画类型

| 效果 | 元素 | 示例 |
|------|------|------|
| 位移 | `<animateTransform type="translate" values="x1,y1; x2,y2;..." dur="3s" repeatCount="indefinite"/>` | 碎片飞散、游标移动 |
| 路径变形 | `<animate attributeName="d" values="M...;M...;..." dur="6s" repeatCount="indefinite"/>` | 绳子松紧变化 |
| 颜色过渡 | `<animate attributeName="stroke" values="#38a169;#e67e22;#e63946" dur="6s" repeatCount="indefinite"/>` | 绳子颜色随状态变化 |
| 透明度闪烁 | `<animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>` | 标注闪烁、标签渐隐 |
| 大小变化 | `<animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite"/>` | 脉动效果 |
| 旋转 | `<animateTransform type="rotate" values="0,cx,cy; 360,cx,cy" dur="4s" repeatCount="indefinite"/>` | 旋转效果 |
| 嘴巴开合 | `<animate attributeName="ry" values="3;7;3" dur="4s" repeatCount="indefinite"/>` | 打哈欠动画 |

### ⚠️ translate + rotate 组合陷阱（重要）

**不要在同一个层叠元素上同时用 `<animateTransform type="translate">` 和 `<animateTransform type="rotate">`（除非用 additive="sum"）**。

rotate 的旋转中心 `cx,cy` 是画布绝对坐标。当外层 translate 把元素移动到别的位置后，rotate 仍然围绕原来的画布坐标旋转——结果是刀片/轮子等旋转部件在错误的位置旋转，看起来像"散架"。

**正确做法：元素需要同时平移和旋转时，使用 additive="sum"**

```svg
<g>
  <animateTransform attributeName="transform" type="translate"
    values="0,0; 100,0" dur="3s" repeatCount="indefinite"/>
  <animateTransform attributeName="transform" type="rotate"
    values="0,50,50; 360,50,50" dur="3s" repeatCount="indefinite" additive="sum"/>
  <rect x="40" y="40" width="20" height="20" fill="#e67e22"/>
</g>
```
translate 和 rotate 都加在 `transform` 属性上，rotate 用 `additive="sum"` 叠加。

**备选方案（更安全）：用 opacity 切换状态代替旋转**

当旋转角度只有两个（张开/合拢）或离散变化时，直接画两个不同姿态的图形，用 opacity 交替显示：

```svg
<g>
  <animateTransform attributeName="transform" type="translate"
    values="200,0; 0,0; 200,0" dur="6s" repeatCount="indefinite"/>
  <!-- 姿态1：张开 -->
  <g>
    <animate attributeName="opacity" values="1;1;0;0;1;1"
      keyTimes="0;0.2;0.28;0.5;0.85;1" dur="6s" repeatCount="indefinite"/>
    <path d="M420,230 L360,195 L355,200 Z" fill="#888"/>
  </g>
  <!-- 姿态2：合拢 -->
  <g>
    <animate attributeName="opacity" values="0;0;1;1;0;0"
      keyTimes="0;0.26;0.28;0.45;0.5;1" dur="6s" repeatCount="indefinite"/>
    <path d="M420,230 L365,220 L362,225 Z" fill="#888"/>
  </g>
</g>
```
这种方法完全规避了 rotate 中心错位问题，适用于"剪刀开合""门开关""盖子翻动"等只需要两个状态切换的场景。

### 关键同步规则（极为重要）

**所有需要同步的动画元素必须拥有完全相同的 keyframe 数量（values 数量）**。

错误示例（会导致游标走到 BROKEN 时绳子还在 TIGHT 状态）：
```
游标 cx values: 6个值（只包含正向阶段）
绳子 d values: 8个值（包含了额外帧）
→ 同步错位！
```

正确做法（往返动画）：
```
6阶段往返 → 11个值 (6正向 + 5返回，因为最后一个重复了)
6阶段往返 → 13个值 (6正向 + 6返回 + 1重复结尾，更平滑)

所有相关元素统一使用完全相同的 values 数量：
- 游标 cx: 13个值
- 绳子 d: 13个值
- 绳子 stroke: 13个值
- 每个标签 opacity: 11个值（错开高亮时段）
- 每个砝码 translate: 11个值
- 底部状态文字 opacity: 11个值（错开显示）
```

### 往返动画的通用模式

```
正向阶段数 N，总 keyframe 数 = N + (N-1) + 1 = 2N（往返 + 重复结尾）
常用 N=6 → 13个 values
     N=5 → 11个 values
     N=4 → 9个 values
```

## 程度光谱设计模式（适用于所有词性）

任何有程度区分的词都可以用光谱来展示。关键原则：**意象载体必须根据词本身的物理画面来选择**，而不是千篇一律地用绳子。

### 设计结构（通用框架）

```
左端（最弱/最少/最紧） ←—— 游标扫描 ——→ 右端（最强/最多/最松）
  阶段1 → 阶段2 → 阶段3 → 阶段4 → 阶段5 → 阶段6（往返循环）
  每个阶段：不同的颜色 + 不同的物理状态 + 标签 + 底部状态文字
```

核心元素：
- **两个固定端点**：代表维度的两端（比如"紧↔松"、"静↔动"、"少↔多"）
- **中间介质**：根据词本身的意象选择（见下表）
- **扫描游标**：圆形标记从左到右扫描，指示当前阶段
- **阶段标签**：每个位置显示对应的词/短语，当前阶段高亮
- **状态文字**：底部显示当前阶段的文字说明

### 意象载体选择（按词性）

不同词性的词，选择最能体现其核心意象的载体：

| 词性 | 核心意象逻辑 | 推荐载体 | 示例 |
|------|-------------|---------|------|
| **形容词** | 性质的程度变化 | 绳子/布料/材料变形 | TIGHT→SLACK→LOOSE（绳子由紧到松），CLEAN→DIRTY（白布变脏），FULL→EMPTY（杯子水位下降） |
| **动词** | 动作的力度/速度/频率渐变 | 人物动作/物体运动轨迹 | WHISPER→SPEAK→SHOUT（声波大小），WALK→JOG→RUN→SPRINT（人物速度），DRIP→FLOW→POUR（水流速度） |
| **名词** | 数量/尺寸/规模的渐变 | 容器填充/物体堆叠 | DRIZZLE→RAIN→DOWNPOUR（雨滴密度），BREEZE→WIND→GALE（风纹波动），STREAM→RIVER（河道宽度） |
| **小品词/介词** | 空间距离/接触程度的渐变 | 物体与目标的位置关系 | TOWARD→TO→AT→IN（箭头从远到近再到进入），NEAR→NEXT TO→TOUCHING（两个物体的距离） |
| **副词** | 频率/程度的渐变 | 刻度尺/进度条 | NEVER→SOMETIMES→OFTEN→ALWAYS（时间轴的覆盖范围） |

**设计要点**：
1. 游标扫过的区域底色渐变（如从绿渐变为红），直观显示"安全区"→"警告区"→"危险区"
2. 每个阶段标签用不同的颜色和字体大小表示程度轻重
3. 底部状态文字只有当前阶段可见（用 opacity 动画错开）
4. 往返循环周期建议 20s，让学习者有时间看清每个阶段
5. **climax 类光谱**（描述"崩溃/断裂/超过极限"的词）：用**单向→终结**模式代替往返循环。元素从左到右到达 climax（如断裂/砸下/爆炸）后消失或定格，等待周期结束重新开始。使用 keyTimes 控制节奏：前半段递进，最后瞬间爆发。总时长包含足够的展示时间让用户看清结果。
6. **无游标的颜色条模式**（适用于人物状态光谱）：用底部色条本身的颜色渐变（绿→黄→橙→红）替代游标扫描，色条上方放置固定阶段标签，所有阶段同时可见。当前阶段标签用粗体/大字号高亮。

### 动词程度光谱实例（WALK→JOG→RUN→SPRINT）

```
载体：人物在不同速度下移动
layout：一条跑道，从左到右4个人物剪影
动画：第一个人原地慢走 → 第二个人快走 → 第三个人慢跑 → 第四个人冲刺跑
      游标扫描指示当前阶段，人物动作切换
```

### 名词程度光谱实例（DRIZZLE→RAIN→DOWNPOUR）

```
载体：雨滴密度变化
layout：同一片天空区域
动画：雨滴数量从3-5根稀疏线条 → 10-15根 → 30+根密集线条
      背景从浅灰渐变为深灰
      底部游标指示降水量等级
```

### 小品词程度光谱实例（TO→AT→IN→THROUGH）

```
载体：一个箭头从远处飞向盒子，最终穿透
layout：箭头 + 目标盒子
动画：
  阶段1: TOWARD — 箭头在远处，指向盒子
  阶段2: TO — 箭头靠近盒子但未接触
  阶段3: AT — 箭头接触到盒子表面
  阶段4: IN — 箭头进入盒子内部
  阶段5: THROUGH — 箭头穿透盒子从另一侧出来
```

### 往回参考

完整的绳子（形容词）光谱实现细节可参考 flaky_slack.html 中的 spectrum-wrap 部分：
- 绳子路径的二次贝塞尔动画
- 砝码逐渐加重带来的下垂变化
- 断线头和碎片效果
- 6阶段标签的 opacity 错开模式
- 游标与所有元素同步的13帧往返动画

这些动画技术（keyframe 同步、往返模式、阶段标签错开）同样适用于其他词性的光谱设计，只需替换意象载体。

## 常见动画场景模式

### 设计原则
每个动画场景的视觉语言必须由**该词的核心意象**决定。以下模式是已经验证过的成功案例，可以参考其技术实现，但不要盲目套用——先想清楚这个词的物理画面是什么。

### 1. 碎屑飞散模式（适用于"脱落/分离"类概念）
适用于 FLAKY, CRUMBLE, SHED, PEEL 等涉及"碎片从主体脱离"的词。
N 个碎片（通常 8-12 个），每个有不同的：
- 起始位置（沿物体右侧分布）
- 飞行方向（translate 路径不同）
- 持续时间（2.5-4.2s 之间随机，产生自然节奏）
- 大小和颜色（不同色调的金黄色）

每个碎片包含：
```svg
<g filter="url(#shadow)">
  <rect x="..." y="..." width="14" height="8" rx="4" fill="url(#flakeGrad)" transform="rotate(20,cx,cy)">
    <animateTransform attributeName="transform" type="translate"
      values="0,0; 40,-50; 80,-70; 120,-60" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;1;0.6;0" dur="3s" repeatCount="indefinite"/>
  </rect>
</g>
```

### 2. 绳子松紧循环模式（适用于"松紧/张力"类概念）
适用于 SLACK, TIGHT, TAUT, LOOSE, TENSE 等涉及"绷紧-松弛"的词。
```svg
<path fill="none" stroke-width="4" stroke-linecap="round">
  <animate attributeName="d"
    values="
      M110,220 Q380,230 650,220;
      M110,220 Q380,255 650,220;
      M110,220 Q380,280 650,220;
      M110,220 Q380,310 650,220;
      M110,220 Q380,280 650,220;
      M110,220 Q380,255 650,220;
      M110,220 Q380,230 650,220"
    dur="6s" repeatCount="indefinite"/>
</path>
```
挂着的衣物跟着绳子起伏：用 `<animateTransform>` 同步

### 3. 人物对比模式（适用于两个词的行为对比）
左侧人物执行动作A，右侧人物执行动作B，中间 VS 标识。
例如 FLAKY vs SLACK：左侧人物身体掉渣，右侧人物挂在晃动的绳子上打哈欠。

### 4. 速度/力度渐变模式（适用于动作动词）
人物/物体的运动速度或幅度逐渐变化。
例如 WALK→JOG→RUN→SPRINT：人物剪影的腿部摆动频率和跨步距离逐阶段增大。
例如 WHISPER→SPEAK→SHOUT：声波弧线从短小到巨大，人物嘴型从小到大。

### 5. 数量/密度渐变模式（适用于名词）
场景中的元素数量逐渐增多或减少。
例如 DRIZZLE→RAIN→DOWNPOUR：雨滴线条从稀疏到密集，背景从浅灰到深灰。
例如 STREAM→RIVER：河道宽度逐渐加宽，水流箭头逐渐变大。

### 6. 空间距离渐变模式（适用于小品词/介词）

### 7. 人物状态渐变模式（适用于"情绪/承受力/压力"类概念）

适用于 SNAP（崩溃临界点），以及任何涉及"人的情绪/状态从正常到失控"的词。

**多人物并排递进法**（SNAP 验证）：
```
5个人从左到右并排站，代表同一个人的5种状态递进
第1人：RELAXED — 放松微笑，手臂自然下垂
第2人：ANNOYED — 皱眉，手臂交叉（防御姿态）
第3人：STRESSED — 抿嘴冒汗，手摸头
第4人：ON EDGE — 眼睛睁大，握拳颤抖
第5人：SNAP! — 被砸扁/崩溃，碎片飞散
```

**设计要点**：
- 所有人从一开始就全部出现（永不消失），只有第5人最后变换形态
- 用外部元素（如压力球从头顶滚过）来驱动压力递进的视觉叙事，而不是让人物自己消失
- 底部色条从左到右渐变指示当前阶段（而不是游标扫描）
- **单向→终结模式**：动画到达最右端（climax）后，元素可以砸下/消失，不往返循环
- 阶段用颜色递进：绿 → 黄绿 → 黄 → 橙 → 红

**关键实现技巧（keyTimes 组合法）**：
```svg
<!-- 单向分阶段到达 + 终结消失 -->
<circle r="10" fill="url(#grad)">
  <!-- cx 从左侧滚到最右边 -->
  <animate attributeName="cx" values="-40;-40;70;180;290;400;510;520;520;520"
    keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1"
    dur="28s" repeatCount="indefinite"/>
  <!-- cy：抛物线滚动 → 最后砸到地面 -->
  <animate attributeName="cy" values="280;280;265;250;235;220;210;210;380;380"
    keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1"
    dur="28s" repeatCount="indefinite"/>
  <!-- r 逐步增大 -->
  <animate attributeName="r" values="10;10;18;26;34;42;52;52;52;52"
    keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1"
    dur="28s" repeatCount="indefinite"/>
</circle>
```
`keyTimes` + `values` 配合 total `dur`，实现"动画前半段是位移，最后瞬间是砸下来"的叙事节奏。总时长 28s 包含：滚动 16s + 到达停留 1s + 砸下 0.5s + 展示被砸结果 10.5s。

**元素替换动画技巧（同一位置状态突变）**：

当需要在同一位置把一个元素"变成"另一个形态（如人物从站立变成被砸扁），使用两个 `<g>` 组 + 相反的 opacity 动画，在切换点交叉：

```svg
<!-- 切换前：站立人物（前 53% 可见，之后隐藏） -->
<g>
  <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.53;0.55;1" dur="28s" repeatCount="indefinite"/>
  <!-- 站立人物的全部 SVG 元素 -->
  <circle cx="..." cy="270" r="14" fill="#f5e6d0"/>
  <line x1="..." y1="284" x2="..." y2="310" stroke="#333" stroke-width="2"/>
  ...
</g>

<!-- 切换后：被砸扁形态（前 55% 隐藏，之后显示） -->
<g>
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.55;0.57;1" dur="28s" repeatCount="indefinite"/>
  <ellipse cx="..." cy="310" rx="28" ry="10" fill="#f5e6d0"/>
  <!-- 碎片飞散 -->
  <rect x="..." y="..." width="6" height="4" rx="1" fill="#888">
    <animateTransform attributeName="transform" type="translate" values="0,0; -25,12" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite"/>
  </rect>
  ...
</g>
```
**关键**：两个组的 keyTimes 要留出重叠区间（如 0.53→0.57），确保在人眼感知上是"瞬间切换"而非闪烁消失又出现。切换后的形态一旦出现就一直显示到周期结束。

**人物表情切换画法**（标准化模板）：
```svg
<!-- 放松人物 -->
<g>
  <circle cx="80" cy="300" r="14" fill="#f5e6d0"/>
  <circle cx="76" cy="297" r="2" fill="#333"/>     <!-- 左眼 -->
  <circle cx="84" cy="297" r="2" fill="#333"/>     <!-- 右眼 -->
  <path d="M77,305 Q80,309 83,305" fill="none" stroke="#333" stroke-width="1.5"/>  <!-- 微笑 -->
  <line x1="80" y1="314" x2="80" y2="330" stroke="#333" stroke-width="2"/>         <!-- 身体 -->
  <line x1="80" y1="318" x2="65" y2="330" stroke="#333" stroke-width="1.5"/>       <!-- 左臂 -->
  <line x1="80" y1="318" x2="95" y2="330" stroke="#333" stroke-width="1.5"/>       <!-- 右臂 -->
</g>

<!-- 紧张人物（颤抖握拳） -->
<g>
  <circle cx="..." cy="300" r="14" fill="#f5e6d0"/>
  <circle cx="..." cy="297" r="3" fill="#333">
    <animate attributeName="r" values="2.5;3;2.5" dur="0.5s" repeatCount="indefinite"/>
  </circle>
  <ellipse cx="..." cy="306" rx="4" ry="3" fill="#333"/>  <!-- 张嘴 -->
  <line x1="..." y1="314" x2="..." y2="330" stroke="#333" stroke-width="2.5"/>
  <line x1="..." y1="318" x2="..." y2="330" stroke="#333" stroke-width="2"/>
  <!-- 颤抖线 -->
  <path d="M... Q... ..." fill="none" stroke="#e67e22" stroke-width="1">
    <animate attributeName="stroke" values="#e67e22;#c0392b;#e67e22" dur="0.3s" repeatCount="indefinite"/>
  </path>
</g>

<!-- 被砸扁 + 爆星效果 -->
<g>
  <ellipse cx="..." cy="332" rx="28" ry="10" fill="#f5e6d0"/>
  <!-- 伸出的手脚 -->
  <line x1="..." y1="332" x2="..." y2="324" stroke="#333" stroke-width="2"/>
  <!-- 爆星 -->
  <text x="..." y="310" fill="#e63946" font-size="22" font-weight="900">💥 SNAP!</text>
  <circle cx="..." cy="295" r="2.5" fill="#f1c40f">
    <animateTransform attributeName="transform" type="translate" values="0,0; -20,-25" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/>
  </circle>
  <!-- 碎片飞散 -->
  <rect x="..." y="..." width="6" height="4" rx="1" fill="#888">
    <animateTransform attributeName="transform" type="translate" values="0,0; -25,12" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite"/>
  </rect>
</g>
```

### 8. 驾车操控模式（适用于动词的驾驶场景短语动词）

当某个动词在驾驶场景中有大量高频短语用法时（如 PULL up/over/into/out/away、CUT in/off、TURN into/off），需要专门开辟一个独立的驾驶场景区块。

**设计要点**：
- 使用绿色系背景（`#f0faf5` / `#e8f5ec`）与主页面橙色系区分
- 每一张 SVG 展示一个独立的驾驶动作，构图尽量统一视角（俯视或侧视）
- 每张 SVG 的标题文字：`fill="#444" font-size="15" font-weight="600"`，放在图下方
- 图中必须包含道路（车道线 + 路沿）+ 车辆 + 动作方向指示（箭头/路径线）+ 辅助元素（刹车痕迹、尾气、警灯等）
- **动画必须是单向一次性到达**（`values="start;end" keyTimes="0;1"`），车辆到达目标后停住展示场景，周期结束后重新开始。不要做往返滑动（那会让学习者困惑——明明写的是"到达"但车子又滑走了）
- 整个区块的下方用小白框逐一解释每个短语的物理→抽象演变

**布局**（3行×2列 = 6张 SVG）：
```
第1行：pull up（到达停下）| pull over（靠边被拦）
第2行：pull into（开进车位）| pull out of（驶出车位）
第3行：pull away（起步驶离）| pull a U-turn（掉头）
```

**驾驶场景 SVG 模板（pull away 示例）**：
```svg
<svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="260" fill="#f0faf5" rx="8"/>
  <!-- 道路 -->
  <rect x="0" y="80" width="760" height="70" fill="#555"/>
  <line x1="0" y1="115" x2="760" y2="115" stroke="#ffd700" stroke-width="2" stroke-dasharray="16,12"/>
  <!-- 路沿 -->
  <rect x="0" y="150" width="760" height="8" fill="#999"/>
  <rect x="0" y="158" width="760" height="50" fill="#888"/>
  <!-- 路边静止车辆 -->
  <rect x="50" y="165" width="55" height="24" rx="6" fill="#2c3e50"/>
  <!-- 起步驶离的车辆 -->
  <g>
    <animateTransform attributeName="transform" type="translate"
      values="0,0; 300,0"
      keyTimes="0; 1"
      dur="3s" repeatCount="indefinite"/>
    <rect x="220" y="85" width="55" height="24" rx="6" fill="#e67e22"/>
  </g>
  <!-- 起步箭头 -->
  <path d="M250,170 L250,130" stroke="#e67e22" stroke-width="2.5" stroke-dasharray="4,3">
    <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
  </path>
  <text x="380" y="240" text-anchor="middle" fill="#444" font-size="15" font-weight="600" font-family="sans-serif">从路边/停止状态开始驶离</text>
  <text x="380" y="60" text-anchor="middle" fill="#e67e22" font-size="14" font-weight="bold" font-family="sans-serif">PULL AWAY</text>
</svg>
```

**注意**：pull over 场景应包含警车和警灯闪烁动画（`<animate attributeName="fill">`），突出"被警察拦停"这个最常用场景。

**驾驶场景小白框范例**：
```html
<div class="white-box"><strong>🚗 pull up (to)</strong> = 开车到某地停下。物理来源：骑马时拉缰绳（pull up on the reins）让马停下 → 引申为汽车"到达+停下"。<br>
<em>"Pull up to the grocery store, I'll be right out."</em>（开到杂货店门口，我马上出来）<br>
<span style="color:#666; font-size:12.5px;">💡 对比：pull up 强调"到达并停靠"，而 pull over 强调"从车道移到路边"。</span></div>
```
小白框中每个短语都需包含：(1) 短语 + 中文释义 (2) 物理来源 (3) 例句 (4) 可选对比说明（用 `#666` 12.5px 灰色）。


## 词汇参考

详细词库见 `vocab/` 目录下的分类文件：

| 文件 | 内容 | 数量 |
|------|------|:----:|
| [vocab/particles.md](vocab/particles.md) | 小品词/介词（方向、位置、时间、逻辑、复合介词、短语动词核心） | 100+ |
| [vocab/verbs.md](vocab/verbs.md) | 动词（移动、身体、心智、日常、社交、情感、存在、系动词） | 200+ |
| [vocab/adjectives.md](vocab/adjectives.md) | 形容词（空间、松紧、温度、光亮、速度、程度、状态、情绪） | 150+ |
| [vocab/nouns.md](vocab/nouns.md) | 名词（自然现象、水流、声音、能量、空间、身体部位、材料） | 100+ |
| [vocab/adverbs.md](vocab/adverbs.md) | 副词（频率、程度、速度、方式、时间、地点、逻辑、连接） | 80+ |

不在列表中的词也可以处理，基于对单词本身的理解生成图解。

## HTML 模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{TITLE}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system, BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:linear-gradient(135deg,#f5f0e8 0%,#f0ebe0 100%); display:flex; justify-content:center; padding:48px 24px; color:#1a1a1a; }
  .container { max-width:960px; width:100%; background:rgba(255,255,255,0.92); border-radius:20px; padding:48px 40px 56px; box-shadow:0 8px 40px rgba(0,0,0,0.07); }

  h1 { font-size:32px; font-weight:800; text-align:center; margin-bottom:4px; background:linear-gradient(135deg,#e67e22,#d35400); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:-0.5px; }
  .subtitle { text-align:center; color:#666; font-size:15px; margin-bottom:36px; letter-spacing:1px; }

  .section-title { font-size:17px; font-weight:700; margin-bottom:20px; color:#333; display:flex; align-items:center; gap:10px; }
  .section-title .bar { display:inline-block; width:4px; height:18px; background:linear-gradient(180deg,#e67e22,#f39c12); border-radius:2px; flex-shrink:0; }

  .cards { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:40px; }
  .card { background:#fafaf8; border:1px solid #e8e8e4; border-radius:16px; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s; }
  .card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.10); }
  .card svg { width:100%; height:auto; display:block; background:#fafaf8; border-radius:16px 16px 0 0; }
  .card-body { padding:18px 20px 22px; }
  .card-body h3 { font-size:18px; font-weight:700; margin-bottom:2px; }
  .card-body h3 .hl { color:#e67e22; }
  .card-body .pos { font-size:12px; color:#bbb; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .card-body .def { font-size:13.5px; color:#444; line-height:1.65; }
  .card-body .def .eg { color:#777; font-size:13px; font-style:italic; display:block; margin-top:4px; border-left:2px solid #e8e0d0; padding-left:10px; }

  .white-box { background:#fff; border:1px solid #e8e0d0; border-radius:10px; padding:14px 18px; margin-top:14px; font-size:13px; color:#555; line-height:1.65; box-shadow:0 2px 8px rgba(0,0,0,0.03); position:relative; }
  .white-box::before { content:''; position:absolute; top:-6px; left:20px; width:12px; height:12px; background:#fff; border-left:1px solid #e8e0d0; border-top:1px solid #e8e0d0; transform:rotate(45deg); }
  .white-box strong { color:#e67e22; }

  .compare-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }
  .compare-card { background:#fafaf8; border:1px solid #e8e8e4; border-radius:14px; overflow:hidden; transition:transform 0.2s; }
  .compare-card:hover { transform:translateY(-2px); }
  .compare-card svg { width:100%; height:auto; display:block; border-radius:14px 14px 0 0; }
  .compare-card .label { padding:12px 16px 18px; }
  .compare-card .label .p { font-size:15px; font-weight:700; }
  .compare-card .label .desc { font-size:12px; color:#888; margin-top:3px; line-height:1.55; }

  .usage-section { background:linear-gradient(135deg,#fafaf8,#f8f6f2); border:1px solid #e8e8e4; border-radius:14px; padding:22px 26px; margin-bottom:20px; }
  .usage-section h4 { font-size:15px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
  .usage-list { display:grid; grid-template-columns:1fr 1fr; gap:4px 32px; padding:0; }
  .usage-item { padding:7px 0; border-bottom:1px dashed #eee; display:flex; flex-direction:column; }
  .usage-en { font-size:14px; font-weight:600; color:#333; }
  .usage-en strong { color:#e67e22; }
  .usage-cn { font-size:12.5px; color:#777; margin-top:2px; }

  .three-col { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; font-size:13.5px; }
  .info-card { border-radius:12px; padding:16px 18px; }
  .info-card h5 { font-weight:700; margin-bottom:8px; font-size:14px; }
  .info-card p { margin-bottom:5px; line-height:1.5; }
  .info-card small { color:#777; font-size:12px; }

  .spectrum-wrap { background:linear-gradient(135deg,#fafaf8,#f8f6f2); border:1px solid #e8e8e4; border-radius:14px; padding:22px 26px; margin-bottom:24px; }
  .spectrum-wrap svg { width:100%; height:auto; display:block; border-radius:10px; }

  .flaky-bg { background:linear-gradient(135deg,#fff5f0,#fde8e0); }
  .slack-bg { background:linear-gradient(135deg,#f0f5ff,#e0e8f5); }
  .purple-bg { background:linear-gradient(135deg,#f5f0ff,#e8e0f5); }

  @media (max-width:720px) {
    .container { padding:24px 16px 32px; }
    .cards { grid-template-columns:1fr; }
    .compare-row { grid-template-columns:1fr; }
    .usage-list { grid-template-columns:1fr; }
    .three-col { grid-template-columns:1fr; }
    h1 { font-size:26px; }
  }
</style>
</head>
<body>
<div class="container">

<h1>{TITLE}</h1>
<p class="subtitle">{SUBTITLE}</p>

<!-- 核心卡片区 -->
<div class="section-title"><span class="bar"></span><span>核心意象对比</span></div>
<div class="cards">
  <!-- Card 1 SVG -->
  <div class="card">
    <svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- gradients, filters -->
      </defs>
      <rect width="760" height="400" fill="#fafaf8" rx="8"/>
      <!-- SVG content with animations -->
    </svg>
    <div class="card-body">
      <h3>WORD <span class="hl">/pronunciation/</span></h3>
      <div class="pos">part of speech · 中文释义</div>
      <div class="def">
        <strong>本义</strong> core meaning<br>
        <strong>引申</strong> extended meaning
        <span class="eg">"example sentence" 中文翻译</span>
      </div>
      <div class="white-box"><strong>💡 理解关键</strong>：物理画面 → 抽象推导</div>
    </div>
  </div>

  <!-- Card 2 SVG -->
  <div class="card">
    <svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <!-- contrast word SVG -->
    </svg>
    <div class="card-body">
      <h3>WORD2 <span class="hl">/pronunciation/</span></h3>
      <!-- ... -->
    </div>
  </div>
</div>

<!-- 逻辑演化树 -->
<div class="section-title"><span class="bar"></span><span>🧠 逻辑演化树</span></div>
<div class="logic-tree" style="background:#fffdf7; border:1px solid #e8e0d0; border-radius:12px; padding:20px 24px; margin-bottom:36px;">
  <div class="tree-title" style="font-size:16px; font-weight:700; margin-bottom:16px;">🧠 逻辑演化树</div>
  <div class="tree-grid" style="display:flex; flex-wrap:wrap; align-items:center; gap:8px;">
    <div class="tree-node" style="background:#fafaf8; border:1px solid #e0d8c8; border-radius:8px; padding:10px 14px; font-size:13px; font-weight:600; text-align:center; min-width:80px;">
      ① 物理义<br><span class="tree-desc" style="display:block; font-weight:400; font-size:11px; color:#888; margin-top:4px;">核心物理画面</span>
    </div>
    <div class="tree-arrow" style="font-size:18px; color:#e67e22; font-weight:700;">→</div>
    <div class="tree-node">② 引申义1<br><span class="tree-desc">...</span></div>
    ...
  </div>
</div>

<!-- 易混对比区 -->
<div class="section-title"><span class="bar"></span><span>易混对比</span></div>
<div class="compare-row">
  <!-- ... -->
</div>

<!-- 常见搭配区 -->
<div class="section-title"><span class="bar"></span><span>常见搭配</span></div>
<div class="usage-section">
  <h4>📖 类别标题</h4>
  <div class="usage-list">
    <div class="usage-item">
      <span class="usage-en"><strong>word</strong> collocation</span>
      <span class="usage-cn">中文翻译 &nbsp;|&nbsp; 📖 场景说明</span>
    </div>
    <!-- ... -->
  </div>
</div>

<!-- 反义/相似 -->
<div class="section-title"><span class="bar"></span><span>反义 / 相似词</span></div>
<div style="background:#fafaf8; border:1px solid #e8e8e4; border-radius:14px; padding:22px 26px; margin-bottom:20px;">
  <div class="three-col">
    <div class="info-card flaky-bg">
      <h5 style="color:#e67e22;">反义/对比</h5>
      <p><strong>WORD</strong> — 释义 <small>说明</small></p>
    </div>
    ...
  </div>
</div>

</body>
</html>
```

## 工作流程

1. **理解用户意图**：用户给出单词 → 判断是单次深挖还是批量对比
   - **批量生成模式**：用户给出多个单词时，默认每个单词**各出一个独立的 HTML 文件**（全量页面，含核心意象、逻辑演化树、常见搭配、反义/相似等完整结构）
   - **额外联动分析**：如果你判断其中有**意思相近**或**拼写长相相似**的词族（如 PUSH/SHOVE/THRUST、FLAKY/SLACK/LOOSE、FLIP/FLOP/SKIP），除了各自的独立文件外，**额外再生成一个合并对比 HTML**，把它们放在同一个页面中做对比分析。这个合并页聚焦"它们有什么区别"而不是"每个词怎么用"。
   - **判断标准**：两个词有多义词或短语等可以互相比较的内容时，做合并对比页；完全无关的单词（如 MAKE 和 FLIP）不做合并。
2. **设计核心画面**：想清楚这个单词最本质的物理/空间画面是什么
3. **设计动画**：如果是动态过程（位移、变化、循环），用 SVG `<animate>` 和 `<animateTransform>` 实现
4. **延伸逻辑链**：从核心画面推导出每个抽象用法，确保每一步有物理依据
5. **检查易混词**：有没有学习者容易混淆的同类词？必须加上对比
6. **检查口语高频用法**：该词在美语口语中最高频的搭配/短语是否已覆盖？特别是那些"字面义和实际义差别大"的搭配（如 swing by、cut someone some slack、pick up the slack 等），必须优先收录并用小白框解释从物理义到抽象义的演变
7. **编写 HTML**：使用上面的模板，填充内容 + SVG 绘图 + 动画
8. **自我检查**：
   - 是否使用了 SVG 而不是 Canvas？（永远不要用 `<canvas>`）
   - SVG `<animate>` 的 keyframe values 数量在不同元素间是否完全对齐？（不同步会导致动画错位）
   - 往返动画的正向+反向 keyframe 总数是否正确？（N阶段 → 2N 或 2N+1 个值）
   - 所有的 `dur` 值在共享动画中是否一致？
   - **单向到达类动画**（如驾车场景的 pull up/into/away）：是否用的是 `values="start;end" keyTimes="0;1"` 一次性到位，而不是往返滑动？（车子到达目的地后不应再滑回去）
   - **每个抽象用法/口语搭配是否都有小白框解释逻辑？**（不只在搭配列表里列出来，要用小白框说明"如何从物理画面演变到这个含义"）
   - **使用场景提示区的内容，是否已在常见搭配或小白框中解释过演变逻辑？**（不能只放在"提示"里就不管了）
   - **文字可读性检查**：SVG 中的说明文字是否使用了 `fill="#444"` 或 `fill="#666"`、字号不小于 13px？ 不要使用 `fill="#888"` 或 `fill="#999"` 作为正文文字——那是结构色，不是文字色。副标题 `color:#999` 改为 `color:#666`、`font-size:15px`。
   - **对比卡 SVG 文字检查**：易混对比区（compare-card）的 SVG 内部说明文字**同样需要不小于 13px**。不要为了把文字塞进对比图而缩小字号——如果空间不够，应该调整 layout（如加宽图、分两行、缩短文字），而不是缩小字号。
   - **小白框补充说明**：小白框中的提示/对比文字（你标注"注意"、"对比"、"反义"的那些），不要用 `color:#999`，用 `color:#666` 并加 `font-size:12.5px`，加 💡 前缀让用户容易注意到。
   - **动画语义检查**：动画的表现形式是否与文字描述匹配？例如"到达"场景应该是车辆移动到位后停住，而不是反复滑动。"驶离"场景应该是车辆从静止起步开走，而不是持续匀速运动。
   - **无重复/冲突检查**：同一个页面中是否有两张 SVG 展示了相同的概念或标注了相同的文字？
   - 易混词对比是否充分？
   - 页面打开后，所有 SVG 是否能正确渲染？
9. **输出文件**：告知用户文件路径，简要说明这个页面的设计思路

## 文件命名规范

- 单个词：`<word>_illustration.html`（全小写，空格用下划线）
- 批量对比：`<word1>_<word2>_<word3>_...html`
- 保存到用户指定的目录（通常是桌面上的介词图例文件夹）

## 重要提示

- 永远不要使用 `<canvas>` — 只使用 SVG 矢量图
- SVG viewBox 尺寸：卡片 `760 400`，对比图 `760 340`，宽幅场景 `1720 400`
- 所有 SVG 动画使用 `repeatCount="indefinite"` 实现无限循环
- 动画时长通常 3-6s（单循环），程度光谱 20s（完整往返）
- 元素 ID 必须唯一，命名规则：`card<Word>`, `vs<Word1><Word2>`, `scene<Name>`
- 代码不要用 ES6 以上的新特性，保证浏览器兼容性
- 所有中文内容使用简体中文
- 如果用户提供的单词不在词汇参考列表中，也没关系——你仍然可以基于对这个单词的理解来生成图解
- **生成的 HTML 文件必须直接可用**：用户双击即可在浏览器中打开查看
