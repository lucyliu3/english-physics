import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ep_favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ep_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback((word) => favorites.includes(word), [favorites]);

  const toggleFavorite = useCallback((word) => {
    setFavorites(prev => {
      const idx = prev.indexOf(word);
      if (idx > -1) return prev.filter((_, i) => i !== idx);
      return [...prev, word];
    });
  }, []);

  const count = favorites.length;

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, count }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
