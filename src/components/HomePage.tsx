// src/components/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Create the HomePage component
const HomePage = () => {
  const navigate = useNavigate();
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
              onClick={() => navigate('/decks')}
            >
              📚 Explore Decks
            </button>
            <button 
              className="main-btn" 
              onClick={() => navigate('/progress')}
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