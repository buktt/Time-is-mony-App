import { useTimer } from '../hooks/useTimer';
import { formatElapsedTime } from '../utils/calculations';
import './TimerButton.css';

interface TimerButtonProps {
  isActive: boolean;
  startTime: number | null;
  onStart: () => void;
  onFinish: () => void;
  disabled?: boolean;
}

export const TimerButton = ({ 
  isActive, 
  startTime, 
  onStart, 
  onFinish,
  disabled 
}: TimerButtonProps) => {
  const elapsed = useTimer(startTime);

  return (
    <div className="timer-button-container">
      {isActive && (
        <div className="timer-display">
          <span className="timer-value">{formatElapsedTime(elapsed)}</span>
          <span className="timer-label">elapsed</span>
        </div>
      )}
      
      <button
        className={`timer-button ${isActive ? 'finish' : 'start'}`}
        onClick={isActive ? onFinish : onStart}
        disabled={disabled}
      >
        <span className="timer-button-icon">
          {isActive ? '⏹' : '▶'}
        </span>
        <span className="timer-button-text">
          {isActive ? 'Finish' : 'Start'}
        </span>
      </button>

      {isActive && (
        <div className="pulse-ring" />
      )}
    </div>
  );
};

