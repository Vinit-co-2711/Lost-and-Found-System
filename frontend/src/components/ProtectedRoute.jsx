import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading credentials...</span>
      </div>
    );
  }

  // Redirect to sign in if session is invalid
  if (!isAuthenticated) {
    // We render a clean inline login trigger state or fallback.
    // For React Router setups, you would redirect to="/login",
    // since we coordinate state-based views directly in App.jsx,
    // we communicate authentication prompts or fallback states.
    return (
      <div className="empty-container animate-fade-in" style={{ marginTop: '80px' }}>
        <h3 className="empty-title">Authentication Required</h3>
        <p className="empty-text">Please sign in to your staff or community account to access this section.</p>
      </div>
    );
  }

  // Check if role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="empty-container animate-fade-in" style={{ marginTop: '80px', border: '1px solid #fee2e2' }}>
        <h3 className="empty-title" style={{ color: '#ef4444' }}>Access Denied</h3>
        <p className="empty-text">Your account role ({user.role}) is not authorized to access this administration tool.</p>
      </div>
    );
  }

  return children;
}
