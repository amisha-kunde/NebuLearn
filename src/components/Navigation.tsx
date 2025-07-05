// components/Navigation.tsx - Simplified version without user menu for now
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="nav">
      <div className="logo">NebuLearn</div>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
          Home
        </NavLink>
        <NavLink to="/decks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Decks
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Progress
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;