import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LogItemModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const { user } = useAuth();
  const isStaffOrAdmin = user && (user.role === 'STAFF' || user.role === 'ADMIN');

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  // CUSTOMER can only log LOST items initially; STAFF/ADMIN can choose between LOST and FOUND
  const [status, setStatus] = useState(isStaffOrAdmin ? 'FOUND' : 'LOST');
  const [contactInfo, setContactInfo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const categories = [
    'Electronics',
    'Clothing & Accessories',
    'Bags & Luggage',
    'Wallets & Documents',
    'Keys',
    'Jewelry & Watches',
    'Other'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be under 5MB (Security Limit)');
        return;
      }
      setImageFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          setError('File size must be under 5MB (Security Limit)');
          return;
        }
        setImageFile(file);
        setError('');
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Only image files are allowed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !location || !contactInfo) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    // Package fields as required by the backend
    const itemData = {
      itemName,
      description,
      category,
      location,
      status: isStaffOrAdmin ? status : 'LOST', // Force LOST for CUSTOMER role
      contactInfo
    };

    try {
      await onSave(itemData, imageFile);
      // Reset form fields
      setItemName('');
      setCategory('Electronics');
      setLocation('');
      setDescription('');
      setStatus(isStaffOrAdmin ? 'FOUND' : 'LOST');
      setContactInfo('');
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Log Item Report</h2>
            <p className="modal-subtitle">Log new property or client inquiries</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="modal-close-btn"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-banner" style={{ margin: '0' }}>
              <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Item Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 className="form-section-title">Item Details</h3>

            <div className="form-input-wrapper">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Leather Wallet, Reading Glasses"
                className="form-input"
                required
              />
            </div>

            <div className="form-group-grid">
              <div className="form-input-wrapper">
                <label className="form-label">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-input-wrapper">
                <label className="form-label">Initial Status</label>
                {isStaffOrAdmin ? (
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="LOST">Lost</option>
                    <option value="FOUND">Found</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value="LOST"
                    className="form-input"
                    disabled
                    style={{ background: 'var(--bg-accent)', color: 'var(--text-secondary)' }}
                  />
                )}
              </div>
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
                placeholder="Describe branding details, visual signs, serials..."
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Location Found/Lost *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Room 302, Gym, Pool Bar"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Section 2: Photo Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 className="form-section-title">Image Upload</h3>

            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className="file-dropzone"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              
              {imagePreview ? (
                <div className="file-preview-container">
                  <img src={imagePreview} alt="Preview" className="file-preview-img" />
                </div>
              ) : (
                <>
                  <Upload style={{ width: '22px', height: '22px', color: 'var(--text-secondary)' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>Drop image file here, or click to upload</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>PNG, JPG, JPEG or WEBP (Max 5MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 className="form-section-title">Contact & Notifications</h3>

            <div className="form-input-wrapper">
              <label className="form-label">Contact Details *</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g. Room No, Phone No, Email"
                className="form-input"
                required
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
            style={{ minWidth: '110px' }}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" style={{ width: '14px', height: '14px' }} />
                <span>Saving...</span>
              </>
            ) : (
              <span>Log Item</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
