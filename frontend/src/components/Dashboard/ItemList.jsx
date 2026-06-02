import React from 'react';
import ItemCard from './ItemCard';
import { PackageOpen, Sparkles } from 'lucide-react';

export default function ItemList({ items, onStatusUpdate, onOpenModal }) {
  if (items.length === 0) {
    return (
      <div className="empty-container animate-fade-in">
        <div className="empty-icon-box">
          <PackageOpen style={{ width: '28px', height: '28px' }} />
        </div>
        
        <h3 className="empty-title">
          No items registered
        </h3>
        
        <p className="empty-text">
          There are currently no items logged matching this status. Make sure the database has records.
        </p>

        <button 
          onClick={onOpenModal}
          className="btn btn-primary"
        >
          <Sparkles style={{ width: '14px', height: '14px' }} />
          Log First Item
        </button>
      </div>
    );
  }

  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onStatusUpdate={onStatusUpdate} 
        />
      ))}
    </div>
  );
}
