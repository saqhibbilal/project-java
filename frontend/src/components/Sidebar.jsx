// Collapsible Sidebar Navigation Component
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          <span className="toggle-icon">{isCollapsed ? '→' : '←'}</span>
        </div>
        {!isCollapsed && (
          <>
            <h3>TrackSpring</h3>
            <p>Welcome, {user?.username}</p>
          </>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          title={isCollapsed ? 'Dashboard' : ''}
        >
          <span className="nav-icon">🏠</span>
          {!isCollapsed && <span className="nav-text">Dashboard</span>}
        </Link>
        
        <Link 
          to="/transactions" 
          className={`nav-item ${isActive('/transactions') ? 'active' : ''}`}
          title={isCollapsed ? 'Transactions' : ''}
        >
          <span className="nav-icon">📊</span>
          {!isCollapsed && <span className="nav-text">Transactions</span>}
        </Link>
        
        <Link 
          to="/analytics" 
          className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}
          title={isCollapsed ? 'Analytics' : ''}
        >
          <span className="nav-icon">📈</span>
          {!isCollapsed && <span className="nav-text">Analytics</span>}
        </Link>
        
        <Link 
          to="/currency" 
          className={`nav-item ${isActive('/currency') ? 'active' : ''}`}
          title={isCollapsed ? 'Currency' : ''}
        >
          <span className="nav-icon">💱</span>
          {!isCollapsed && <span className="nav-text">Currency</span>}
        </Link>
        
        <Link 
          to="/calculator" 
          className={`nav-item ${isActive('/calculator') ? 'active' : ''}`}
          title={isCollapsed ? 'Calculator' : ''}
        >
          <span className="nav-icon">🧮</span>
          {!isCollapsed && <span className="nav-text">Calculator</span>}
        </Link>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn" title={isCollapsed ? 'Logout' : ''}>
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span className="nav-text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
