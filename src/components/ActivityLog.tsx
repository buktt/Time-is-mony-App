import { useState, useMemo } from 'react';
import type { ActivityEntry, CustomLabel } from '../types';
import { formatDuration, formatAmount } from '../utils/calculations';
import './ActivityLog.css';

interface ActivityLogProps {
  activities: ActivityEntry[];
  labels: CustomLabel[];
  onDelete: (id: string) => void;
}

export const ActivityLog = ({ activities, labels, onDelete }: ActivityLogProps) => {
  const [filterLabelId, setFilterLabelId] = useState<string | 'all'>('all');

  const filteredActivities = useMemo(() => {
    if (filterLabelId === 'all') return activities;
    if (filterLabelId === 'none') return activities.filter((a) => !a.labelId);
    return activities.filter((a) => a.labelId === filterLabelId);
  }, [activities, filterLabelId]);

  const labelSums = useMemo(() => {
    const sums: Record<string, { total: number; currency: string; count: number }> = {};
    
    activities.forEach((activity) => {
      const key = activity.labelId || 'unlabeled';
      if (!sums[key]) {
        sums[key] = { total: 0, currency: activity.currency, count: 0 };
      }
      sums[key].total += activity.amount;
      sums[key].count += 1;
    });
    
    return sums;
  }, [activities]);

  const getLabelById = (id: string | null) => {
    if (!id) return null;
    return labels.find((l) => l.id === id);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (activities.length === 0) {
    return (
      <div className="activity-log empty">
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No activities yet</p>
          <span className="empty-hint">Start tracking to see your history</span>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-log">
      <div className="log-header">
        <h2>Activity Log</h2>
        
        {labels.length > 0 && (
          <div className="filter-bar">
            <button
              className={`filter-btn ${filterLabelId === 'all' ? 'active' : ''}`}
              onClick={() => setFilterLabelId('all')}
            >
              All
            </button>
            {labels.map((label) => (
              <button
                key={label.id}
                className={`filter-btn ${filterLabelId === label.id ? 'active' : ''}`}
                onClick={() => setFilterLabelId(label.id)}
                style={{ '--label-color': label.color } as React.CSSProperties}
              >
                <span className="filter-dot" />
                {label.name}
                {labelSums[label.id] && (
                  <span className="filter-sum">
                    {formatAmount(labelSums[label.id].total, labelSums[label.id].currency)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {labels.length > 0 && (
        <div className="label-summaries">
          {labels.map((label) => {
            const sum = labelSums[label.id];
            if (!sum) return null;
            return (
              <div 
                key={label.id} 
                className="summary-card"
                style={{ '--label-color': label.color } as React.CSSProperties}
              >
                <span className="summary-label">{label.name}</span>
                <span className="summary-amount">
                  {formatAmount(sum.total, sum.currency)}
                </span>
                <span className="summary-count">{sum.count} activities</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="activities-list">
        {filteredActivities.map((activity) => {
          const label = getLabelById(activity.labelId);
          return (
            <div key={activity.id} className="activity-entry">
              <div className="entry-main">
                <div className="entry-left">
                  <span className="entry-name">{activity.activityName}</span>
                  <div className="entry-meta">
                    <span className="entry-date">{formatDate(activity.startTime)}</span>
                    <span className="entry-time">
                      {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                    </span>
                    {activity.participantNames && activity.participantNames.length > 0 && (
                      <span className="entry-participant">👤 {activity.participantNames.join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="entry-right">
                  <span className="entry-amount">
                    {formatAmount(activity.amount, activity.currency)}
                  </span>
                  <span className="entry-duration">
                    {formatDuration(activity.durationMinutes)}
                  </span>
                </div>
              </div>
              
              <div className="entry-footer">
                {label && (
                  <span 
                    className="entry-label"
                    style={{ '--label-color': label.color } as React.CSSProperties}
                  >
                    <span className="label-dot" />
                    {label.name}
                  </span>
                )}
                <button
                  className="delete-btn"
                  onClick={() => onDelete(activity.id)}
                  aria-label="Delete activity"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
