import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { searchWord } from '../data/words';
import { fetchWordFromEngine } from '../data/api';
import Logo from '../components/Logo';

export default function HomePage() {
  const navigate = useNavigate();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (!q || searching) return;
      setSearching(true);

      const slug = encodeURIComponent(q);

      // 先查 API
      const engineResult = await fetchWordFromEngine(q);
      if (engineResult) {
        setQuery('');
        setSearching(false);
        navigate(`/word/${slug}`);
        return;
      }

      // 降级到本地
      const local = searchWord(q);
      if (local) {
        setQuery('');
        setSearching(false);
        navigate(`/word/${encodeURIComponent(local.key)}`);
        return;
      }

      // 都没找到
      setSearching(false);
      alert(`✨ "${q}" 的图解正在生成中……\n\n（这是 MVP 演示，实际产品中引擎会自动生成）`);
      setQuery('');
    }
  };

  return (
    <>
      <Logo />

      <div className="scroll-area">
        <div className="search-row">
          <input
            className="search-box"
            type="search"
            placeholder="输入你想查询的任何单词/固定搭配，查询它的空间逻辑"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus
            autoComplete="off"
          />
          <button
            className="search-btn"
            disabled={searching}
            onClick={async () => {
              const q = query.trim();
              if (!q || searching) return;
              setSearching(true);
              const slug = encodeURIComponent(q);
              const engineResult = await fetchWordFromEngine(q);
              if (engineResult) {
                setQuery('');
                setSearching(false);
                navigate(`/word/${slug}`);
                return;
              }
              const local = searchWord(q);
              if (local) {
                setQuery('');
                setSearching(false);
                navigate(`/word/${encodeURIComponent(local.key)}`);
                return;
              }
              setSearching(false);
              alert(`✨ "${q}" 的图解正在生成中……\n\n（这是 MVP 演示，实际产品中引擎会自动生成）`);
              setQuery('');
            }}
          >
            {searching ? '查询中…' : '查询'}
          </button>
        </div>

        <div className="section-label" onClick={() => navigate('/favorites')}>
          ❤️ 我的收藏
        </div>

        {favorites.length === 0 ? (
          <div className="home-empty">
            还没有收藏的词<br />搜一个词看看它的画面吧 ✨
          </div>
        ) : (
          <div className="home-list">
            {favorites.map((word) => (
              <div
                className="home-item"
                key={word}
                onClick={() => navigate(`/word/${encodeURIComponent(word)}`)}
              >
                <span className="word">
                  {word}{' '}
                  <span
                    className="heart-inline"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(word);
                    }}
                  >
                    ❤️
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}

<div className="footer-note">
          想要快捷访问，可添加至手机桌面：<br /><br />
          iPhone：点底部分享 → 添加到主屏幕<br />
          安卓：打开右上角菜单 → 添加到主屏幕
        </div>
      </div>
    </>
  );
}
