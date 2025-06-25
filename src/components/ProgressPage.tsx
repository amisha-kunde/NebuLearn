import React, { useState } from 'react';

// src/components/ProgressPage.tsx
import { Deck, StudySession } from '../types';

interface ProgressPageProps {
  decks: Deck[];
  studySessions: StudySession[];
  onUpdateSessions?: (sessions: StudySession[]) => void;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ 
  decks, 
  studySessions: initialSessions, 
  onUpdateSessions 
}) => {
  const [studySessions, setStudySessions] = useState<StudySession[]>(initialSessions);

  // Generate calendar dates for June 2025
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      dates.push(`2025-06-${i.toString().padStart(2, '0')}`);
    }
    return dates;
  };

  const calendarDates = generateDates();

  // Get session for a specific deck and date
  const getSessionForDeckAndDate = (deckId: string, date: string) => {
    return studySessions.find(session => session.deckId === deckId && session.date === date);
  };

  // Cycle through difficulty levels: none → hard → medium → easy → none
  const getNextDifficulty = (currentDifficulty?: 'easy' | 'medium' | 'hard'): 'easy' | 'medium' | 'hard' | null => {
    switch (currentDifficulty) {
      case undefined:
      case null:
        return 'hard';
      case 'hard':
        return 'medium';
      case 'medium':
        return 'easy';
      case 'easy':
        return null;
      default:
        return 'hard';
    }
  };

  // Handle clicking on a calendar dot
  const handleDotClick = (deckId: string, date: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;

    const existingSession = getSessionForDeckAndDate(deckId, date);
    const nextDifficulty = getNextDifficulty(existingSession?.difficulty);

    let newSessions: StudySession[];

    if (nextDifficulty === null) {
      // Remove the session
      newSessions = studySessions.filter(session => 
        !(session.deckId === deckId && session.date === date)
      );
    } else {
      if (existingSession) {
        // Update existing session
        newSessions = studySessions.map(session => 
          session.deckId === deckId && session.date === date
            ? { ...session, difficulty: nextDifficulty }
            : session
        );
      } else {
        // Create new session
        const newSession: StudySession = {
          deckId,
          deckName: deck.name,
          date,
          difficulty: nextDifficulty,
          cardsStudied: Math.floor(Math.random() * 20) + 5, // Random 5-25 cards
          successRate: Math.floor(Math.random() * 40) + 60 // Random 60-100%
        };
        newSessions = [...studySessions, newSession];
      }
    }

    setStudySessions(newSessions);
    if (onUpdateSessions) {
      onUpdateSessions(newSessions);
    }
  };

  // Calculate average success rate
  const averageSuccessRate = studySessions.length > 0 
    ? Math.round(studySessions.reduce((sum, session) => sum + session.successRate, 0) / studySessions.length)
    : 0;

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return `Jun ${date.getDate()}`;
  };

  return (
    <div style={{ 
      padding: '40px', 
      background: '#0a0a0a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        color: '#e1bee7', 
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Study Progress
      </h2>
      
      {/* Deck Progress Timeline */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          color: '#e1bee7', 
          marginBottom: '25px', 
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          Interactive Study Calendar
        </h3>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#bbb', 
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          Click on any date to add a study session. Click again to cycle through difficulty levels.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          fontSize: '0.9rem', 
          marginBottom: '20px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: '#f44336', 
              borderRadius: '50%' 
            }}></div>
            Hard (Just Started)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: '#ff9800', 
              borderRadius: '50%' 
            }}></div>
            Medium (Getting Better)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: '#4caf50', 
              borderRadius: '50%' 
            }}></div>
            Easy (Mastered)
          </span>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflowX: 'auto'
        }}>
          {/* Timeline Header */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '15px'
          }}>
            <div style={{ 
              width: '180px', 
              flexShrink: 0,
              fontWeight: '600',
              color: '#e1bee7',
              paddingRight: '20px'
            }}>
              Deck
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(15, 1fr)',
              gap: '8px',
              flex: 1,
              minWidth: '750px'
            }}>
              {calendarDates.slice(0, 15).map(date => (
                <div key={date} style={{
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: '#bbb',
                  fontWeight: '500'
                }}>
                  {formatDateForDisplay(date)}
                </div>
              ))}
            </div>
          </div>

          {/* Render each deck's timeline */}
          {decks.map((deck) => (
            <div key={deck.id} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              padding: '10px 0',
              borderRadius: '10px',
              transition: 'background 0.3s ease'
            }}>
              <div style={{
                width: '180px',
                flexShrink: 0,
                fontWeight: '500',
                color: 'white',
                paddingRight: '20px'
              }}>
                {deck.name}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, 1fr)',
                gap: '8px',
                flex: 1,
                alignItems: 'center',
                minWidth: '750px'
              }}>
                {calendarDates.slice(0, 15).map(date => {
                  const session = getSessionForDeckAndDate(deck.id, date);
                  return (
                    <div
                      key={`${deck.id}-${date}`}
                      onClick={() => handleDotClick(deck.id, date)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent',
                        background: session 
                          ? session.difficulty === 'hard' ? '#f44336'
                          : session.difficulty === 'medium' ? '#ff9800'
                          : '#4caf50'
                          : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: session 
                          ? `0 0 10px ${
                              session.difficulty === 'hard' ? 'rgba(244, 67, 54, 0.3)'
                              : session.difficulty === 'medium' ? 'rgba(255, 152, 0, 0.3)'
                              : 'rgba(76, 175, 80, 0.3)'
                            }`
                          : 'none',
                        margin: '0 auto',
                        transform: 'scale(1)',
                        opacity: session ? 1 : 0.6
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.2)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                      title={session 
                        ? `${date} - ${session.difficulty.toUpperCase()} session (${session.successRate}% success, ${session.cardsStudied} cards)`
                        : `Click to add study session for ${date}`
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#7c4dff'
          }}>
            {studySessions.length}
          </div>
          <div style={{
            color: '#bbb',
            marginTop: '5px'
          }}>
            Total Sessions
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#7c4dff'
          }}>
            {decks.length}
          </div>
          <div style={{
            color: '#bbb',
            marginTop: '5px'
          }}>
            Active Decks
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#7c4dff'
          }}>
            {averageSuccessRate}%
          </div>
          <div style={{
            color: '#bbb',
            marginTop: '5px'
          }}>
            Avg Success Rate
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#7c4dff'
          }}>
            {decks.reduce((sum, deck) => sum + deck.totalCards, 0)}
          </div>
          <div style={{
            color: '#bbb',
            marginTop: '5px'
          }}>
            Total Cards
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;