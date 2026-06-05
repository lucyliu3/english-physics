// MVP 词库数据
// 数据结构：{ word: { leap, subtitle, svg, logic, logicTree?, spectrum?, compareCards?, phrases[], compare[], references? } }

const WORD_DATA = {
  "rub off on": {
    leap: "擦掉 → 沾染",
    svg: `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e63946"/>
          <stop offset="100%" stop-color="#c1121f"/>
        </linearGradient>
        <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff"/>
          <stop offset="100%" stop-color="#f8f4f0"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.10"/>
        </filter>
      </defs>
      <rect width="760" height="400" fill="#fafaf8" rx="8"/>
      <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">RUB OFF ON</text>
      <rect x="80" y="160" width="180" height="130" rx="6" fill="url(#redGrad)" filter="url(#shadow)"/>
      <text x="170" y="210" text-anchor="middle" fill="#fff" font-size="14" font-weight="600" font-family="sans-serif">红布</text>
      <text x="170" y="230" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="12" font-family="sans-serif">颜料附着</text>
      <g filter="url(#shadow)">
        <circle cx="210" cy="210" r="9" fill="#e63946">
          <animate attributeName="cx" values="210;270;320" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="210;270;300" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="r" values="9;7;5" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="230" cy="195" r="6" fill="#e63946" opacity="0.9">
          <animate attributeName="cx" values="230;300;350" dur="3s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="195;260;290" dur="3s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="r" values="6;4;3" dur="3s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="195" cy="230" r="7" fill="#c1121f" opacity="0.8">
          <animate attributeName="cx" values="195;260;330" dur="3s" begin="0.8s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="230;280;310" dur="3s" begin="0.8s" repeatCount="indefinite"/>
          <animate attributeName="r" values="7;5;4" dur="3s" begin="0.8s" repeatCount="indefinite"/>
        </circle>
      </g>
      <rect x="490" y="160" width="180" height="130" rx="6" fill="url(#whiteGrad)" filter="url(#shadow)"/>
      <text x="580" y="210" text-anchor="middle" fill="#bbb" font-size="14" font-weight="600" font-family="sans-serif">白布</text>
      <g>
        <animate attributeName="opacity" values="0;0;0;0;0;1;1" dur="3s" repeatCount="indefinite"/>
        <rect x="490" y="160" width="180" height="130" rx="6" fill="#e63946" opacity="0.4" filter="url(#shadow)"/>
        <text x="580" y="230" text-anchor="middle" fill="#e63946" font-size="12" font-weight="600" font-family="sans-serif">被染红 ✨</text>
      </g>
      <text x="390" y="195" text-anchor="middle" fill="#e67e22" font-size="28" font-weight="700">→</text>
      <text x="390" y="225" text-anchor="middle" fill="#e67e22" font-size="12" font-weight="600" font-family="sans-serif">颜料转移</text>
      <line x1="60" y1="340" x2="700" y2="340" stroke="#e8e0d0" stroke-width="1" stroke-dasharray="4,4"/>
      <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">摩擦（rub）→ 脱离（off）→ 附着（on）</text>
    </svg>`,
    logic: `<strong>💡 核心逻辑</strong><br>
    物理画面：<strong>rub</strong>（摩擦）+ <strong>off</strong>（脱离）+ <strong>on</strong>（接触/附着）<br>
    = 颜料从红布上摩擦脱落，<strong>蹭到</strong>白布上，把白布染红。<br><br>
    → 引申为：<strong>某种特质（情绪、习惯、性格）像颜料一样"沾染"到另一个人身上。</strong>`,
    phrases: [
      { en: '<strong>rub off on</strong> someone', cn: '（某种特质）沾染/影响某人', eg: '"His positivity really rubbed off on me." 他的积极向上感染了我。' },
      { en: '<strong>rub it in</strong>', cn: '反复提别人的痛处 / 伤口撒盐', eg: '"I know I made a mistake. Don\'t rub it in." 我知道我错了，别再说了。' },
      { en: '<strong>rub along</strong>', cn: '勉强相处 / 凑合过日子', eg: '"We don\'t really get along, but we rub along." 我们不算合得来，但还能凑合。' },
      { en: '<strong>rub someone the wrong way</strong>', cn: '惹恼某人 / 让人不舒服', eg: '"Something about him rubs me the wrong way." 他有些地方让我很不舒服。' },
    ],
    compare: [
      { word: 'rub', desc: '摩擦表面' },
      { word: 'scrub', desc: '用力刷洗' },
      { word: 'wipe', desc: '擦拭表面' },
      { word: 'scrape', desc: '刮掉表层' },
    ]
  },
  "snap": {
    leap: "极限断裂 → 崩溃/折断/咬合",
    svg: `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadowS"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.10"/></filter>
        <linearGradient id="rubberGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#e67e22"/>
          <stop offset="100%" stop-color="#e63946"/>
        </linearGradient>
      </defs>
      <rect width="760" height="400" fill="#fafaf8" rx="8"/>
      <text x="380" y="40" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">SNAP</text>
      <path d="M80,200 Q160,240 280,200" fill="none" stroke="#e67e22" stroke-width="8" stroke-linecap="round" filter="url(#shadowS)">
        <animate attributeName="d"
          values="M80,200 Q160,240 280,200;M80,200 Q160,100 280,200;M80,200 Q160,60 280,200;M80,200 Q160,80 280,200;M80,200 Q160,260 280,200;M80,200 Q160,240 280,200"
          dur="5s" repeatCount="indefinite"/>
      </path>
      <circle cx="80" cy="200" r="8" fill="#666"/>
      <circle cx="280" cy="200" r="8" fill="#666"/>
      <g>
        <animate attributeName="opacity" values="0;0;0;0;1;0" dur="5s" repeatCount="indefinite"/>
        <path d="M80,200 Q130,140 170,170" fill="none" stroke="#e63946" stroke-width="6" stroke-linecap="round"/>
        <path d="M280,200 Q230,260 190,230" fill="none" stroke="#e63946" stroke-width="6" stroke-linecap="round"/>
        <circle cx="175" cy="185" r="3" fill="#e63946"><animateTransform type="translate" values="0,0;-15,-10" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/></circle>
        <rect x="185" y="195" width="5" height="3" fill="#e67e22" transform="rotate(30,187,196)"><animateTransform type="translate" values="0,0;10,-15" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite"/></rect>
        <text x="180" y="120" text-anchor="middle" fill="#e63946" font-size="22" font-weight="900" font-family="sans-serif">💥 SNAP!</text>
      </g>
      <text x="380" y="340" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">拉到极限 → 断裂 → 崩溃</text>
    </svg>`,
    logic: `<strong>💡 核心逻辑</strong><br>
    物理画面：橡皮筋被拉到极限 → <strong>啪的一声断掉</strong>。<br><br>
    → 引申为：<br>
    &nbsp;&nbsp;① <strong>精神崩溃</strong>（人绷不住了）<br>
    &nbsp;&nbsp;② <strong>突然折断</strong>（实物断裂）<br>
    &nbsp;&nbsp;③ <strong>快速决定</strong>（snap decision = 瞬间决定）`,
    // 核心意象对比卡片（2张）
    cards: [
      {
        svg: `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="snapBg" x1="0" y1="0" x2="0" y2="400">
          <stop offset="0%" stop-color="#fef7f0"/>
          <stop offset="100%" stop-color="#fdf0e5"/>
        </linearGradient>
        <filter id="shadowSnap">
          <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="760" height="400" fill="url(#snapBg)" rx="8"/>
      <rect x="100" y="100" width="320" height="16" rx="8" fill="#8B4513" transform="rotate(-15,260,108)"/>
      <line x1="120" y1="100" x2="120" y2="116" stroke="#6B3410" stroke-width="1" transform="rotate(-15,260,108)"/>
      <line x1="180" y1="97" x2="180" y2="113" stroke="#6B3410" stroke-width="1" transform="rotate(-15,260,108)"/>
      <line x1="240" y1="94" x2="240" y2="110" stroke="#6B3410" stroke-width="1" transform="rotate(-15,260,108)"/>
      <path d="M280,85 L285,115" stroke="#e63946" stroke-width="2.5" stroke-linecap="round" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" dur="3s" repeatCount="indefinite" keyTimes="0;0.2;0.25;0.45;0.5"/>
      </path>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;0;0" dur="3s" repeatCount="indefinite" keyTimes="0;0.2;0.25;0.5;0.55"/>
        <rect x="275" y="90" width="10" height="6" rx="2" fill="#8B4513">
          <animateTransform attributeName="transform" type="translate" values="0,0; -30,-40; -60,-50" dur="3s" repeatCount="indefinite" keyTimes="0;0.25;0.5"/>
          <animate attributeName="opacity" values="1;0.6;0" dur="3s" repeatCount="indefinite" keyTimes="0.25;0.4;0.5"/>
        </rect>
        <rect x="280" y="105" width="8" height="5" rx="2" fill="#A0522D">
          <animateTransform attributeName="transform" type="translate" values="0,0; 20,-50; 40,-60" dur="3s" repeatCount="indefinite" keyTimes="0;0.25;0.5"/>
          <animate attributeName="opacity" values="1;0.6;0" dur="3s" repeatCount="indefinite" keyTimes="0.25;0.4;0.5"/>
        </rect>
        <rect x="282" y="98" width="6" height="4" rx="1" fill="#6B3410">
          <animateTransform attributeName="transform" type="translate" values="0,0; -10,-60; -20,-80" dur="3s" repeatCount="indefinite" keyTimes="0;0.25;0.5"/>
          <animate attributeName="opacity" values="1;0.5;0" dur="3s" repeatCount="indefinite" keyTimes="0.25;0.4;0.5"/>
        </rect>
      </g>
      <g>
        <rect x="400" y="120" width="120" height="14" rx="7" fill="#8B4513" transform="rotate(-15,460,127)">
          <animateTransform attributeName="transform" type="rotate" values="-15,460,127; 10,460,200; -5,460,280" dur="3s" repeatCount="indefinite" keyTimes="0;0.3;0.6"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,80; 0,160" dur="3s" repeatCount="indefinite" keyTimes="0;0.3;0.6" additive="sum"/>
        </rect>
        <ellipse cx="480" cy="115" rx="18" ry="8" fill="#38a169" transform="rotate(-25,480,115)">
          <animateTransform attributeName="transform" type="rotate" values="-25,480,115; 20,480,200; -10,480,280" dur="3s" repeatCount="indefinite" keyTimes="0;0.3;0.6"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,80; 0,160" dur="3s" repeatCount="indefinite" keyTimes="0;0.3;0.6" additive="sum"/>
        </ellipse>
      </g>
      <text x="350" y="60" text-anchor="middle" fill="#e63946" font-size="22" font-weight="900" font-family="sans-serif" opacity="0">
        <animate attributeName="opacity" values="0;0;1;0.3;0" dur="3s" repeatCount="indefinite" keyTimes="0;0.2;0.25;0.35;0.5"/>
        SNAP!
      </text>
      <path d="M300,70 Q350,40 400,70" fill="none" stroke="#e63946" stroke-width="2" opacity="0">
        <animate attributeName="opacity" values="0;0;1;0;0" dur="3s" repeatCount="indefinite" keyTimes="0;0.2;0.25;0.4;0.5"/>
        <animate attributeName="d" values="M300,70 Q350,40 400,70;M290,60 Q350,25 410,60;M300,70 Q350,40 400,70" dur="3s" repeatCount="indefinite" keyTimes="0;0.25;0.5"/>
      </path>
      <path d="M310,50 Q350,10 390,50" fill="none" stroke="#e63946" stroke-width="1.5" opacity="0">
        <animate attributeName="opacity" values="0;0;0.6;0;0" dur="3s" repeatCount="indefinite" keyTimes="0;0.22;0.27;0.4;0.5"/>
      </path>
      <rect x="0" y="330" width="760" height="10" fill="#c8b89a" rx="2"/>
      <rect x="0" y="340" width="760" height="60" fill="#e8e0d0"/>
      <rect x="80" y="150" width="40" height="180" fill="#8B4513" rx="4"/>
      <text x="260" y="370" text-anchor="middle" fill="#e63946" font-size="14" font-weight="bold" font-family="sans-serif">SNAP = 突然断裂 + 清脆声响</text>
    </svg>`,
        title: 'SNAP /snæp/',
        subtitle: 'V · N · ADJ · 突然断裂/咬合/爆发',
        body: `<strong>本义</strong> 一根细长物体在受力超过极限时突然断裂，并伴随清脆的"啪"声<br>
        <strong>核心意象</strong> 蓄积的张力在临界点瞬间释放 → 一个突然的、不可逆的变化<br>
        <strong>引申主线</strong> 物理断裂 → 精神崩溃 → 快速咬合 → 快速判断 → 瞬间拍摄`,
        whiteBox: '<strong>💡 理解 SNAP 的关键</strong>：SNAP 的三要素 = ① 张力蓄积（承受压力）→ ② 临界点（撑不住了）→ ③ 瞬间爆发（断裂/咬合/情绪爆发）。这三个要素是所有 SNAP 含义的底层结构——不管是树枝断掉、情绪爆发、狗狗咬合、还是快速拍照，都在共享这个"蓄积→临界→释放"的节奏。'
      },
      {
        svg: `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vsSnapBg" x1="0" y1="0" x2="760" y2="0">
          <stop offset="0%" stop-color="#fef7f0"/>
          <stop offset="50%" stop-color="#fafaf8"/>
          <stop offset="100%" stop-color="#f0f5ff"/>
        </linearGradient>
      </defs>
      <rect width="760" height="400" fill="url(#vsSnapBg)" rx="8"/>
      <text x="380" y="40" text-anchor="middle" fill="#333" font-size="16" font-weight="700" font-family="sans-serif">SNAP vs BREAK — 都是"断"，区别在哪？</text>
      <text x="140" y="75" text-anchor="middle" fill="#e63946" font-size="18" font-weight="800" font-family="sans-serif">SNAP</text>
      <rect x="80" y="250" width="15" height="80" fill="#8B4513" rx="3"/>
      <rect x="60" y="245" width="140" height="12" rx="6" fill="#8B4513"/>
      <path d="M180,240 L185,260" stroke="#e63946" stroke-width="2.5"/>
      <g>
        <rect x="190" y="247" width="60" height="10" rx="5" fill="#A0522D">
          <animateTransform attributeName="transform" type="translate" values="0,0; 20,50" dur="3s" repeatCount="indefinite" keyTimes="0;0.3"/>
        </rect>
      </g>
      <text x="155" y="225" text-anchor="middle" fill="#e63946" font-size="14" font-weight="bold" font-family="sans-serif">SNAP!</text>
      <text x="140" y="380" text-anchor="middle" fill="#666" font-size="11" font-family="sans-serif">"The twig snapped."</text>
      <text x="140" y="396" text-anchor="middle" fill="#444" font-size="11" font-weight="bold" font-family="sans-serif">+ 清脆响声 | + 突然 | + 细长物体</text>
      <circle cx="380" cy="200" r="22" fill="#e8e0d0"/>
      <text x="380" y="206" text-anchor="middle" fill="#888" font-size="14" font-weight="bold" font-family="sans-serif">VS</text>
      <text x="620" y="75" text-anchor="middle" fill="#3498db" font-size="18" font-weight="800" font-family="sans-serif">BREAK</text>
      <path d="M570,250 L590,250 L585,310 L575,310 Z" fill="#3498db" opacity="0.3"/>
      <path d="M580,250 L578,280 L582,290 L577,310" stroke="#3498db" stroke-width="1.5"/>
      <path d="M570,270 L574,275" stroke="#3498db" stroke-width="1.5"/>
      <path d="M585,260 L588,265" stroke="#3498db" stroke-width="1.5"/>
      <rect x="555" y="300" width="8" height="6" rx="1" fill="#3498db" opacity="0.5"/>
      <rect x="598" y="295" width="6" height="7" rx="1" fill="#3498db" opacity="0.5"/>
      <rect x="563" y="310" width="5" height="4" rx="1" fill="#3498db" opacity="0.4"/>
      <text x="620" y="380" text-anchor="middle" fill="#666" font-size="11" font-family="sans-serif">"The cup broke."</text>
      <text x="620" y="396" text-anchor="middle" fill="#444" font-size="11" font-weight="bold" font-family="sans-serif">± 声音 | ± 突然 | ± 细长物体</text>
    </svg>`,
        title: 'SNAP vs BREAK /snæp/ /breɪk/',
        subtitle: '近义词辨析 · 都是"断"',
        body: `<strong>SNAP</strong> = 细长物体突然断裂 + 必有响亮声音（啪/咔嚓）<br>
        <strong>BREAK</strong> = 泛泛的"打碎/弄坏"，可以无声可以有声，涉及的物体不一定是细长的`,
        whiteBox: '<strong>💡 核心区别</strong>：SNAP 特指"细长物体在绷紧状态下突然断裂 + 声音"。BREAK 可以指任何物体以任何方式的破坏。一根树枝可以 snap 也可以 break（snap 强调突然+声音，break 只是描述结果）。一个杯子只能 break，不能 snap（不细长，不弹响）。'
      }
    ],
    // 逻辑演化树
    logicTree: {
      insight: '所有含义共享同一个底层意象——"某物在一个绷紧状态达到临界点后瞬间发生改变"。这个"瞬间"和"不可逆"的特征让 SNAP 适合描述一切"快而清脆"的动作：狗突然咬合（嘴巴闭合是"咬合"）、相机快门（机械咬合）、情绪崩溃（理智的弦断了）、快速判断（不假思索就"咬住"了一个结论）。',
      branches: [
        { label: '① 断裂', color: '#e63946', usage: '树枝/绳子/骨头断裂', note: '物理断裂 + 啪声' },
        { label: '② 情绪爆发', color: '#c0392b', usage: 'snap at / snap (go crazy)', note: '像断裂一样突然失去控制' },
        { label: '③ 咬合', color: '#e67e22', usage: '狗 snap 咬/扣子 snap 扣上', note: '上下快速合拢 + 声响' },
        { label: '④ 快速动作', color: '#38a169', usage: 'snap a photo / snap decision', note: '像咬合一样的快速抓取' },
        { label: '⑤ 断开/中断联系', color: '#7b4ad9', usage: 'snap out of it / snap ties', note: '像断裂一样突然断开' },
      ]
    },
    // 程度光谱 SVG
    spectrum: `<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="snapSpectrum" x1="0" y1="0" x2="760" y2="0">
        <stop offset="0%" stop-color="#38a169"/>
        <stop offset="25%" stop-color="#7cb342"/>
        <stop offset="50%" stop-color="#f1c40f"/>
        <stop offset="75%" stop-color="#e67e22"/>
        <stop offset="100%" stop-color="#e63946"/>
      </linearGradient>
      <filter id="ballGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#e63946" flood-opacity="0.3"/>
      </filter>
      <linearGradient id="ballGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f5a0a0"/>
        <stop offset="100%" stop-color="#e63946"/>
      </linearGradient>
      <filter id="shadowPerson">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.12"/>
      </filter>
    </defs>
    <rect width="760" height="380" fill="#fafaf8" rx="8"/>
    <rect x="0" y="330" width="760" height="50" fill="#e8e0d0"/>
    <line x1="0" y1="330" x2="760" y2="330" stroke="#c8b89a" stroke-width="2"/>
    <text x="380" y="28" text-anchor="middle" fill="#666" font-size="13" font-weight="bold" font-family="sans-serif">压力球滚过来，越滚越大...</text>
    <rect x="50" y="295" width="661" height="6" fill="url(#snapSpectrum)" rx="3" opacity="0.45"/>
    <text x="40" y="303" text-anchor="end" fill="#999" font-size="10" font-family="sans-serif">压力</text>
    <g filter="url(#ballGlow)">
      <circle r="10" fill="url(#ballGrad)">
        <animate attributeName="cx" values="-40;-40;70;180;290;400;510;520;520;520" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="280;280;265;250;235;220;210;210;380;380" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
        <animate attributeName="r" values="10;10;18;26;34;42;52;52;52;52" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
      </circle>
    </g>
    <text text-anchor="middle" fill="#fff" font-weight="bold" font-family="sans-serif">
      <animate attributeName="x" values="-40;-40;70;180;290;400;510;520;520;520" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
      <animate attributeName="y" values="284;284;269;254;239;224;214;214;214;214" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
      <animate attributeName="font-size" values="8;8;11;14;17;20;24;24;24;24" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0;1;1;1;1;1;0;0;0" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.55;0.6;1" dur="28s" repeatCount="indefinite"/>
      ✕
    </text>
    <ellipse fill="#000" opacity="0.08">
      <animate attributeName="cx" values="-40;-40;70;180;290;400;510;520;520;520" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="330;330;330;330;330;330;330;330;330;330" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
      <animate attributeName="rx" values="10;10;18;26;34;42;52;52;52;52" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
      <animate attributeName="ry" values="3;3;4;6;8;10;12;12;12;12" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.6;1" dur="28s" repeatCount="indefinite"/>
    </ellipse>
    <g>
      <rect x="440" y="330" width="160" height="4" fill="#c8b89a" rx="2" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0.7;0;0" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.57;0.62;1" dur="28s" repeatCount="indefinite"/>
      </rect>
    </g>
    <g>
      <circle cx="80" cy="300" r="14" fill="#f5e6d0" filter="url(#shadowPerson)"/>
      <circle cx="76" cy="297" r="2" fill="#333"/>
      <circle cx="84" cy="297" r="2" fill="#333"/>
      <path d="M77,305 Q80,309 83,305" fill="none" stroke="#333" stroke-width="1.5"/>
      <line x1="80" y1="314" x2="80" y2="330" stroke="#333" stroke-width="2"/>
      <line x1="80" y1="318" x2="65" y2="330" stroke="#333" stroke-width="1.5"/>
      <line x1="80" y1="318" x2="95" y2="330" stroke="#333" stroke-width="1.5"/>
      <text x="80" y="360" text-anchor="middle" fill="#38a169" font-size="11" font-weight="bold" font-family="sans-serif">RELAXED</text>
    </g>
    <g>
      <circle cx="190" cy="300" r="14" fill="#f5e6d0" filter="url(#shadowPerson)"/>
      <circle cx="186" cy="297" r="2" fill="#333"/>
      <circle cx="194" cy="297" r="2" fill="#333"/>
      <path d="M187,308 Q190,305 193,308" fill="none" stroke="#333" stroke-width="1.5"/>
      <line x1="190" y1="314" x2="190" y2="330" stroke="#333" stroke-width="2"/>
      <line x1="190" y1="318" x2="178" y2="330" stroke="#333" stroke-width="1.5"/>
      <line x1="190" y1="318" x2="198" y2="325" stroke="#333" stroke-width="1.5"/>
      <text x="190" y="360" text-anchor="middle" fill="#7cb342" font-size="11" font-weight="bold" font-family="sans-serif">ANNOYED</text>
    </g>
    <g>
      <circle cx="300" cy="300" r="14" fill="#f5e6d0" filter="url(#shadowPerson)"/>
      <circle cx="296" cy="297" r="2" fill="#333"/>
      <circle cx="304" cy="297" r="2" fill="#333"/>
      <line x1="292" y1="292" x2="297" y2="294" stroke="#333" stroke-width="1.5"/>
      <line x1="308" y1="292" x2="303" y2="294" stroke="#333" stroke-width="1.5"/>
      <line x1="297" y1="308" x2="303" y2="308" stroke="#333" stroke-width="1.5"/>
      <line x1="300" y1="314" x2="300" y2="330" stroke="#333" stroke-width="2"/>
      <line x1="300" y1="318" x2="285" y2="330" stroke="#333" stroke-width="1.5"/>
      <line x1="300" y1="318" x2="315" y2="330" stroke="#333" stroke-width="1.5"/>
      <path d="M288,296 Q289,292 290,296" fill="#3498db" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <text x="300" y="360" text-anchor="middle" fill="#d4a017" font-size="11" font-weight="bold" font-family="sans-serif">STRESSED</text>
    </g>
    <g>
      <circle cx="410" cy="300" r="14" fill="#f5e6d0" filter="url(#shadowPerson)"/>
      <circle cx="406" cy="297" r="2.5" fill="#333">
        <animate attributeName="r" values="2.5;3;2.5" dur="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="414" cy="297" r="2.5" fill="#333">
        <animate attributeName="r" values="2.5;3;2.5" dur="0.5s" repeatCount="indefinite"/>
      </circle>
      <ellipse cx="410" cy="306" rx="4" ry="3" fill="#333"/>
      <line x1="410" y1="314" x2="410" y2="330" stroke="#333" stroke-width="2.5"/>
      <line x1="410" y1="318" x2="396" y2="330" stroke="#333" stroke-width="2"/>
      <line x1="410" y1="318" x2="424" y2="330" stroke="#333" stroke-width="2"/>
      <path d="M378,280 Q381,276 384,280" fill="none" stroke="#e67e22" stroke-width="1">
        <animate attributeName="stroke" values="#e67e22;#c0392b;#e67e22" dur="0.3s" repeatCount="indefinite"/>
      </path>
      <path d="M436,280 Q439,276 442,280" fill="none" stroke="#e67e22" stroke-width="1">
        <animate attributeName="stroke" values="#c0392b;#e67e22;#c0392b" dur="0.3s" repeatCount="indefinite"/>
      </path>
      <text x="410" y="360" text-anchor="middle" fill="#e67e22" font-size="11" font-weight="bold" font-family="sans-serif">ON EDGE</text>
    </g>
    <g>
      <animate attributeName="opacity" values="1;1;1;1;1;1;1;0;0;0" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.55;0.6;1" dur="28s" repeatCount="indefinite"/>
      <circle cx="520" cy="300" r="14" fill="#f5e6d0" filter="url(#shadowPerson)"/>
      <circle cx="516" cy="297" r="3" fill="#333"/>
      <circle cx="524" cy="297" r="3" fill="#333"/>
      <ellipse cx="520" cy="306" rx="4" ry="3" fill="#333"/>
      <line x1="520" y1="314" x2="520" y2="330" stroke="#333" stroke-width="2.5"/>
      <line x1="520" y1="318" x2="506" y2="330" stroke="#333" stroke-width="2"/>
      <line x1="520" y1="318" x2="534" y2="330" stroke="#333" stroke-width="2"/>
    </g>
    <g>
      <animate attributeName="opacity" values="0;0;0;0;0;0;0;1;1;1" keyTimes="0;0.02;0.12;0.22;0.32;0.42;0.53;0.55;0.6;1" dur="28s" repeatCount="indefinite"/>
      <ellipse cx="520" cy="332" rx="28" ry="10" fill="#f5e6d0"/>
      <circle cx="510" cy="333" r="2" fill="#333"/>
      <circle cx="520" cy="333" r="2" fill="#333"/>
      <path d="M515,337 Q518,333 521,337" fill="none" stroke="#333" stroke-width="1"/>
      <line x1="492" y1="332" x2="476" y2="324" stroke="#333" stroke-width="2"/>
      <line x1="548" y1="332" x2="564" y2="324" stroke="#333" stroke-width="2"/>
      <line x1="500" y1="335" x2="492" y2="342" stroke="#333" stroke-width="2"/>
      <line x1="540" y1="335" x2="548" y2="342" stroke="#333" stroke-width="2"/>
      <text x="530" y="310" text-anchor="middle" fill="#e63946" font-size="22" font-weight="900" font-family="sans-serif">💥 SNAP!</text>
      <circle cx="490" cy="295" r="2.5" fill="#f1c40f">
        <animateTransform attributeName="transform" type="translate" values="0,0; -20,-25" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="560" cy="295" r="2.5" fill="#f1c40f">
        <animateTransform attributeName="transform" type="translate" values="0,0; 20,-25" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="530" cy="280" r="2" fill="#e63946">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-35" dur="1.5s" repeatCount="indefinite" begin="0.2s"/>
        <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" begin="0.2s"/>
      </circle>
      <rect x="500" y="326" width="6" height="4" rx="1" fill="#888" opacity="0.7">
        <animateTransform attributeName="transform" type="translate" values="0,0; -25,12" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite"/>
      </rect>
      <rect x="545" y="330" width="5" height="3" rx="1" fill="#888" opacity="0.6">
        <animateTransform attributeName="transform" type="translate" values="0,0; 20,10" dur="2s" repeatCount="indefinite" begin="0.4s"/>
        <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" begin="0.4s"/>
      </rect>
      <text x="520" y="375" text-anchor="middle" fill="#e63946" font-size="11" font-weight="bold" font-family="sans-serif">被压力球砸扁！</text>
    </g>
    </svg>`,
    spectrumNote: 'RELAXED（放松）→ ANNOYED（烦躁）→ STRESSED（焦虑）→ ON EDGE（濒临极限）→ SNAP!（被砸扁！）。压力球象征着不断积累的压力——一开始很小，慢慢变大，最终超过承受极限把人砸垮。',
    // 扩展对比卡片（带SVG的深度对比）
    compareCards: [
      {
        svg: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="760" height="300" fill="#fafaf8" rx="8"/>
      <text x="140" y="45" text-anchor="middle" fill="#e63946" font-size="16" font-weight="800" font-family="sans-serif">SNAP</text>
      <text x="380" y="45" text-anchor="middle" fill="#888" font-size="14" font-weight="bold" font-family="sans-serif">VS</text>
      <text x="620" y="45" text-anchor="middle" fill="#8B4513" font-size="16" font-weight="800" font-family="sans-serif">CRACK</text>
      <rect x="100" y="200" width="12" height="70" fill="#8B4513" rx="3"/>
      <rect x="90" y="195" width="100" height="10" rx="5" fill="#8B4513"/>
      <path d="M170,190 L175,210" stroke="#e63946" stroke-width="2"/>
      <text x="140" y="180" text-anchor="middle" fill="#e63946" font-size="14" font-weight="bold" font-family="sans-serif">SNAP!</text>
      <text x="140" y="286" text-anchor="middle" fill="#666" font-size="13" font-family="sans-serif">完全断裂成两段</text>
      <rect x="560" y="150" width="70" height="80" rx="6" fill="#ddd" stroke="#bbb" stroke-width="1"/>
      <path d="M570,155 L575,190 L568,210" stroke="#8B4513" stroke-width="2" fill="none"/>
      <path d="M575,190 L582,205" stroke="#8B4513" stroke-width="1.5" fill="none"/>
      <text x="595" y="135" text-anchor="middle" fill="#8B4513" font-size="14" font-weight="bold" font-family="sans-serif">CRACK!</text>
      <text x="595" y="286" text-anchor="middle" fill="#666" font-size="13" font-family="sans-serif">表面裂了但还没断</text>
      <line x1="380" y1="60" x2="380" y2="270" stroke="#ddd" stroke-width="1" stroke-dasharray="3,3"/>
    </svg>`,
        title: 'SNAP vs CRACK',
        desc: 'SNAP = 完全断开成两截 + 啪声 | CRACK = 表面出现裂缝 + 咔嚓声',
        note: '<strong>💡 SNAP 是穿透性断裂</strong>：树枝 snap = 整根断成两段。CRACK 是表面裂开但整体可能还有连接（a cracked egg 鸡蛋裂了但没流出来；crack in the wall 墙上裂缝但没塌）。SNAP 是更彻底的不可逆变化。'
      },
      {
        svg: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="760" height="300" fill="#fafaf8" rx="8"/>
      <text x="140" y="45" text-anchor="middle" fill="#e63946" font-size="16" font-weight="800" font-family="sans-serif">SNAP</text>
      <text x="380" y="45" text-anchor="middle" fill="#888" font-size="14" font-weight="bold" font-family="sans-serif">VS</text>
      <text x="620" y="45" text-anchor="middle" fill="#e67e22" font-size="16" font-weight="800" font-family="sans-serif">BITE</text>
      <circle cx="140" cy="130" r="28" fill="#f5e6d0"/>
      <path d="M155,135 L180,120 M155,145 L180,160" stroke="#333" stroke-width="2.5" stroke-linecap="round">
        <animate attributeName="d"
          values="M155,135 L180,120 M155,145 L180,160;M155,140 L175,142 M155,145 L175,140;M155,135 L180,120 M155,145 L180,160"
          dur="2s" repeatCount="indefinite" keyTimes="0;0.15;0.3"/>
      </path>
      <text x="140" y="190" text-anchor="middle" fill="#e63946" font-size="14" font-weight="bold" font-family="sans-serif">SNAP</text>
      <text x="140" y="280" text-anchor="middle" fill="#666" font-size="12" font-family="sans-serif">快速咬合+缩回</text>
      <text x="140" y="296" text-anchor="middle" fill="#888" font-size="12" font-family="sans-serif">"The dog snapped at me."</text>
      <circle cx="620" cy="130" r="28" fill="#f5e6d0"/>
      <path d="M635,135 L660,130 M635,145 L660,150" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
      <text x="620" y="190" text-anchor="middle" fill="#e67e22" font-size="14" font-weight="bold" font-family="sans-serif">BITE</text>
      <text x="620" y="280" text-anchor="middle" fill="#666" font-size="12" font-family="sans-serif">咬住不松口</text>
      <text x="620" y="296" text-anchor="middle" fill="#888" font-size="12" font-family="sans-serif">"The dog bit my leg."</text>
      <line x1="380" y1="60" x2="380" y2="270" stroke="#ddd" stroke-width="1" stroke-dasharray="3,3"/>
    </svg>`,
        title: 'SNAP at vs BITE',
        desc: 'SNAP at = 快速咬一口就缩回（可能是虚张声势）| BITE = 咬住不放',
        note: '<strong>💡 snap at 的快速特征</strong>：狗 snap at someone 通常是一下子咬过去但没咬住太多——像"啪"一样快速开合。BITE 是咬住、咬进去了。所以用在人身上，"snap at someone" = 突然对某人说一句难听的话（快速回击），而"bite someone\'s head off" = 严厉训斥。SNAP 永远带着那个"快速+瞬间"的特性。'
      },
      {
        svg: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="760" height="300" fill="#fafaf8" rx="8"/>
      <text x="380" y="35" text-anchor="middle" fill="#333" font-size="15" font-weight="700" font-family="sans-serif">"SNAP a photo" vs "TAKE a photo"</text>
      <rect x="60" y="70" width="100" height="70" rx="8" fill="#2c3e50"/>
      <circle cx="110" cy="105" r="20" fill="#333"/>
      <circle cx="110" cy="105" r="14" fill="#555"/>
      <circle cx="110" cy="105" r="8" fill="#3498db"/>
      <circle cx="140" cy="80" r="8" fill="#f1c40f" opacity="0">
        <animate attributeName="r" values="8;30;8" dur="2s" repeatCount="indefinite" keyTimes="0;0.1;0.2"/>
        <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" keyTimes="0;0.1;0.2"/>
      </circle>
      <rect x="155" y="90" width="40" height="30" rx="3" fill="#e63946" opacity="0.3">
        <animate attributeName="width" values="40;20;40" dur="2s" repeatCount="indefinite" keyTimes="0;0.1;0.2"/>
        <animate attributeName="x" values="155;175;155" dur="2s" repeatCount="indefinite" keyTimes="0;0.1;0.2"/>
      </rect>
      <text x="110" y="175" text-anchor="middle" fill="#e63946" font-size="14" font-weight="bold" font-family="sans-serif">SNAP</text>
      <text x="110" y="192" text-anchor="middle" fill="#666" font-size="13" font-family="sans-serif">快速抓拍（像咬合一样）</text>
      <text x="300" y="120" text-anchor="middle" fill="#888" font-size="14" font-weight="bold" font-family="sans-serif">VS</text>
      <rect x="410" y="70" width="100" height="70" rx="8" fill="#555"/>
      <circle cx="460" cy="105" r="20" fill="#666"/>
      <circle cx="460" cy="105" r="14" fill="#888"/>
      <circle cx="460" cy="105" r="8" fill="#38a169"/>
      <text x="460" y="175" text-anchor="middle" fill="#38a169" font-size="14" font-weight="bold" font-family="sans-serif">TAKE</text>
      <text x="460" y="192" text-anchor="middle" fill="#666" font-size="13" font-family="sans-serif">常规拍照（不强调速度）</text>
      <line x1="50" y1="215" x2="710" y2="215" stroke="#eee" stroke-width="1"/>
      <text x="380" y="243" text-anchor="middle" fill="#444" font-size="14" font-family="sans-serif">📖 "Snap a photo" 的来源：相机快门的机械结构</text>
      <text x="380" y="263" text-anchor="middle" fill="#888" font-size="13" font-family="sans-serif">就像嘴巴 suddenly 咬合 → 快门 blades 快速闭合 → "咔嚓"一声</text>
      <text x="380" y="283" text-anchor="middle" fill="#888" font-size="13" font-family="sans-serif">所以 snap a photo = 快速抓拍（尤其是抓拍瞬间）| take a photo = 普通的拍照</text>
    </svg>`,
        title: 'SNAP a photo vs TAKE a photo',
        desc: 'SNAP = 快速抓拍（强调瞬间）| TAKE = 普通的拍照',
        note: '<strong>💡 snap a photo 的物理来源</strong>：老式相机的快门由两个金属片组成，按下快门时金属片快速咬合（像嘴巴闭上一样），发出"咔嚓"（snap）声。所以 snap a photo = 快速抓拍一个瞬间。数字时代虽然用电子快门了，但这个说法保留了下来。同理：a snapshot（快照）= 一个瞬间的捕捉。'
      },
      {
        svg: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="760" height="300" fill="#fafaf8" rx="8"/>
      <text x="380" y="35" text-anchor="middle" fill="#333" font-size="15" font-weight="700" font-family="sans-serif">SNAP（情绪）vs BLOW UP vs CRACK UP</text>
      <circle cx="140" cy="110" r="25" fill="#f5e6d0"/>
      <path d="M130,105 Q140,95 150,105" fill="none" stroke="#333" stroke-width="2"/>
      <circle cx="130" cy="100" r="3" fill="#333"/>
      <circle cx="150" cy="100" r="3" fill="#333"/>
      <path d="M115,95 L105,85" stroke="#e63946" stroke-width="1.5"/>
      <path d="M165,95 L175,85" stroke="#e63946" stroke-width="1.5"/>
      <text x="140" y="160" text-anchor="middle" fill="#e63946" font-size="14" font-weight="bold" font-family="sans-serif">SNAP</text>
      <text x="140" y="177" text-anchor="middle" fill="#666" font-size="13" font-family="sans-serif">突然爆发</text>
      <text x="140" y="285" text-anchor="middle" fill="#999" font-size="13" font-family="sans-serif">"I snapped at him."</text>
      <circle cx="380" cy="110" r="25" fill="#f5e6d0"/>
      <text x="380" y="160" text-anchor="middle" fill="#e67e22" font-size="14" font-weight="bold" font-family="sans-serif">BLOW UP</text>
      <text x="380" y="177" text-anchor="middle" fill="#666" font-size="13" font-family="sans-serif">暴怒（像爆炸一样）</text>
      <text x="380" y="285" text-anchor="middle" fill="#999" font-size="13" font-family="sans-serif">"He blew up at me."</text>
      <circle cx="620" cy="110" r="25" fill="#f5e6d0"/>
      <path d="M605,115 Q620,130 635,115" fill="none" stroke="#333" stroke-width="2"/>
      <text x="620" y="160" text-anchor="middle" fill="#38a169" font-size="14" font-weight="bold" font-family="sans-serif">CRACK UP</text>
      <text x="620" y="177" text-anchor="middle" fill="#666" font-size="13" font-family="sans-serif">笑到不行（裂开了）</text>
      <text x="620" y="285" text-anchor="middle" fill="#999" font-size="13" font-family="sans-serif">"You crack me up."</text>
      <line x1="50" y1="220" x2="710" y2="220" stroke="#eee" stroke-width="1"/>
      <text x="380" y="245" text-anchor="middle" fill="#666" font-size="14" font-family="sans-serif">SNAP = 情绪绷到极限断掉了（被动崩溃）</text>
      <text x="380" y="264" text-anchor="middle" fill="#666" font-size="14" font-family="sans-serif">BLOW UP = 主动爆炸式发怒（火山喷发）</text>
      <text x="380" y="283" text-anchor="middle" fill="#666" font-size="14" font-family="sans-serif">CRACK UP = 笑到"裂开"（开心到失控）</text>
    </svg>`,
        title: 'SNAP vs BLOW UP vs CRACK UP（情绪爆发）',
        desc: 'SNAP = 被动崩溃（受不了了）| BLOW UP = 主动发怒 | CRACK UP = 笑崩',
        note: '<strong>💡 三种"爆发"的不同物理来源</strong>：SNAP = 一根弦断了（理智的弦/心理承受力）。BLOW UP = 炸弹爆炸（从内向外喷发）。CRACK UP = 表面裂开了（笑容裂开到不可收拾）。三个词都描述"从有到无"的突然变化，但各自的物理意象不同——SNAP 是被动的、压倒性的，BLOW UP 是主动的、剧烈的，CRACK UP 是好笑的。'
      }
    ],
    // 短语按分类组织
    phraseGroups: [
      {
        title: '① 物理断裂（核心义）',
        items: [
          { en: '<strong>snap</strong> in two', cn: '啪的一声断成两截', eg: '细长物体突然断成两段' },
          { en: '<strong>snap</strong> off', cn: '折断/拧断', eg: '用力一掰断下一块' },
          { en: '<strong>snap</strong> a twig/stick', cn: '折断小树枝/木棍', eg: '细长物体受压断裂' },
          { en: '<strong>snap</strong> a bone', cn: '（骨头）咔嚓断裂', eg: '骨头受力超过极限' },
        ],
        note: '<strong>💡 这是 SNAP 的原始画面</strong>：你拿着一根干树枝，双手用力一弯——啪！断成两截。这就是 SNAP。所有其他含义（情绪崩溃、咬合、拍照）都建立在这个"啪地断开"的画面之上。'
      },
      {
        title: '② 情绪崩溃/突然发作',
        items: [
          { en: '<strong>snap</strong>', cn: '情绪失控/崩溃', eg: '理智的弦突然断了' },
          { en: '<strong>snap</strong> at someone', cn: '突然对某人大喊大叫/发火', eg: '像狗突然咬人一样突然凶人' },
          { en: '<strong>snap</strong> out of it', cn: '从（坏情绪/发呆中）突然回过神来', eg: '像挣脱束缚一样突然恢复清醒' },
          { en: '<strong>snap</strong> to attention', cn: '突然立正/突然集中注意', eg: '像被弹了一下突然站直' },
          { en: "I'm about to <strong>snap</strong>", cn: '我快受不了了', eg: '我的承受力快到极限了' },
        ],
        note: '<strong>🧠 为什么 SNAP = "情绪崩溃"？</strong>：人的心理承受力被比喻成一根绷紧的橡皮筋。压力长期积累（张力蓄积）→ 快到极限了（临界点）→ 最后一根稻草 -> 啪！断了（SNAP）。所以 "I snapped" = 我终于绷不住了。'
      },
      {
        title: '③ 狗/动物咬合',
        items: [
          { en: '<strong>snap</strong> at', cn: '（狗）猛地咬向', eg: '嘴巴快速闭合→咬上去但可能没咬住' },
          { en: '<strong>snap</strong> its jaws', cn: '（动物）啪地闭上嘴巴', eg: '上下颚快速合拢发出清脆声音' },
          { en: '<strong>snap</strong> a trap', cn: '老鼠夹啪地关上', eg: '机关触发后快速闭合咬住' },
        ],
        note: '<strong>🧠 从断裂到咬合</strong>：树枝"啪"地断掉 = 一个东西突然分离成两段。嘴巴"啪"地咬合 = 两个东西突然合拢到一起。同一个 SNAP 描述了"突发性的、有声音的状态改变"——只是方向相反（断裂是分开，咬合是闭合）。'
      },
      {
        title: '④ 快速拍照/记录',
        items: [
          { en: '<strong>snap</strong> a photo/picture', cn: '拍张照片（快速抓拍）', eg: '相机的机械快门啪地闭合→捕捉画面' },
          { en: 'a <strong>snap</strong>shot', cn: '快照/瞬间', eg: '快速拍下的照片→引申为任何快速捕捉的片段' },
          { en: '<strong>snap</strong> a selfie', cn: '自拍一张', eg: '快速举起手机拍一张' },
        ],
        note: '<strong>🧠 SNAP 到相机快门的联想</strong>：传统相机快门释放时，两个金属片快速咬合（"咔嚓"一声），就像一个机械嘴巴"咬"住了一瞬间的画面。'
      },
      {
        title: '⑤ 快速的判断/动作',
        items: [
          { en: 'a <strong>snap</strong> decision', cn: '仓促的决定', eg: '像咬合一样快速、不经过多思考的决定' },
          { en: '<strong>snap</strong> judgment', cn: '仓促的判断/凭第一印象下结论', eg: '瞬间"咬住"一个结论不放' },
          { en: '<strong>snap</strong> out orders', cn: '厉声发出命令', eg: '快速、干脆、不容置疑地下命令' },
          { en: '<strong>snap</strong> your fingers', cn: '打响指', eg: '手指快速摩擦发出清脆声响' },
        ],
        note: '<strong>💡 snap decision 的物理来源</strong>：一个"snap decision"就像响指一样来得又快又脆——不需要过程、不犹豫、不回头。'
      },
      {
        title: '⑥ 其他固定短语',
        items: [
          { en: '<strong>snap</strong> ties/cord', cn: '断开联系/切断关系', eg: '像剪断绳子一样突然切断关系' },
          { en: '<strong>snap</strong> into place', cn: '啪地卡入到位', eg: '零件/拼图块卡扣到位发出啪声' },
          { en: "It's a <strong>snap</strong>!", cn: '太简单了！（小菜一碟）', eg: '像打响指一样轻松不费劲' },
          { en: 'cold <strong>snap</strong>', cn: '寒潮/突然降温', eg: '天气突然"啪"地变冷' },
        ],
        note: '<strong>💡 "It\'s a snap!" = 小菜一碟</strong>：这个用法非常口语化。来源：打响指（snap your fingers）几乎不花力气——所以"那件事就像打个响指一样简单"。'
      }
    ],
    phrases: [
      { en: '<strong>snap</strong> (v)', cn: '突然折断 / 断裂', eg: '"The branch snapped under the weight." 树枝承受不住重量折断了。' },
      { en: '<strong>snap</strong> at someone', cn: '冲某人发火 / 厉声说', eg: '"I\'m sorry I snapped at you earlier." 对不起刚才冲你发火了。' },
      { en: '<strong>snap</strong> out of it', cn: '从低落/恍惚中振作', eg: '"Come on, snap out of it!" 振作起来！' },
      { en: '<strong>snap</strong> decision', cn: '仓促/瞬间决定', eg: '"It was a snap decision, and I regret it." 那是个冲动的决定，我后悔了。' },
    ],
    compare: [
      { word: 'snap', desc: '啪地断裂' },
      { word: 'break', desc: '用力折断' },
      { word: 'crack', desc: '出现裂缝' },
      { word: 'burst', desc: '从内部胀破' },
    ],
    references: [
      {
        title: '🔄 近义词辨析',
        color: 'red',
        items: [
          '<strong>BREAK</strong> — 泛泛的"弄坏" <small>SNAP 特指细长物体突然断裂+声音</small>',
          '<strong>CRACK</strong> — 表面裂开 <small>SNAP 是完全断开，CRACK 可能只是裂缝</small>',
          '<strong>SPLIT</strong> — 纵向裂开 <small>SNAP 是横向/斜向断裂</small>',
          '<strong>BITE</strong> — 咬住不放 <small>snap at 是一下子咬住又放开</small>',
          '<strong>BLOW UP</strong> — 爆炸式发怒 <small>SNAP 是弦断了崩溃，BLOW UP 是火山喷发</small>',
        ]
      },
      {
        title: '💡 近义细辨：SNAP 独有的特征',
        color: 'green',
        items: [
          '<strong>声音</strong> — SNAP 必然伴随清脆响声（啪/咔嚓）',
          '<strong>速度</strong> — SNAP 永远指"瞬间发生"，不是渐变',
          '<strong>细长物体</strong> — SNAP 最适合细长物体（branch, rope, bone, twig）',
          '<strong>不可逆</strong> — SNAP 后无法恢复原状',
          '<small style="color:#666;font-size:12px;">如果一个动作没有声音、不是瞬间、不是细长物体——基本不用 SNAP。</small>',
        ]
      },
      {
        title: '📝 记忆口诀',
        color: 'purple',
        items: [
          '树枝受力啪地断，<br>弦崩人怒瞬间爆，<br>狗口快合咔一咬，<br>快门抓拍念一笑，<br>响指一打小菜到！',
          '<small style="color:#666;font-size:12px;margin-top:8px;display:block;">SNAP 的5种用法：<br>断裂 · 崩溃 · 咬合 · 拍照 · 轻巧/响指</small>',
        ]
      }
    ]
  },
  "get around to": {
    leap: "绕过去 → 终于抽出时间做",
    svg: `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
      <defs><filter id="shadowG"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.10"/></filter></defs>
      <rect width="760" height="400" fill="#fafaf8" rx="8"/>
      <text x="380" y="40" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">GET AROUND TO</text>
      <rect x="340" y="120" width="80" height="160" rx="8" fill="#ddd"/>
      <text x="380" y="210" text-anchor="middle" fill="#999" font-size="13" font-weight="600" font-family="sans-serif">障碍</text>
      <text x="380" y="228" text-anchor="middle" fill="#bbb" font-size="11" font-family="sans-serif">（其他事情）</text>
      <g filter="url(#shadowG)">
        <animateTransform attributeName="transform" type="translate"
          values="-180,0; -120,0; -40,-40; 40,-40; 120,0; 180,0; 180,0; 120,0; 40,-40; -40,-40; -120,0; -180,0"
          dur="6s" repeatCount="indefinite"/>
        <circle cx="200" cy="180" r="16" fill="#f5e6d0"/>
        <circle cx="195" cy="176" r="2.5" fill="#333"/>
        <circle cx="205" cy="176" r="2.5" fill="#333"/>
        <path d="M196,186 Q200,190 204,186" fill="none" stroke="#333" stroke-width="1.8"/>
        <line x1="200" y1="196" x2="200" y2="225" stroke="#333" stroke-width="2.5"/>
        <line x1="200" y1="200" x2="185" y2="215" stroke="#333" stroke-width="2"/>
        <line x1="200" y1="200" x2="215" y2="215" stroke="#333" stroke-width="2"/>
      </g>
      <rect x="610" y="180" width="100" height="60" rx="10" fill="#38a169" filter="url(#shadowG)"/>
      <text x="660" y="215" text-anchor="middle" fill="#fff" font-size="14" font-weight="600" font-family="sans-serif">✓ 目标</text>
      <path d="M20,200 Q80,140 200,140 Q300,140 320,200" fill="none" stroke="#e67e22" stroke-width="2" stroke-dasharray="6,4" opacity="0.5"/>
      <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">绕过眼前的障碍，终于到达目标</text>
    </svg>`,
    logic: `<strong>💡 核心逻辑</strong><br>
    <strong>get around</strong> = 绕过去（物理上绕过障碍）<br>
    <strong>to</strong> = 到达目标<br><br>
    物理画面：路上有个障碍物，你绕了一圈，终于走到你要去的地方。<br><br>
    → 引申为：<strong>终于抽出时间做某件事</strong>（因为其他事情像障碍一样挡着，你绕了很久才轮到它）。`,
    phrases: [
      { en: '<strong>get around to</strong> doing something', cn: '终于找出时间做某事', eg: '"I finally got around to cleaning the garage." 我终于抽出时间清理车库了。' },
      { en: '<strong>never got around to</strong> it', cn: '一直没腾出时间做', eg: '"I wanted to read that book but never got around to it." 我想读那本书，但一直没空。' },
    ],
    compare: [
      { word: 'get around to', desc: '终于找到时间做' },
      { word: 'get to', desc: '有机会/轮到做' },
    ]
  }
};

// 搜索函数：精确匹配 → 模糊匹配
export function searchWord(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  if (WORD_DATA[q]) return { key: q, data: WORD_DATA[q] };
  const key = Object.keys(WORD_DATA).find(k => k.includes(q));
  if (key) return { key, data: WORD_DATA[key] };
  return null;
}

// 获取所有词条 key
export function getAllWordKeys() {
  return Object.keys(WORD_DATA);
}

// 根据 key 获取词数据
export function getWordData(key) {
  return WORD_DATA[key] || null;
}

export default WORD_DATA;
