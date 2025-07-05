// src/components/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Remove the props interface since we're using React Router
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page active">
      <div className="home-page">
        <div className="nebula-center">
          <div>
            <h1 className="main-title">NebuLearn</h1>
            <p className="subtitle">expand your mind</p>
          </div>
        </div>
        
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
  );
};

export default HomePage;