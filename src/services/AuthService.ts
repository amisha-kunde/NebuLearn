// services/AuthService.ts - localStorage Implementation
export interface User {
    id: string;
    username: string;
    email: string;
    lastLoginAt: Date;
    createdAt: Date;
  }
  
  export interface UserSession {
    user: User;
    sessionId: string;
    expiresAt: Date;
    lastActivity: Date;
  }
  
  export interface CachedData {
    decks: any[];
    studySessions: any[];
    lastPage: 'home' | 'decks' | 'progress';
    cacheTimestamp: Date;
  }
  
  export interface DeckStatus {
    deckId: string;
    status: 'green' | 'orange' | 'red';
    lastStudied?: Date;
    successRate: number;
  }
  
  class AuthService {
    private currentSession: UserSession | null = null;
    
    // localStorage keys
    private readonly SESSION_KEY = 'nebulearn_session';
    private readonly CACHE_KEY_PREFIX = 'nebulearn_cache_';
    private readonly LAST_PAGE_KEY = 'nebulearn_last_page';
    private readonly DECK_STATUSES_KEY = 'nebulearn_deck_statuses_';
    
    // In a real app, replace this with your actual database/API
    private mockDatabase = new Map<string, User>();
    
    // Session timeout in milliseconds (30 minutes)
    private readonly SESSION_TIMEOUT = 30 * 60 * 1000;
    
    // Cache timeout in milliseconds (24 hours)
    private readonly CACHE_TIMEOUT = 24 * 60 * 60 * 1000;
  
    constructor() {
      this.initializeMockUsers();
      this.restoreSession();
    }
  
    private initializeMockUsers() {
      const mockUsers: User[] = [
        {
          id: 'user1',
          username: 'demo_user',
          email: 'demo@nebulearn.com',
          lastLoginAt: new Date(),
          createdAt: new Date('2025-01-01')
        },
        {
          id: 'user2',
          username: 'student1',
          email: 'student@nebulearn.com',
          lastLoginAt: new Date(),
          createdAt: new Date('2025-02-01')
        }
      ];
  
      mockUsers.forEach(user => {
        this.mockDatabase.set(user.username, user);
      });
    }
  
    // Login method
    async login(username: string, password: string): Promise<{ success: boolean; session?: UserSession; error?: string }> {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user exists in "database"
        const user = this.mockDatabase.get(username);
        if (!user) {
          return { success: false, error: 'Invalid username or password' };
        }
  
        // In a real app, you'd verify password hash here
        if (password !== 'demo123') {
          return { success: false, error: 'Invalid username or password' };
        }
  
        // Update last login
        user.lastLoginAt = new Date();
        this.mockDatabase.set(username, user);
  
        // Create session
        const session: UserSession = {
          user,
          sessionId: this.generateSessionId(),
          expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT),
          lastActivity: new Date()
        };
  
        this.currentSession = session;
        this.saveSession(session);
  
        return { success: true, session };
      } catch (error) {
        return { success: false, error: 'Login failed. Please try again.' };
      }
    }
  
    // Check if user is authenticated
    isAuthenticated(): boolean {
      if (!this.currentSession) return false;
      
      // Check if session has expired
      if (new Date() > this.currentSession.expiresAt) {
        this.logout();
        return false;
      }
  
      // Update last activity
      this.currentSession.lastActivity = new Date();
      this.saveSession(this.currentSession);
      
      return true;
    }
  
    // Get current user
    getCurrentUser(): User | null {
      return this.currentSession?.user || null;
    }
  
    // Logout
    logout(): void {
      if (this.currentSession) {
        this.clearSession();
      }
      this.currentSession = null;
    }
  
    // Cache user data
    cacheUserData(userId: string, data: Omit<CachedData, 'cacheTimestamp'>): void {
      const cachedData: CachedData = {
        ...data,
        cacheTimestamp: new Date()
      };
      
      this.saveCacheToStorage(userId, cachedData);
    }
  
    // Get cached data
    getCachedData(userId: string): CachedData | null {
      const cached = this.loadCacheFromStorage(userId);
      
      if (!cached) return null;
  
      // Check if cache has expired
      const now = new Date();
      const cacheAge = now.getTime() - new Date(cached.cacheTimestamp).getTime();
      
      if (cacheAge > this.CACHE_TIMEOUT) {
        this.clearCache(userId);
        return null;
      }
  
      return cached;
    }
  
    // Load data (from cache or database)
    async loadUserData(userId: string): Promise<CachedData> {
      // Try cache first
      const cachedData = this.getCachedData(userId);
      if (cachedData) {
        console.log('✅ Loading from cache...');
        
        // Also restore the last page they were on
        const lastPage = this.getLastPage();
        if (lastPage) {
          cachedData.lastPage = lastPage;
        }
        
        return cachedData;
      }
  
      console.log('🔄 Loading from database...');
      // Simulate database call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data - in real app, this would come from your database/API
      const mockData: CachedData = {
        decks: [
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
        ],
        studySessions: [
          { deckId: 'deck_1', deckName: 'TypeScript Basics', date: '2025-06-01', difficulty: 'hard', cardsStudied: 10, successRate: 60 },
          { deckId: 'deck_1', deckName: 'TypeScript Basics', date: '2025-06-03', difficulty: 'hard', cardsStudied: 15, successRate: 65 },
          { deckId: 'deck_1', deckName: 'TypeScript Basics', date: '2025-06-05', difficulty: 'medium', cardsStudied: 12, successRate: 75 },
        ],
        lastPage: 'home',
        cacheTimestamp: new Date()
      };
  
      // Cache the data
      this.cacheUserData(userId, mockData);
      
      return mockData;
    }
  
    // Save current page for restoration
    saveLastPage(page: 'home' | 'decks' | 'progress'): void {
      try {
        localStorage.setItem(this.LAST_PAGE_KEY, page);
      } catch (error) {
        console.warn('Failed to save last page to localStorage:', error);
      }
    }
  
    // Get last page
    getLastPage(): 'home' | 'decks' | 'progress' | null {
      try {
        const lastPage = localStorage.getItem(this.LAST_PAGE_KEY);
        return lastPage as 'home' | 'decks' | 'progress' | null;
      } catch (error) {
        console.warn('Failed to load last page from localStorage:', error);
        return null;
      }
    }
  
    // Update deck statuses based on study sessions
    updateDeckStatuses(userId: string, decks: any[], studySessions: any[]): void {
      const statuses: DeckStatus[] = decks.map(deck => {
        const deckSessions = studySessions.filter(session => session.deckId === deck.id);
        
        if (deckSessions.length === 0) {
          return {
            deckId: deck.id,
            status: 'red',
            successRate: 0
          };
        }
  
        // Calculate average success rate
        const avgSuccessRate = deckSessions.reduce((sum, session) => sum + session.successRate, 0) / deckSessions.length;
        
        // Get most recent session
        const sortedSessions = deckSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const lastStudied = new Date(sortedSessions[0].date);
        
        // Determine status based on success rate and recency
        const daysSinceLastStudy = (Date.now() - lastStudied.getTime()) / (1000 * 60 * 60 * 24);
        
        let status: 'green' | 'orange' | 'red';
        if (avgSuccessRate >= 80 && daysSinceLastStudy <= 7) {
          status = 'green';
        } else if (avgSuccessRate >= 60 && daysSinceLastStudy <= 14) {
          status = 'orange';
        } else {
          status = 'red';
        }
  
        return {
          deckId: deck.id,
          status,
          lastStudied,
          successRate: avgSuccessRate
        };
      });
  
      this.saveDeckStatusesToStorage(userId, statuses);
    }
  
    // Get deck statuses
    getDeckStatuses(userId: string): DeckStatus[] {
      return this.loadDeckStatusesFromStorage(userId);
    }
  
    // Clear all user data (useful for logout or data reset)
    clearAllUserData(userId: string): void {
      this.clearSession();
      this.clearCache(userId);
      this.clearDeckStatuses(userId);
      localStorage.removeItem(this.LAST_PAGE_KEY);
    }
  
    // Private helper methods for localStorage operations
    private generateSessionId(): string {
      return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
  
    private saveSession(session: UserSession): void {
      try {
        // Convert dates to strings for JSON serialization
        const sessionToSave = {
          ...session,
          expiresAt: session.expiresAt.toISOString(),
          lastActivity: session.lastActivity.toISOString(),
          user: {
            ...session.user,
            lastLoginAt: session.user.lastLoginAt.toISOString(),
            createdAt: session.user.createdAt.toISOString()
          }
        };
        
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionToSave));
        console.log('✅ Session saved to localStorage');
      } catch (error) {
        console.error('❌ Failed to save session to localStorage:', error);
      }
    }
  
    private clearSession(): void {
      try {
        localStorage.removeItem(this.SESSION_KEY);
        console.log('✅ Session cleared from localStorage');
      } catch (error) {
        console.error('❌ Failed to clear session from localStorage:', error);
      }
    }
  
    private restoreSession(): void {
      try {
        const saved = localStorage.getItem(this.SESSION_KEY);
        if (saved) {
          const sessionData = JSON.parse(saved);
          
          // Convert string dates back to Date objects
          const session: UserSession = {
            ...sessionData,
            expiresAt: new Date(sessionData.expiresAt),
            lastActivity: new Date(sessionData.lastActivity),
            user: {
              ...sessionData.user,
              lastLoginAt: new Date(sessionData.user.lastLoginAt),
              createdAt: new Date(sessionData.user.createdAt)
            }
          };
          
          // Check if session is still valid
          if (new Date() < session.expiresAt) {
            this.currentSession = session;
            console.log('✅ Session restored from localStorage');
          } else {
            this.clearSession();
            console.log('⚠️ Expired session removed from localStorage');
          }
        }
      } catch (error) {
        console.error('❌ Failed to restore session from localStorage:', error);
        this.clearSession(); // Clear corrupted session data
      }
    }
  
    private saveCacheToStorage(userId: string, data: CachedData): void {
      try {
        // Convert dates to strings for JSON serialization
        const dataToSave = {
          ...data,
          cacheTimestamp: data.cacheTimestamp.toISOString(),
          decks: data.decks.map(deck => ({
            ...deck,
            createdAt: deck.createdAt.toISOString(),
            lastStudied: deck.lastStudied ? deck.lastStudied.toISOString() : undefined
          }))
        };
        
        localStorage.setItem(this.CACHE_KEY_PREFIX + userId, JSON.stringify(dataToSave));
        console.log('✅ Cache saved to localStorage for user:', userId);
      } catch (error) {
        console.error('❌ Failed to save cache to localStorage:', error);
      }
    }
  
    private loadCacheFromStorage(userId: string): CachedData | null {
      try {
        const saved = localStorage.getItem(this.CACHE_KEY_PREFIX + userId);
        if (saved) {
          const cachedData = JSON.parse(saved);
          
          // Convert string dates back to Date objects
          return {
            ...cachedData,
            cacheTimestamp: new Date(cachedData.cacheTimestamp),
            decks: cachedData.decks.map((deck: any) => ({
              ...deck,
              createdAt: new Date(deck.createdAt),
              lastStudied: deck.lastStudied ? new Date(deck.lastStudied) : undefined
            }))
          };
        }
      } catch (error) {
        console.error('❌ Failed to load cache from localStorage:', error);
      }
      return null;
    }
  
    private clearCache(userId: string): void {
      try {
        localStorage.removeItem(this.CACHE_KEY_PREFIX + userId);
        console.log('✅ Cache cleared from localStorage for user:', userId);
      } catch (error) {
        console.error('❌ Failed to clear cache from localStorage:', error);
      }
    }
  
    private saveDeckStatusesToStorage(userId: string, statuses: DeckStatus[]): void {
      try {
        const statusesToSave = statuses.map(status => ({
          ...status,
          lastStudied: status.lastStudied ? status.lastStudied.toISOString() : undefined
        }));
        
        localStorage.setItem(this.DECK_STATUSES_KEY + userId, JSON.stringify(statusesToSave));
        console.log('✅ Deck statuses saved to localStorage for user:', userId);
      } catch (error) {
        console.error('❌ Failed to save deck statuses to localStorage:', error);
      }
    }
  
    private loadDeckStatusesFromStorage(userId: string): DeckStatus[] {
      try {
        const saved = localStorage.getItem(this.DECK_STATUSES_KEY + userId);
        if (saved) {
          const statuses = JSON.parse(saved);
          return statuses.map((status: any) => ({
            ...status,
            lastStudied: status.lastStudied ? new Date(status.lastStudied) : undefined
          }));
        }
      } catch (error) {
        console.error('❌ Failed to load deck statuses from localStorage:', error);
      }
      return [];
    }
  
    private clearDeckStatuses(userId: string): void {
      try {
        localStorage.removeItem(this.DECK_STATUSES_KEY + userId);
        console.log('✅ Deck statuses cleared from localStorage for user:', userId);
      } catch (error) {
        console.error('❌ Failed to clear deck statuses from localStorage:', error);
      }
    }
  }
  
  // Export singleton instance
  export const authService = new AuthService();