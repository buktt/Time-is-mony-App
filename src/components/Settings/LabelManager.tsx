import { useState } from 'react';
import type { CustomLabel } from '../../types';
import { LABEL_COLORS } from '../../types';
import './LabelManager.css';

interface LabelManagerProps {
  labels: CustomLabel[];
  onAddLabel: (name: string, color: string) => void;
  onUpdateLabel: (id: string, name: string, color: string) => void;
  onDeleteLabel: (id: string) => void;
}

export const LabelManager = ({
  labels,
  onAddLabel,
  onUpdateLabel,
  onDeleteLabel,
}: LabelManagerProps) => {
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = () => {
    if (newLabelName.trim()) {
      onAddLabel(newLabelName.trim(), selectedColor);
      setNewLabelName('');
      // Rotate to next color
      const currentIndex = LABEL_COLORS.indexOf(selectedColor);
      setSelectedColor(LABEL_COLORS[(currentIndex + 1) % LABEL_COLORS.length]);
    }
  };

  const startEdit = (label: CustomLabel) => {
    setEditingId(label.id);
    setEditName(label.name);
    setEditColor(label.color);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateLabel(editingId, editName.trim(), editColor);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="label-manager">
      <div className="settings-section">
        <span className="settings-section-title">Add New Label</span>
        
        <input
          type="text"
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
          placeholder="Label name..."
          className="settings-input"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        
        <div className="color-picker">
          {LABEL_COLORS.map((color) => (
            <button
              key={color}
              className={`color-option ${selectedColor === color ? 'selected' : ''}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>

        <button 
          className="add-btn"
          onClick={handleAdd}
          disabled={!newLabelName.trim()}
        >
          + Add Label
        </button>
      </div>

      {labels.length > 0 && (
        <div className="settings-section">
          <span className="settings-section-title">Your Labels</span>
          
          <div className="item-list">
            {labels.map((label) => (
              <div key={label.id} className="item-card">
                {editingId === label.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-colors">
                      {LABEL_COLORS.map((color) => (
                        <button
                          key={color}
                          className={`color-option small ${editColor === color ? 'selected' : ''}`}
                          style={{ background: color }}
                          onClick={() => setEditColor(color)}
                        />
                      ))}
                    </div>
                    <div className="item-card-actions">
                      <button className="icon-btn" onClick={saveEdit}>✓</button>
                      <button className="icon-btn" onClick={cancelEdit}>✕</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span 
                      className="label-color-dot"
                      style={{ background: label.color }}
                    />
                    <div className="item-card-info">
                      <span className="item-card-name">{label.name}</span>
                    </div>
                    <div className="item-card-actions">
                      <button className="icon-btn" onClick={() => startEdit(label)}>✏️</button>
                      <button className="icon-btn delete" onClick={() => onDeleteLabel(label.id)}>🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
