import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { getWordData } from '../data/words';
import { fetchWordFromEngine } from '../data/api';
import TopNav from '../components/TopNav';

export default function WordDetailPage() {
  const { word } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(''); // 'engine' | 'local' | ''

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      // 先试 API
      const engineResult = await fetchWordFromEngine(word);
      if (cancelled) return;

      if (engineResult) {
        setData(engineResult);
        setSource('engine');
      } else {
        // 降级到本地
        const local = getWordData(word);
        if (!cancelled) {
          setData(local);
          setSource(local ? 'local' : '');
        }
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [word]);

  if (loading) {
    return (
      <>
        <TopNav title="English Physics" onBack={() => navigate('/')} rightSlot={<span />} />
        <div className="col-empty">加载中...</div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <TopNav title="English Physics" onBack={() => navigate('/')} rightSlot={<span />} />
        <div className="col-empty">
          未找到该词的图解<br />
          <span style={{ fontSize: '13px', color: '#b0a69c', marginTop: '8px' }}>
            "{word}" 暂时无法生成图解
          </span>
        </div>
      </>
    );
  }

  const fav = isFavorite(word);

  return (
    <>
      <TopNav
        title="English Physics"
        onBack={() => navigate('/')}
        rightSlot={<span />}
      />

      <div className="scroll-area">
        <div className="word-header fade-in">
          <h1>
            {word}{' '}
            <span
              className="heart-inline"
              onClick={() => toggleFavorite(word)}
            >
              {fav ? '❤️' : '♡'}
            </span>
          </h1>
          <div className="leap">{data.leap}</div>
        </div>

        {/* ── 主SVG图 ── */}
        <div className="svg-zone">
          <div dangerouslySetInnerHTML={{ __html: data.svg }} />
        </div>

        {/* ── 核心逻辑 ── */}
        <div
          className="white-box"
          dangerouslySetInnerHTML={{ __html: data.logic }}
        />

        {/* ── 核心意象对比卡片 ── */}
        {data.cards && data.cards.length > 0 && (
          <div className="detail-section">
            <h3>🖼️ 核心意象对比</h3>
            <div className="compare-row-full">
              {data.cards.map((card, i) => (
                <div className="compare-card-full" key={i}>
                  <div className="compare-card-svg">
                    <div dangerouslySetInnerHTML={{ __html: card.svg }} />
                  </div>
                  <div className="compare-card-body">
                    <h4>{card.title}</h4>
                    <div className="compare-card-pos">{card.subtitle}</div>
                    <div className="compare-card-def" dangerouslySetInnerHTML={{ __html: card.body }} />
                    {card.whiteBox && (
                      <div className="white-box" dangerouslySetInnerHTML={{ __html: card.whiteBox }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 逻辑演化树 ── */}
        {data.logicTree && (
          <div className="detail-section">
            <h3>🧠 逻辑演化树</h3>
            <div className="tree-wrap">
              <div className="tree-list">
                {data.logicTree.branches.map((b, i) => (
                  <div className="tree-item" key={i}>
                    <span className="tree-label" style={{ background: b.color }}>
                      {b.label}
                    </span>
                    <span className="tree-arrow">→</span>
                    <span className="tree-usage">{b.usage}</span>
                    <span className="tree-note">{b.note}</span>
                  </div>
                ))}
              </div>
              <div className="white-box" dangerouslySetInnerHTML={{ __html: data.logicTree.insight }} />
            </div>
          </div>
        )}

        {/* ── 程度光谱 ── */}
        {data.spectrum && (
          <div className="detail-section">
            <h3>📊 程度光谱</h3>
            <div className="spectrum-wrap">
              <div className="spectrum-svg" dangerouslySetInnerHTML={{ __html: data.spectrum }} />
              <div className="white-box">{data.spectrumNote}</div>
            </div>
          </div>
        )}

        {/* ── 深度对比卡片（带SVG） ── */}
        {data.compareCards && data.compareCards.length > 0 && (
          <div className="detail-section">
            <h3>🔍 易混深度对比</h3>
            <div className="compare-row-full">
              {data.compareCards.map((cc, i) => (
                <div className="compare-card-full" key={i}>
                  <div className="compare-card-svg">
                    <div dangerouslySetInnerHTML={{ __html: cc.svg }} />
                  </div>
                  <div className="compare-card-body">
                    <h4>{cc.title}</h4>
                    <div className="compare-card-desc">{cc.desc}</div>
                    <div className="white-box" dangerouslySetInnerHTML={{ __html: cc.note }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 短语分组（详细版） ── */}
        {data.phraseGroups && data.phraseGroups.length > 0 && (
          <div className="detail-section">
            <h3>📖 口语常见搭配</h3>
            {data.phraseGroups.map((group, gi) => (
              <div className="usage-section" key={gi}>
                <h4>{group.title}</h4>
                <div className="usage-list">
                  {group.items.map((item, ii) => (
                    <div className="usage-item" key={ii}>
                      <span className="usage-en" dangerouslySetInnerHTML={{ __html: item.en }} />
                      <span className="usage-cn">{item.cn} &nbsp;|&nbsp; 📖 {item.eg}</span>
                    </div>
                  ))}
                </div>
                {group.note && (
                  <div className="white-box" style={{ marginTop: '12px' }} dangerouslySetInnerHTML={{ __html: group.note }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 简版短语列表（降级方案） ── */}
        {!data.phraseGroups && data.phrases.length > 0 && (
          <div className="detail-section">
            <h3>📖 口语常见搭配</h3>
            <div className="phrase-list">
              {data.phrases.map((p, i) => (
                <div className="phrase-item" key={i}>
                  <div className="en" dangerouslySetInnerHTML={{ __html: p.en }} />
                  <div className="cn">{p.cn}</div>
                  <div className="example">{p.eg}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 易混对比（简版） ── */}
        {data.compare && data.compare.length > 0 && (
          <div className="detail-section">
            <h3>🔍 易混对比</h3>
            <div className="compare-grid">
              {data.compare.map((c, i) => (
                <div className="compare-card" key={i}>
                  {c.word}
                  <small>{c.desc}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 三栏参考卡片 ── */}
        {data.references && data.references.length > 0 && (
          <div className="detail-section">
            <h3>反义 / 相似词</h3>
            <div className="refs-wrap">
              <div className="three-col">
                {data.references.map((ref, i) => (
                  <div className={`info-card ${ref.color}-bg`} key={i}>
                    <h5 style={{
                      color: ref.color === 'red' ? '#e63946' : ref.color === 'green' ? '#38a169' : '#7b4ad9'
                    }}>{ref.title}</h5>
                    {ref.items.map((item, j) => (
                      <p key={j} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
