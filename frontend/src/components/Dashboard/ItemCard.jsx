import React from 'react';
import { Calendar, MapPin, Tag, User, Phone, CheckCircle2, CircleDot, RotateCcw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ItemCard({ item, onStatusUpdate }) {
  const { user } = useAuth();
  
  // Verify role permission checks
  const isStaffOrAdmin = user && (user.role === 'STAFF' || user.role === 'ADMIN');

  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LOST':
        return <span className="badge badge-lost"><RotateCcw style={{ width: '11px', height: '11px' }} /> Lost</span>;
      case 'FOUND':
        return <span className="badge badge-found"><CircleDot style={{ width: '11px', height: '11px' }} /> Found</span>;
      case 'CLAIMED':
        return <span className="badge badge-claimed"><CheckCircle2 style={{ width: '11px', height: '11px' }} /> Claimed</span>;
      default:
        return null;
    }
  };

  // Render file uploads from static endpoint (checking both relative proxies or absolute ports)
  const imageUrl = item.imagePath ? `http://localhost:8080/${item.imagePath}` : null;

  return (
    <div className="item-card animate-fade-in">
      
      {/* Item Image / Fallback Placeholder */}
      <div className="card-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.itemName}
            className="card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--text-muted);">
                  <svg style="width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span style="font-size:0.7rem; font-weight:600;">Image Not Found</span>
                </div>
              `;
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <svg style={{ width: '32px', height: '32px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>No Photo Uploaded</span>
          </div>
        )}

        {/* Badge Overlay */}
        <div className="card-badge-overlay">
          {getStatusBadge(item.status)}
        </div>

        {/* Category Overlay */}
        <div className="card-category-overlay">
          <Tag style={{ width: '10px', height: '10px', verticalAlign: 'middle', marginRight: '4px' }} />
          {item.category}
        </div>
      </div>

      {/* Info Content */}
      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{item.itemName}</h3>
          <span className="card-date">
            <Calendar style={{ width: '12px', height: '12px' }} /> {formattedDate}
          </span>
        </div>

        <p className="card-desc">
          {item.description || 'No description provided.'}
        </p>

        <div className="card-meta-list">
          <div className="card-meta-item">
            <MapPin style={{ width: '13px', height: '13px', color: 'var(--text-secondary)' }} />
            <span className="meta-label">Location:</span> 
            <span>{item.location}</span>
          </div>
          
          <div className="card-meta-item">
            <User style={{ width: '13px', height: '13px', color: 'var(--text-secondary)' }} />
            <span className="meta-label">Reported By:</span>
            <span>{item.reportedByUser ? item.reportedByUser.username : 'Anonymous'}</span>
          </div>

          <div className="card-meta-item">
            <Phone style={{ width: '13px', height: '13px', color: 'var(--text-secondary)' }} />
            <span className="meta-label">Contact Info:</span>
            <span>{item.contactInfo}</span>
          </div>
        </div>

        {/* Action Controls for STAFF or ADMIN roles */}
        <div className="card-actions">
          {isStaffOrAdmin ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="actions-label">
                <ShieldCheck style={{ width: '11px', height: '11px', verticalAlign: 'middle', marginRight: '4px', color: 'var(--status-found)' }} />
                Staff Controls
              </span>
              
              {/* Dropdown status update for general changes */}
              <select
                value={item.status}
                onChange={(e) => onStatusUpdate(item.id, e.target.value)}
                className="status-dropdown"
              >
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
                <option value="CLAIMED">Claimed</option>
              </select>

              {/* CRUCIAL: 'Mark as Claimed' button MUST ONLY be visible if user role is STAFF or ADMIN */}
              {item.status !== 'CLAIMED' && (
                <button
                  type="button"
                  onClick={() => onStatusUpdate(item.id, 'CLAIMED')}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '8px 12px', marginTop: '4px' }}
                >
                  Mark as Claimed
                </button>
              )}
            </div>
          ) : (
            <div style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                Status updates managed by front desk staff.
              </span>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
