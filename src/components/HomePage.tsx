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
  );
};

export default HomePage;