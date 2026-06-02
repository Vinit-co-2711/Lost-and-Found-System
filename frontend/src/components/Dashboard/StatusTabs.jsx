import React from 'react';
import { CircleDot, Inbox, CheckCircle2, RotateCcw } from 'lucide-react';

export default function StatusTabs({ activeTab, setActiveTab, counts = {} }) {
  const tabs = [
    { id: 'ALL', label: 'All Items', icon: Inbox, count: counts.all || 0 },
    { id: 'LOST', label: 'Lost', icon: RotateCcw, count: counts.lost || 0 },
    { id: 'FOUND', label: 'Found', icon: CircleDot, count: counts.found || 0 },
    { id: 'CLAIMED', label: 'Claimed', icon: CheckCircle2, count: counts.claimed || 0 },
  ];

  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon style={{ width: '15px', height: '15px' }} />
              <span>{tab.label}</span>
              <span className="tab-counter">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
