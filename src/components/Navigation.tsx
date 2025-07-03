// components/Navigation.tsx - Updated with user menu and logout
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  lastLoginAt: Date;
  createdAt: Date;
}

interface NavigationProps {
  currentUser?: User | null;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentUser,
  onLogout 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="nav">
      <div className="logo">NebuLearn</div>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>Home</NavLink>
        <NavLink to="/decks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Decks</NavLink>
        <NavLink to="/progress" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Progress</NavLink>
      </div>

      {/* User Menu */}
      {currentUser && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '25px',
              color: 'white',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #7c4dff, #3f51b5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            {currentUser.username}
            <span style={{ 
              fontSize: '10px', 
              transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </span>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 999
                }}
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Dropdown Menu */}
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 0',
                minWidth: '200px',
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                {/* User Info */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {currentUser.username}
                  </div>
                  <div style={{
                    color: '#bbb',
                    fontSize: '12px'
                  }}>
                    {currentUser.email}
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '4px 0' }}>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // You can add profile/settings functionality here
                      alert('Profile settings coming soon!');
                    }}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '8px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    ⚙️ Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // You can add help/support functionality here
                      alert('Help & Support coming soon!');
                    }}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '8px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    ❓ Help
                  </button>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    margin: '8px 0'
                  }} />

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: '#ff6b6b',
                      padding: '8px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;