import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { getWordData } from '../data/words';
import TopNav from '../components/TopNav';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <>
      <TopNav title="我的收藏" onBack={() => navigate('/')} rightSlot={<span />} />

      {favorites.length === 0 ? (
        <div className="col-empty">
          还没有收藏的词<br />
          搜一个词，看到喜欢的点 ❤️ 收藏吧
        </div>
      ) : (
        <div className="favorites-list">
          <div className="fav-count">共 {favorites.length} 个词</div>
          {favorites.map((word) => {
            const data = getWordData(word);
            return (
              <div
                className="fav-item"
                key={word}
                onClick={() => navigate(`/word/${encodeURIComponent(word)}`)}
              >
                <div>
                  <div className="word">
                    {word}{' '}
                    <span
                      className="heart-inline filled"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(word);
                      }}
                    >
                      ❤️
                    </span>
                  </div>
                  {data && <div className="meta">{data.leap}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
