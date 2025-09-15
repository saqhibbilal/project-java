// Simple Sidebar Navigation Component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>TrackSpring</h3>
        <p>Welcome, {user?.username}</p>
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          🏠 Dashboard
        </Link>
        
        <Link 
          to="/transactions" 
          className={`nav-item ${isActive('/transactions') ? 'active' : ''}`}
        >
          📊 Transactions
        </Link>
        
        <Link 
          to="/analytics" 
          className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}
        >
          📈 Analytics
        </Link>
        
        
        <Link 
          to="/currency" 
          className={`nav-item ${isActive('/currency') ? 'active' : ''}`}
        >
          💱 Currency
        </Link>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
