// svg-renderer.js — 参数化 SVG 生成器
// 每个场景有一套模板，根据 word 语义参数填充

/**
 * 根据场景类型和参数生成 SVG
 * @param {object} pattern - patterns.json 中的场景模式
 * @param {string} word - 查询词
 * @param {string} pos - 词性
 * @returns {string} 完整的 SVG 字符串
 */
export function renderSVG(pattern, word, pos) {
  const template = pattern.visual?.template || 'generic';

  switch (template) {
    case 'tension': return renderTensionSVG(word);
    case 'friction': return renderFrictionSVG(word);
    case 'movement': return renderMovementSVG(word);
    case 'transition': return renderTransitionSVG(word);
    case 'gradient': return renderGradientSVG(word);
    case 'temperature': return renderTemperatureSVG(word);
    case 'body': return renderBodySVG(word);
    case 'direction': return renderDirectionSVG(word);
    case 'separation': return renderSeparationSVG(word);
    case 'connection': return renderConnectionSVG(word);
    case 'scalebar': return renderScaleBarSVG(word);
    default: return renderGenericSVG(word);
  }
}

function defs() {
  return `<defs>
    <filter id="shadow"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.10"/></filter>
    <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e67e22"/>
      <stop offset="100%" stop-color="#d35400"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e63946"/>
      <stop offset="100%" stop-color="#c1121f"/>
    </linearGradient>
  </defs>`;
}

function renderTensionSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <path d="M100,200 Q180,240 300,200" fill="none" stroke="#e67e22" stroke-width="6" stroke-linecap="round" filter="url(#shadow)">
      <animate attributeName="d" values="M100,200 Q180,240 300,200;M100,200 Q180,100 300,200;M100,200 Q180,60 300,200;M100,200 Q180,80 300,200;M100,200 Q180,260 300,200;M100,200 Q180,240 300,200" dur="5s" repeatCount="indefinite"/>
    </path>
    <circle cx="100" cy="200" r="7" fill="#666"/>
    <circle cx="300" cy="200" r="7" fill="#666"/>
    <g>
      <animate attributeName="opacity" values="0;0;0;0;1;0" dur="5s" repeatCount="indefinite"/>
      <path d="M100,200 Q150,140 190,170" fill="none" stroke="#e63946" stroke-width="5" stroke-linecap="round"/>
      <path d="M300,200 Q250,260 210,230" fill="none" stroke="#e63946" stroke-width="5" stroke-linecap="round"/>
      <text x="200" y="130" text-anchor="middle" fill="#e63946" font-size="20" font-weight="900" font-family="sans-serif">💥 ${w}!</text>
    </g>
    <text x="380" y="360" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">拉到极限 → 断裂 → 释放</text>
  </svg>`;
}

function renderMovementSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <rect x="0" y="330" width="760" height="12" fill="#e8e0d0"/>
    <rect x="30" y="60" width="60" height="60" rx="8" fill="#ddd" stroke="#bbb" stroke-width="1"/>
    <text x="60" y="150" text-anchor="middle" fill="#999" font-size="11" font-family="sans-serif">起点</text>
    <rect x="620" y="60" width="80" height="60" rx="8" fill="#38a169" opacity="0.3" stroke="#38a169" stroke-width="1"/>
    <text x="660" y="150" text-anchor="middle" fill="#38a169" font-size="11" font-weight="bold" font-family="sans-serif">终点</text>
    <g filter="url(#shadow)">
      <animateTransform attributeName="transform" type="translate" values="0,0;580,0;580,0;0,0" dur="6s" repeatCount="indefinite" keyTimes="0;0.4;0.6;1"/>
      <circle cx="80" cy="90" r="16" fill="#f5e6d0"/>
      <circle cx="75" cy="87" r="2.5" fill="#333"/>
      <circle cx="85" cy="87" r="2.5" fill="#333"/>
      <path d="M76,96 Q80,100 84,96" fill="none" stroke="#333" stroke-width="1.5"/>
      <line x1="80" y1="106" x2="80" y2="115" stroke="#333" stroke-width="2"/>
      <line x1="80" y1="109" x2="65" y2="118" stroke="#333" stroke-width="1.5"/>
      <line x1="80" y1="109" x2="95" y2="118" stroke="#333" stroke-width="1.5"/>
    </g>
    <path d="M60,270 Q200,240 380,260 Q560,280 660,250" fill="none" stroke="#e67e22" stroke-width="2" stroke-dasharray="6,4" opacity="0.4"/>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">从一个位置到另一个位置的移动</text>
  </svg>`;
}

function renderFrictionSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <rect x="80" y="160" width="180" height="130" rx="6" fill="url(#accentGrad)" filter="url(#shadow)"/>
    <text x="170" y="215" text-anchor="middle" fill="#fff" font-size="14" font-weight="600" font-family="sans-serif">表面 A</text>
    <text x="170" y="235" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="12" font-family="sans-serif">附着物</text>
    <g filter="url(#shadow)">
      <circle cx="210" cy="210" r="8" fill="#e63946">
        <animate attributeName="cx" values="210;280;340" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="210;260;290" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="8;6;4" dur="3s" repeatCount="indefinite"/>
      </circle>
    </g>
    <rect x="490" y="160" width="180" height="130" rx="6" fill="#f8f4f0" filter="url(#shadow)"/>
    <text x="580" y="215" text-anchor="middle" fill="#bbb" font-size="14" font-weight="600" font-family="sans-serif">表面 B</text>
    <g>
      <animate attributeName="opacity" values="0;0;0;1;1" dur="3s" repeatCount="indefinite"/>
      <rect x="490" y="160" width="180" height="130" rx="6" fill="#e63946" opacity="0.3" filter="url(#shadow)"/>
      <text x="580" y="235" text-anchor="middle" fill="#e63946" font-size="12" font-weight="600" font-family="sans-serif">被转移 ✨</text>
    </g>
    <text x="390" y="210" text-anchor="middle" fill="#e67e22" font-size="22" font-weight="700">→</text>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">摩擦 → 脱离 → 转移 → 附着</text>
  </svg>`;
}

function renderTransitionSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <circle cx="140" cy="200" r="50" fill="#3498db" opacity="0.3" filter="url(#shadow)"/>
    <text x="140" y="205" text-anchor="middle" fill="#3498db" font-size="14" font-weight="bold" font-family="sans-serif">状态 A</text>
    <text x="380" y="205" text-anchor="middle" fill="#e67e22" font-size="28" font-weight="700">
      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>→
    </text>
    <circle cx="620" cy="200" r="50" fill="#38a169" opacity="0.3" filter="url(#shadow)"/>
    <text x="620" y="200" text-anchor="middle" fill="#38a169" font-size="14" font-weight="bold" font-family="sans-serif">状态 B</text>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">从状态A转变为状态B的变化过程</text>
  </svg>`;
}

function renderGradientSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <rect x="80" y="180" width="600" height="40" rx="20" fill="#e8e0d0"/>
    <rect x="80" y="180" width="600" height="40" rx="20" fill="url(#primaryGrad)" opacity="0.6">
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/>
    </rect>
    <text x="100" y="160" text-anchor="middle" fill="#999" font-size="12" font-family="sans-serif">少</text>
    <text x="660" y="160" text-anchor="middle" fill="#999" font-size="12" font-family="sans-serif">多</text>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">在程度标尺上的位置</text>
  </svg>`;
}

function renderTemperatureSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <rect x="80" y="120" width="600" height="160" rx="80" fill="#f0f0f0"/>
    <rect x="80" y="120" width="600" height="160" rx="80" fill="url(#accentGrad)" opacity="0">
      <animate attributeName="opacity" values="0;0.8;0" dur="5s" repeatCount="indefinite"/>
    </rect>
    <text x="100" y="155" text-anchor="middle" fill="#3498db" font-size="14" font-weight="bold" font-family="sans-serif">❄ 冷</text>
    <text x="660" y="155" text-anchor="middle" fill="#e63946" font-size="14" font-weight="bold" font-family="sans-serif">🔥 热</text>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">温度标尺上的位置</text>
  </svg>`;
}

function renderBodySVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <circle cx="380" cy="150" r="40" fill="#f5e6d0" filter="url(#shadow)"/>
    <circle cx="365" cy="142" r="5" fill="#333"/>
    <circle cx="395" cy="142" r="5" fill="#333"/>
    <path d="M370,165 Q380,175 390,165" fill="none" stroke="#333" stroke-width="2"/>
    <line x1="380" y1="190" x2="380" y2="280" stroke="#333" stroke-width="4"/>
    <line x1="380" y1="210" x2="320" y2="260" stroke="#333" stroke-width="3"/>
    <line x1="380" y1="210" x2="440" y2="260" stroke="#333" stroke-width="3"/>
    <line x1="380" y1="280" x2="330" y2="340" stroke="#333" stroke-width="3"/>
    <line x1="380" y1="280" x2="430" y2="340" stroke="#333" stroke-width="3"/>
    <text x="380" y="380" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">${w} — 身体动作的意象</text>
  </svg>`;
}

function renderDirectionSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <circle cx="200" cy="200" r="16" fill="#f5e6d0" filter="url(#shadow)"/>
    <line x1="200" y1="200" x2="560" y2="200" stroke="#e67e22" stroke-width="3" stroke-dasharray="8,4"/>
    <polygon points="560,190 580,200 560,210" fill="#e67e22"/>
    <rect x="600" y="180" width="60" height="40" rx="6" fill="#38a169" opacity="0.3"/>
    <text x="630" y="205" text-anchor="middle" fill="#38a169" font-size="12" font-weight="bold" font-family="sans-serif">目标</text>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">空间中的方向指示</text>
  </svg>`;
}

function renderSeparationSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <rect x="120" y="160" width="200" height="80" rx="8" fill="#e67e22" opacity="0.4" filter="url(#shadow)"/>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;-50,0" dur="3s" repeatCount="indefinite"/>
      <rect x="120" y="160" width="90" height="80" rx="6" fill="#e67e22" opacity="0.7"/>
      <text x="165" y="205" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="sans-serif">A</text>
    </g>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;50,0" dur="3s" repeatCount="indefinite"/>
      <rect x="230" y="160" width="90" height="80" rx="6" fill="#e63946" opacity="0.7"/>
      <text x="275" y="205" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="sans-serif">B</text>
    </g>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">从一个整体分离成独立部分</text>
  </svg>`;
}

function renderConnectionSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <circle cx="180" cy="200" r="30" fill="#e67e22" opacity="0.3" filter="url(#shadow)"/>
    <text x="180" y="205" text-anchor="middle" fill="#d35400" font-size="14" font-weight="bold" font-family="sans-serif">A</text>
    <circle cx="580" cy="200" r="30" fill="#38a169" opacity="0.3" filter="url(#shadow)"/>
    <text x="580" y="205" text-anchor="middle" fill="#38a169" font-size="14" font-weight="bold" font-family="sans-serif">B</text>
    <line x1="210" y1="200" x2="550" y2="200" stroke="#e67e22" stroke-width="4">
      <animate attributeName="stroke-dasharray" values="0,340;340,0" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1" dur="2s" repeatCount="indefinite"/>
    </line>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">将两个物体连接在一起</text>
  </svg>`;
}

function renderScaleBarSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="38" text-anchor="middle" fill="#e67e22" font-size="17" font-weight="700" font-family="sans-serif">${w}</text>
    <rect x="80" y="180" width="600" height="30" rx="15" fill="#e8e0d0"/>
    <rect x="80" y="180" width="600" height="30" rx="15" fill="url(#primaryGrad)" opacity="0.5">
      <animate attributeName="width" values="0;600;600;0" dur="6s" repeatCount="indefinite" keyTimes="0;0.4;0.6;1"/>
    </rect>
    <text x="90" y="240" text-anchor="middle" fill="#999" font-size="12" font-family="sans-serif">弱</text>
    <text x="670" y="240" text-anchor="middle" fill="#999" font-size="12" font-family="sans-serif">强</text>
    <text x="380" y="300" text-anchor="middle" fill="#e67e22" font-size="14" font-weight="600" font-family="sans-serif">"${word}"</text>
    <text x="380" y="370" text-anchor="middle" fill="#998e84" font-size="12" font-family="sans-serif">在程度标尺上的位置</text>
  </svg>`;
}

function renderGenericSVG(word) {
  const w = word.toUpperCase();
  return `<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
    ${defs()}
    <rect width="760" height="400" fill="#fafaf8" rx="8"/>
    <text x="380" y="180" text-anchor="middle" fill="#e67e22" font-size="24" font-weight="700" font-family="sans-serif">${w}</text>
    <text x="380" y="220" text-anchor="middle" fill="#998e84" font-size="14" font-family="sans-serif">探索这个词的物理意象</text>
    <text x="380" y="370" text-anchor="middle" fill="#b0a69c" font-size="12" font-family="sans-serif">每个抽象概念都源于一个物理体验</text>
  </svg>`;
}
