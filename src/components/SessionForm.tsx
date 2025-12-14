import type { CustomLabel, Participant, AppMode } from '../types';
import './SessionForm.css';

interface SessionFormProps {
  mode: AppMode;
  labels: CustomLabel[];
  participants: Participant[];
  activityName: string;
  selectedLabelId: string | null;
  selectedParticipantId: string | undefined;
  onActivityNameChange: (name: string) => void;
  onLabelChange: (labelId: string | null) => void;
  onParticipantChange: (participantId: string | undefined) => void;
  isActive: boolean;
}

export const SessionForm = ({
  mode,
  labels,
  participants,
  activityName,
  selectedLabelId,
  selectedParticipantId,
  onActivityNameChange,
  onLabelChange,
  onParticipantChange,
  isActive,
}: SessionFormProps) => {
  return (
    <div className={`session-form ${isActive ? 'active' : ''}`}>
      <div className="form-group">
        <label htmlFor="activity-name">Activity Name</label>
        <input
          id="activity-name"
          type="text"
          value={activityName}
          onChange={(e) => onActivityNameChange(e.target.value)}
          placeholder="What are you working on?"
          className="form-input"
        />
      </div>

      {mode === 'business' && participants.length > 0 && (
        <div className="form-group">
          <label htmlFor="participant">Participant</label>
          <select
            id="participant"
            value={selectedParticipantId || ''}
            onChange={(e) => onParticipantChange(e.target.value || undefined)}
            className="form-select"
          >
            <option value="">Select participant...</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (${p.hourlyRate}/hr)
              </option>
            ))}
          </select>
        </div>
      )}

      {labels.length > 0 && (
        <div className="form-group">
          <label>Label</label>
          <div className="label-picker">
            <button
              type="button"
              className={`label-option none ${selectedLabelId === null ? 'selected' : ''}`}
              onClick={() => onLabelChange(null)}
            >
              None
            </button>
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                className={`label-option ${selectedLabelId === label.id ? 'selected' : ''}`}
                onClick={() => onLabelChange(label.id)}
                style={{ '--label-color': label.color } as React.CSSProperties}
              >
                <span className="label-dot" />
                {label.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
