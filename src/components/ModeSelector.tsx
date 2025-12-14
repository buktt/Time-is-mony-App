import type { AppMode } from '../types';
import './ModeSelector.css';

interface ModeSelectorProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  disabled?: boolean;
}

export const ModeSelector = ({ mode, onModeChange, disabled }: ModeSelectorProps) => {
  return (
    <div className="mode-selector">
      <button
        className={`mode-btn ${mode === 'personal' ? 'active' : ''}`}
        onClick={() => onModeChange('personal')}
        disabled={disabled}
      >
        <span className="mode-icon">👤</span>
        <span className="mode-label">Personal</span>
      </button>
      <button
        className={`mode-btn ${mode === 'business' ? 'active' : ''}`}
        onClick={() => onModeChange('business')}
        disabled={disabled}
      >
        <span className="mode-icon">👥</span>
        <span className="mode-label">Business</span>
      </button>
    </div>
  );
};
