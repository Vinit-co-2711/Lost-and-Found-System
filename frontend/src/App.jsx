import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import StatusTabs from './components/Dashboard/StatusTabs';
import ItemList from './components/Dashboard/ItemList';
import LogItemModal from './components/Forms/LogItemModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { itemApi } from './api/itemApi';
import { Plus, AlertCircle, RefreshCw, BarChart2, CheckCircle2, RotateCcw, CircleDot, ShieldAlert, Sparkles, UserPlus, LogIn } from 'lucide-react';

function DashboardContent() {
  const { user, isStaffOrAdmin } = useAuth();
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch items from API
  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);
    
    setError('');
    try {
      const data = await itemApi.fetchItems('ALL');
      setItems(data);
    } catch (err) {
      setError(err.message || 'Could not connect to the backend server. Please verify Spring Boot is online on port 8080.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter items based on activeTab
  useEffect(() => {
    if (activeTab === 'ALL') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.status === activeTab));
    }
  }, [activeTab, items]);

  // Handle status update (restricted to STAFF/ADMIN)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const updatedItem = await itemApi.updateItemStatus(id, newStatus);
      setItems(prevItems => 
        prevItems.map(item => item.id === id ? updatedItem : item)
      );
    } catch (err) {
      alert(`Access Denied: ${err.message}`);
    }
  };

  // Handle saving new item
  const handleSaveItem = async (itemData, file) => {
    const newItem = await itemApi.createItem(itemData, file);
    setItems(prevItems => [newItem, ...prevItems]);
  };

  // Compute metric stats
  const stats = {
    all: items.length,
    lost: items.filter(i => i.status === 'LOST').length,
    found: items.filter(i => i.status === 'FOUND').length,
    claimed: items.filter(i => i.status === 'CLAIMED').length,
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-container main-content">
        
        {/* Header Hero */}
        <div className="header-hero">
          <div className="header-hero-left">
            <h1 className="header-title">
              Lost & Found Command Center
            </h1>
            <p className="header-description">
              Secure Role-Based access portal. Log client inquiries, transition items through recovery phases, and manage resolutions. Mapped audits for security compliance.
            </p>
          </div>

          <div className="header-hero-right">
            <button
              onClick={() => loadData(true)}
              disabled={loading || refreshing}
              className="btn-icon-only"
              title="Sync Database"
            >
              <RefreshCw 
                className={refreshing ? 'spinner' : ''} 
                style={{ width: '15px', height: '15px', color: refreshing ? 'var(--status-found)' : 'inherit' }} 
              />
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>Log Item</span>
            </button>
          </div>
        </div>

        {/* Metric Grid Widgets */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon-box" style={{ background: '#f1f5f9', color: '#475569' }}>
              <BarChart2 style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="stats-info-box">
              <span className="stats-label">Total Logged</span>
              <span className="stats-value">{stats.all}</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon-box" style={{ background: 'var(--status-lost-bg)', color: 'var(--status-lost)' }}>
              <RotateCcw style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="stats-info-box">
              <span className="stats-label">Active Lost</span>
              <span className="stats-value" style={{ color: 'var(--status-lost)' }}>{stats.lost}</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon-box" style={{ background: 'var(--status-found-bg)', color: 'var(--status-found)' }}>
              <CircleDot style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="stats-info-box">
              <span className="stats-label">Active Found</span>
              <span className="stats-value" style={{ color: 'var(--status-found)' }}>{stats.found}</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon-box" style={{ background: 'var(--status-claimed-bg)', color: 'var(--status-claimed)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="stats-info-box">
              <span className="stats-label">Resolved Claimed</span>
              <span className="stats-value" style={{ color: 'var(--status-claimed)' }}>{stats.claimed}</span>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{error}</span>
            <button 
              type="button" 
              onClick={() => loadData()} 
              className="error-banner-right"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Filters */}
        <StatusTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          counts={stats} 
        />

        {/* Grid List */}
        {loading ? (
          <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', gap: '12px' }}>
            <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fetching secure portal logs...</span>
          </div>
        ) : (
          <ItemList 
            items={filteredItems} 
            onStatusUpdate={handleStatusUpdate} 
            onOpenModal={() => setIsModalOpen(true)}
          />
        )}

      </main>

      {/* Log Form Slide-over Modal */}
      <LogItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveItem}
      />
    </div>
  );
}

function AuthScreen() {
  const { login, register } = useAuth();
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STAFF'); // Default to STAFF to make testing staff features easy!
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLoginView) {
        await login(username, password);
      } else {
        await register(username, email, password, role);
        setSuccess('Account registered successfully! You can now log in.');
        setIsLoginView(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="modal-container" style={{ animation: 'none', maxWidth: '400px', boxShadow: '0 20px 40px -15px rgba(15,23,42,0.1)' }}>
        
        {/* Auth Header */}
        <div className="modal-header" style={{ padding: '24px 24px 16px' }}>
          <div>
            <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert style={{ color: 'var(--accent-primary)', width: '22px', height: '22px' }} />
              LostFound
            </h2>
            <p className="modal-subtitle">Hospitality & Community Command Hub</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <button
            onClick={() => { setIsLoginView(true); setError(''); setSuccess(''); }}
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: 'none', 
              background: isLoginView ? 'var(--bg-secondary)' : 'transparent',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: isLoginView ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              borderBottom: isLoginView ? '2px solid var(--accent-primary)' : 'none'
            }}
          >
            <LogIn style={{ width: '13px', height: '13px', verticalAlign: 'middle', marginRight: '4px' }} />
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginView(false); setError(''); setSuccess(''); }}
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: 'none', 
              background: !isLoginView ? 'var(--bg-secondary)' : 'transparent',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: !isLoginView ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              borderBottom: !isLoginView ? '2px solid var(--accent-primary)' : 'none'
            }}
          >
            <UserPlus style={{ width: '13px', height: '13px', verticalAlign: 'middle', marginRight: '4px' }} />
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAuthSubmit} className="modal-form" style={{ padding: '24px' }}>
          {error && (
            <div className="error-banner" style={{ margin: '0' }}>
              <AlertCircle style={{ width: '15px', height: '15px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="error-banner" style={{ margin: '0', background: 'var(--status-found-bg)', borderColor: 'var(--status-found-border)', color: 'var(--status-found)' }}>
              <CheckCircle2 style={{ width: '15px', height: '15px', flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <div className="form-input-wrapper">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="vinit_admin"
              className="form-input"
              required
            />
          </div>

          {!isLoginView && (
            <div className="form-input-wrapper">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vinit@hotel.com"
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-input-wrapper">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          {!isLoginView && (
            <div className="form-input-wrapper">
              <label className="form-label">Select Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
              >
                <option value="CUSTOMER">Customer (Read Only, Log LOST Items)</option>
                <option value="STAFF">Hotel Staff (Update Statuses, Log FOUND Items)</option>
                <option value="ADMIN">Hotel Admin (Manage Statuses, System Overrides)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
            ) : isLoginView ? (
              'Authenticate Session'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

function MainAppGate() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Initialising authentication credentials...</span>
      </div>
    );
  }

  return isAuthenticated ? <DashboardContent /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppGate />
    </AuthProvider>
  );
}
