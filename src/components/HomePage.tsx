// src/components/HomePage.tsx
import React from 'react';

// Define what props this component expects
interface HomePageProps {
  onNavigate: (page: 'home' | 'decks' | 'progress') => void;
}

// Create the HomePage component
const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="page active">
      <div className="home-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="intro-glass-card">
          <div className="nebula-glow"></div>
          <h1 className="main-title">NebuLearn</h1>
          <p className="subtitle">Expand your mind</p>
          <div className="main-buttons">
            <button 
              className="main-btn" 
              onClick={() => onNavigate('decks')}
            >
              📚 Explore Decks
            </button>
            <button 
              className="main-btn" 
              onClick={() => onNavigate('progress')}
            >
              📊 Check Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;