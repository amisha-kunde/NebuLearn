export interface Card {
    id: string; //e.g. "card_123"
    front: string; // front of card
    back: string; // back of card
    deckId: string; // which deck it is in
    difficulty: number; // how well retained it is
    interval: number;
    repetitions: number;
    nextReview: Date;
    createdAt: Date;
    lastReviewed?: Date;
    tags?: string[];
}

export interface Deck {
    id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    cards: Card[];
    totalCards: number;
    dueCards: number;
    createdAt: Date;
    lastStudied?: Date;
  }

export interface StudySession {
    deckId: string;
    deckName: string;
    date: string; // "2025-06-01" format
    difficulty: 'easy' | 'medium' | 'hard';
    cardsStudied: number;
    successRate: number;
}

export interface AppState {
    decks: Deck[];
    studySessions: StudySession[];
    currentPage: 'home' | 'decks' | 'progress';
}