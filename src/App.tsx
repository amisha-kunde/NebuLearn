import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Deck, StudySession } from './types';
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
  { deckId: 'deck_1', deckName: 'TypeScript Basics', date: '2025-06-01', difficulty: 'hard', cardsStudied: 10, successRate: 60 },
  { deckId: 'deck_1', deckName: 'TypeScript Basics', date: '2025-06-03', difficulty: 'hard', cardsStudied: 15, successRate: 65 },
  { deckId: 'deck_1', deckName: 'TypeScript Basics', date: '2025-06-05', difficulty: 'medium', cardsStudied: 12, successRate: 75 },
];

function App() {
  return (
    <Router>
      <div className="App">
        <div className="nebula-background"></div>
        <div className="stars"></div>
        
        <div className="container">
          <Navigation />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/decks" element={<DecksPage decks={mockDecks} />} />
              <Route path="/progress" element={<ProgressPage decks={mockDecks} studySessions={mockStudySessions} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;