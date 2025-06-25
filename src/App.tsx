import React, { useState } from 'react';
import { AppState, Deck, StudySession } from './types';
import './App.css';

import HomePage from './components/HomePage';
import DecksPage from './components/DecksPage';
import ProgressPage from './components/ProgressPage';
import Navigation from './components/Navigation';

const mockDecks: Deck[] = [
  {
    id: 'deck_1',
    name: 'TypeScript Basics',
    description: 'Fundamental concepts of TypeScript including types, interfaces, and basic syntax.',
    difficulty: 'easy',
    cards: [],
    totalCards: 156,
    dueCards: 23,
    createdAt: new Date(),
  },
  {
    id: 'deck2',
    name: 'React Hooks',
    description: 'Advanced React patterns with hooks, context, and state management.',
    difficulty: 'medium',
    cards: [],
    totalCards: 89,
    dueCards: 12,
    createdAt: new Date(),
  }
];

const mockStudySessions: StudySession[] = [
  { deckId: 'deck1', deckName: 'TypeScript Basics', date: '2025-06-01', difficulty: 'hard', cardsStudied: 10, successRate: 60 },
  { deckId: 'deck1', deckName: 'TypeScript Basics', date: '2025-06-03', difficulty: 'hard', cardsStudied: 15, successRate: 65 },
  { deckId: 'deck1', deckName: 'TypeScript Basics', date: '2025-06-05', difficulty: 'medium', cardsStudied: 12, successRate: 75 },
  
];


function App() {
  const [appState, setAppState] = useState<AppState>({
    decks: mockDecks,
    studySessions: mockStudySessions,
    currentPage: 'home'
  });

  const handlePageChange = (page: 'home' | 'decks' | 'progress') => {
    setAppState(prev => ({ ...prev, currentPage: page }));
  };

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />;
      case 'decks':
        return <DecksPage decks={appState.decks} />;
      case 'progress':
        return <ProgressPage decks={appState.decks} studySessions={appState.studySessions} />;
      default:
        return <HomePage onNavigate={handlePageChange} />;
    }
  };

  return (
    <div className="App">
      <div className="nebula-background"></div>
      <div className="stars"></div>
      
      <div className="container">
        <Navigation 
          currentPage={appState.currentPage} 
          onPageChange={handlePageChange} 
        />
        
        <main className="main-content">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
