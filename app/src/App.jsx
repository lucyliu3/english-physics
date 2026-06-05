import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import HomePage from './pages/HomePage';
import WordDetailPage from './pages/WordDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import './App.css';

function AppContent() {
  return (
    <div className="app-container">
      <div className="app-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/word/:word" element={<WordDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
