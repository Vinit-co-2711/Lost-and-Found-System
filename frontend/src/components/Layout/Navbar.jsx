import React from 'react';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return { color: '#ef4444', background: '#fef2f2', border: '#fee2e2' }; // Soft red
      case 'STAFF':
        return { color: 'var(--status-found)', background: 'var(--status-found-bg)', border: 'var(--status-found-border)' }; // Soft emerald
      default:
        return { color: 'var(--status-claimed)', background: 'var(--status-claimed-bg)', border: 'var(--status-claimed-border)' }; // Soft blue
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        
        {/* Left: Brand logo & Server Status */}
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Search className="brand-icon" style={{ width: '18px', height: '18px', color: '#ffffff' }} />
          </div>
          <div className="brand-logo-text">
            LostFound 
            <span className="brand-badge">Secured Portal</span>
          </div>
          
          <div className="divider-vertical" style={{ margin: '0 8px' }}></div>
          
          <div className="navbar-status-indicator">
            <span className="indicator-dot"></span>
            <span>Grand Plaza</span>
          </div>
        </div>

        {/* Right: Authenticated Info & Actions */}
        <div className="navbar-actions">
          <div className="session-info">
            <p className="session-date">{currentDate}</p>
            <p className="session-tag">Active Session</p>
          </div>

          <div className="divider-vertical"></div>

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* User badge display */}
              <div className="user-badge">
                <div className="user-info" style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {user.username}
                  </p>
                  <span 
                    style={{ 
                      fontSize: '0.62rem', 
                      fontWeight: '700', 
                      color: getRoleColor(user.role).color,
                      background: getRoleColor(user.role).background,
                      border: `1px solid ${getRoleColor(user.role).border}`,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '2px'
                    }}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="user-avatar">
                  <User style={{ width: '14px', height: '14px' }} />
                </div>
              </div>

              {/* Logout button */}
              <button 
                onClick={logout}
                className="btn-icon-only" 
                title="Log Out Session"
                style={{ cursor: 'pointer' }}
              >
                <LogOut style={{ width: '14px', height: '14px', color: '#ef4444' }} />
              </button>
            </div>
          ) : (
            <div className="user-badge" style={{ padding: '8px 16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Guest mode</span>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}
