// src/components/DecksPage.tsx
import React from 'react';
import { Deck } from '../types';

// Define what props this component expects
interface DecksPageProps {
  decks: Deck[];
}

// Create the DecksPage component
const DecksPage: React.FC<DecksPageProps> = ({ decks }) => {
  
  const handleUploadDeck = () => {
    alert('Upload deck functionality - this would open a file dialog or upload form!');
  };

  const handleStudyDeck = (deckId: string) => {
    alert(`Starting study session for deck: ${deckId}`);
  };

  return (
    <div className="page active">
      <div className="decks-header">
        <h2 className="page-title">Study Decks</h2>
        <button className="upload-btn" onClick={handleUploadDeck}>
          ➕ Upload New Deck
        </button>
      </div>
      
      <div className="decks-grid">
        {decks.map((deck) => (
          <div key={deck.id} className={`deck-card ${deck.difficulty}`}>
            <div className={`deck-difficulty difficulty-${deck.difficulty}`}>
              {deck.difficulty.charAt(0).toUpperCase() + deck.difficulty.slice(1)}
            </div>
            <h3 className="deck-title">{deck.name}</h3>
            <p className="deck-description">{deck.description}</p>
            <div className="deck-stats">
              <span>{deck.totalCards} cards</span>
              <span>{deck.dueCards} due</span>
            </div>
            <button 
              className="study-btn"
              onClick={() => handleStudyDeck(deck.id)}
            >
              Study Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecksPage;