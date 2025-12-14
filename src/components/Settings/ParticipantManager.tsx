import { useState } from 'react';
import type { Participant } from '../../types';
import { CURRENCIES } from '../../types';
import './ParticipantManager.css';

interface ParticipantManagerProps {
  participants: Participant[];
  currency: string;
  onAddParticipant: (name: string, rate: number) => void;
  onUpdateParticipant: (id: string, name: string, rate: number) => void;
  onDeleteParticipant: (id: string) => void;
}

export const ParticipantManager = ({
  participants,
  currency,
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant,
}: ParticipantManagerProps) => {
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRate, setEditRate] = useState('');

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || currency;

  const handleAdd = () => {
    if (newName.trim() && newRate) {
      onAddParticipant(newName.trim(), parseFloat(newRate) || 0);
      setNewName('');
      setNewRate('');
    }
  };

  const startEdit = (participant: Participant) => {
    setEditingId(participant.id);
    setEditName(participant.name);
    setEditRate(participant.hourlyRate.toString());
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateParticipant(editingId, editName.trim(), parseFloat(editRate) || 0);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="participant-manager">
      <div className="settings-section">
        <span className="settings-section-title">Add Participant</span>
        
        <div className="participant-form">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name..."
            className="settings-input"
          />
          <div className="rate-field">
            <span className="rate-prefix">{currencySymbol}</span>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="Rate"
              className="settings-input rate"
              min="0"
              step="0.01"
            />
            <span className="rate-suffix">/hr</span>
          </div>
        </div>

        <button 
          className="add-btn"
          onClick={handleAdd}
          disabled={!newName.trim() || !newRate}
        >
          + Add Participant
        </button>
      </div>

      {participants.length > 0 && (
        <div className="settings-section">
          <span className="settings-section-title">Participants ({participants.length})</span>
          
          <div className="item-list">
            {participants.map((participant) => (
              <div key={participant.id} className="item-card">
                {editingId === participant.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-rate">
                      <span>{currencySymbol}</span>
                      <input
                        type="number"
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                        className="edit-input small"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="item-card-actions">
                      <button className="icon-btn" onClick={saveEdit}>✓</button>
                      <button className="icon-btn" onClick={cancelEdit}>✕</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="participant-avatar">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="item-card-info">
                      <span className="item-card-name">{participant.name}</span>
                      <span className="item-card-meta">
                        {currencySymbol}{participant.hourlyRate}/hr
                      </span>
                    </div>
                    <div className="item-card-actions">
                      <button className="icon-btn" onClick={() => startEdit(participant)}>✏️</button>
                      <button className="icon-btn delete" onClick={() => onDeleteParticipant(participant.id)}>🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {participants.length === 0 && (
        <div className="empty-participants">
          <p>No participants yet</p>
          <span>Add team members to track their time and costs</span>
        </div>
      )}
    </div>
  );
};
