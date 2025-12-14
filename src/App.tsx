import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppState } from './hooks/useAppState';
import { useTimer } from './hooks/useTimer';
import type { AppMode, CustomLabel, Participant } from './types';
import { CURRENCIES, LABEL_COLORS } from './types';
import { formatDuration, formatAmount, formatElapsedTime } from './utils/calculations';
import './App.css';

// Icon component for Material Symbols
const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// Morphing Dots Component - Random positions each visit
const MorphingDots = () => {
  const [positions] = useState(() => [
    // Dot 1 - bottom right area
    { bottom: 15 + Math.random() * 10, right: 5 + Math.random() * 15 },
    // Dot 2 - bottom left area  
    { bottom: 5 + Math.random() * 12, left: 5 + Math.random() * 15 },
    // Dot 3 - bottom center area
    { bottom: 2 + Math.random() * 8, left: 35 + Math.random() * 20 },
    // Dot 4 - mid-left area
    { bottom: 10 + Math.random() * 15, left: 20 + Math.random() * 15 },
  ]);

  return (
    <div className="morphing-dots-container">
      <div 
        className="morphing-dot morphing-dot-1" 
        style={{ bottom: `${positions[0].bottom}%`, right: `${positions[0].right}%`, left: 'auto', top: 'auto' }}
      />
      <div 
        className="morphing-dot morphing-dot-2" 
        style={{ bottom: `${positions[1].bottom}%`, left: `${positions[1].left}%`, right: 'auto', top: 'auto' }}
      />
      <div 
        className="morphing-dot morphing-dot-3" 
        style={{ bottom: `${positions[2].bottom}%`, left: `${positions[2].left}%`, right: 'auto', top: 'auto' }}
      />
      <div 
        className="morphing-dot morphing-dot-4" 
        style={{ bottom: `${positions[3].bottom}%`, left: `${positions[3].left}%`, right: 'auto', top: 'auto' }}
      />
    </div>
  );
};

// Bouncing Dots Component - DVD screensaver style
interface Dot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const BouncingDots = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const animationRef = useRef<number | null>(null);
  const dotsRef = useRef<Dot[]>([]);

  const colors = [
    'rgba(19, 127, 236, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(19, 127, 236, 0.6)',
    'rgba(6, 182, 212, 0.7)',
    'rgba(14, 165, 233, 0.75)',
  ];

  const initDots = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const newDots: Dot[] = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: Math.random() * (width - 30),
      y: Math.random() * (height - 30),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 8 + Math.random() * 20,
      color: colors[i % colors.length],
    }));
    
    dotsRef.current = newDots;
    setDots(newDots);
  }, []);

  const animate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    dotsRef.current = dotsRef.current.map(dot => {
      let { x, y, vx, vy } = dot;
      
      x += vx;
      y += vy;
      
      // Bounce off walls
      if (x <= 0 || x >= width - dot.size) {
        vx = -vx;
        x = x <= 0 ? 0 : width - dot.size;
      }
      if (y <= 0 || y >= height - dot.size) {
        vy = -vy;
        y = y <= 0 ? 0 : height - dot.size;
      }
      
      return { ...dot, x, y, vx, vy };
    });
    
    setDots([...dotsRef.current]);
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    initDots();
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initDots, animate]);

  return (
    <div ref={containerRef} className="bouncing-dots-container">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="bouncing-dot"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: dot.color,
          }}
        />
      ))}
    </div>
  );
};

// --- Welcome Screen (First Time Users) ---
const WelcomeScreen = ({ onContinue }: { onContinue: () => void }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-bg-dot welcome-bg-dot-1" />
      <div className="welcome-bg-dot welcome-bg-dot-2" />
      <div className="welcome-bg-dot welcome-bg-dot-3" />
      
      <div className="welcome-content">
        <div className="welcome-icon">💸</div>
        <h1 className="welcome-title">Time is Money</h1>
        <p className="welcome-tagline">See what your time is really worth</p>
        
        <div className="welcome-features">
          <div className="welcome-mode-label">Business Mode</div>
          <div className="welcome-feature">
            <span className="welcome-feature-icon">🏢</span>
            <span className="welcome-feature-text">
              <strong>Too many people in that meeting?</strong> Watch the cost tick up in real-time
            </span>
          </div>
          <div className="welcome-feature">
            <span className="welcome-feature-icon">⏱️</span>
            <span className="welcome-feature-text">
              <strong>Bill by the hour?</strong> Track client time with zero hassle
            </span>
          </div>
          
          <div className="welcome-mode-label" style={{ marginTop: '1rem' }}>Personal Mode</div>
          <div className="welcome-feature">
            <span className="welcome-feature-icon">🚽</span>
            <span className="welcome-feature-text">
              <strong>Bathroom break?</strong> See how much you earned while... away 😜
            </span>
          </div>
        </div>
        
        <button className="welcome-cta" onClick={onContinue}>
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );
};

// --- Mode Selection Screen ---
const ModeSelection = ({ onSelect, onShowWelcome }: { onSelect: (mode: AppMode) => void; onShowWelcome: () => void }) => {
  return (
    <div className="screen animate-fade-in">
      <div className="screen-header">
        <button onClick={onShowWelcome} className="help-button" title="What's this app about?">
          <span>❓</span>
        </button>
        <h2 className="screen-title">Mode Selection</h2>
        <div className="w-10"></div>
      </div>

      <div className="screen-content">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">How are you tracking time today?</h1>
          <p className="text-slate-500">Choose a workspace to start tracking.</p>
        </div>

        <div className="mode-card" onClick={() => onSelect('personal')}>
          <div className="mode-card-icon personal">
            <Icon name="person" />
          </div>
          <div className="mode-card-content">
            <div className="mode-card-header">
              <span className="mode-badge personal"><Icon name="person" /></span>
              <h3 className="mode-card-title">Personal Mode</h3>
            </div>
            <p className="mode-card-desc">Bathroom breaks, hobbies & fun tracking 😜</p>
            <button className="mode-card-action">
              Select <Icon name="arrow_forward" />
            </button>
          </div>
        </div>

        <div className="mode-card" onClick={() => onSelect('business')}>
          <div className="mode-card-icon business">
            <Icon name="business_center" />
          </div>
          <div className="mode-card-content">
            <div className="mode-card-header">
              <span className="mode-badge business"><Icon name="business_center" /></span>
              <h3 className="mode-card-title">Business Mode</h3>
            </div>
            <p className="mode-card-desc">Meetings, client billing & team costs 🏢</p>
            <button className="mode-card-action">
              Select <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Setup Screen ---
const SetupScreen = ({ 
  mode, 
  currency,
  personalRate,
  participants,
  labels,
  onCurrencyChange,
  onPersonalRateChange,
  onAddParticipant,
  onRemoveParticipant,
  onAddLabel,
  onRemoveLabel,
  onContinue,
  onBack
}: {
  mode: AppMode;
  currency: string;
  personalRate: number;
  participants: Participant[];
  labels: CustomLabel[];
  onCurrencyChange: (c: string) => void;
  onPersonalRateChange: (r: number) => void;
  onAddParticipant: (name: string, rate: number) => void;
  onRemoveParticipant: (id: string) => void;
  onAddLabel: (name: string, color: string) => void;
  onRemoveLabel: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRate, setNewMemberRate] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0]);
  const [rateInput, setRateInput] = useState(personalRate.toString());
  const [rateType, setRateType] = useState<'hourly' | 'monthly'>('hourly');
  const [monthlyInput, setMonthlyInput] = useState('');

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || currency;
  const totalHourly = participants.reduce((acc, p) => acc + p.hourlyRate, 0);

  const handleAddMember = () => {
    if (newMemberName && newMemberRate) {
      onAddParticipant(newMemberName, parseFloat(newMemberRate));
      setNewMemberName('');
      setNewMemberRate('');
    }
  };

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      onAddLabel(newLabelName.trim(), selectedColor);
      setNewLabelName('');
      const idx = LABEL_COLORS.indexOf(selectedColor);
      setSelectedColor(LABEL_COLORS[(idx + 1) % LABEL_COLORS.length]);
    }
  };

  const handleRateBlur = () => {
    onPersonalRateChange(parseFloat(rateInput) || 0);
  };

  const handleMonthlyBlur = () => {
    const monthly = parseFloat(monthlyInput) || 0;
    // Assuming 160 working hours per month (40 hrs/week * 4 weeks)
    const hourly = monthly / 160;
    setRateInput(hourly.toFixed(2));
    onPersonalRateChange(hourly);
  };

  return (
    <div className="screen animate-fade-in">
      <div className="screen-header">
        <button onClick={onBack} className="icon-button">
          <Icon name="chevron_left" />
        </button>
        <h2 className="screen-title">{mode === 'personal' ? 'Personal Mode' : 'Business Mode'}</h2>
        <div className="w-10"></div>
      </div>

      <div className="screen-content no-scrollbar pb-24">
        <div className="text-center mb-8">
          <div className={`setup-icon ${mode}`}>
            <Icon name={mode === 'personal' ? 'person' : 'groups'} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">
            {mode === 'personal' ? 'Set Personal Rate' : 'Team Setup'}
          </h1>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            {mode === 'personal' 
              ? 'Define how much your personal time is worth to you.' 
              : "Add team members and their hourly rates."}
          </p>
        </div>

        {/* Currency Selection */}
        <div className="setup-card">
          <div className="setup-card-left">
            <div className="setup-card-icon">
              <Icon name="payments" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Currency</h3>
              <p className="text-xs text-slate-500">Applied globally</p>
            </div>
          </div>
          <select 
            value={currency} 
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="currency-select"
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>

        {mode === 'personal' ? (
          <div className="setup-card flex-col">
            <div className="rate-type-toggle">
              <button 
                className={`rate-type-btn ${rateType === 'hourly' ? 'active' : ''}`}
                onClick={() => setRateType('hourly')}
              >
                Hourly
              </button>
              <button 
                className={`rate-type-btn ${rateType === 'monthly' ? 'active' : ''}`}
                onClick={() => setRateType('monthly')}
              >
                Monthly
              </button>
            </div>
            
            {rateType === 'hourly' ? (
              <>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Hourly Rate</label>
                <div className="rate-input-wrapper">
                  <span className="rate-symbol">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    onBlur={handleRateBlur}
                    placeholder="0.00"
                    className="rate-input"
                  />
                </div>
              </>
            ) : (
              <>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Monthly Salary</label>
                <div className="rate-input-wrapper">
                  <span className="rate-symbol">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={monthlyInput}
                    onChange={(e) => setMonthlyInput(e.target.value)}
                    onBlur={handleMonthlyBlur}
                    placeholder="0.00"
                    className="rate-input"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  ≈ {currencySymbol}{(parseFloat(rateInput) || 0).toFixed(2)}/hr (based on 160 hrs/month)
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="setup-card flex-col">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1.5 block">Name</label>
                  <input 
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Alice Smith"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1.5 block">Rate ({currencySymbol}/hr)</label>
                  <input 
                    type="number"
                    value={newMemberRate}
                    onChange={(e) => setNewMemberRate(e.target.value)}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
                <button onClick={handleAddMember} className="add-member-btn">
                  <Icon name="add" /> Add Member
                </button>
              </div>
            </div>

            {participants.length > 0 && (
              <>
                <div className="total-card">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Total Hourly Cost</span>
                    <div className="text-2xl font-bold">{formatAmount(totalHourly, currency)}<span className="text-base font-normal text-slate-400">/hr</span></div>
                  </div>
                  <div className="total-card-icon">
                    <Icon name="functions" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 uppercase mb-3 px-1">Current Team ({participants.length})</h3>
                <div className="space-y-3">
                  {participants.map((member) => (
                    <div key={member.id} className="member-card">
                      <div className="member-avatar">
                        {member.name.substring(0,2).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                      </div>
                      <div className="member-rate">
                        <span className="font-bold text-slate-900">{formatAmount(member.hourlyRate, currency)}</span>
                        <span className="text-xs text-slate-400">/hr</span>
                      </div>
                      <button onClick={() => onRemoveParticipant(member.id)} className="remove-btn">
                        <Icon name="remove_circle" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Labels Section */}
        <div className="setup-card flex-col mt-6">
          <div className="mb-3">
            <label className="text-sm font-bold text-slate-900 block">Activity Labels</label>
            <p className="text-xs text-slate-500">Create labels to organize and group your activities across all sessions</p>
          </div>
          <input 
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            className="form-input mb-3"
            placeholder="Label name..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
          />
          <div className="color-picker">
            {LABEL_COLORS.map((color) => (
              <button
                key={color}
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <button onClick={handleAddLabel} className="add-member-btn mt-3" disabled={!newLabelName.trim()}>
            <Icon name="add" /> Add Label
          </button>
        </div>

        {labels.length > 0 && (
          <div className="mt-4 space-y-2">
            {labels.map((label) => (
              <div key={label.id} className="label-chip">
                <span className="label-dot" style={{ background: label.color }}></span>
                {label.name}
                <button onClick={() => onRemoveLabel(label.id)} className="label-remove">
                  <Icon name="close" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="screen-footer">
        <button onClick={onContinue} className="primary-btn">
          {mode === 'personal' ? 'Save & Continue' : 'Start Session'}
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  );
};

// --- Tracker Screen ---
const TrackerScreen = ({ 
  mode, 
  currency, 
  personalRate, 
  participants,
  labels,
  activeSession,
  onStart,
  onFinish,
  goToLog,
  goToSettings,
  goToModeSelection
}: {
  mode: AppMode;
  currency: string;
  personalRate: number;
  participants: Participant[];
  labels: CustomLabel[];
  activeSession: { startTime: number; activityName: string; labelId: string | null; participantIds?: string[] } | null;
  onStart: (name: string, labelId: string | null, participantIds?: string[]) => void;
  onFinish: (activityName?: string) => void;
  goToLog: () => void;
  goToSettings: () => void;
  goToModeSelection: () => void;
}) => {
  const [activityName, setActivityName] = useState('');
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const elapsed = useTimer(activeSession?.startTime || null);
  const isTracking = activeSession !== null;

  // Calculate rate based on selected participants in business mode
  const selectedParticipants = participants.filter(p => selectedParticipantIds.includes(p.id));
  const currentHourlyRate = mode === 'personal' 
    ? personalRate 
    : selectedParticipants.reduce((acc, m) => acc + m.hourlyRate, 0);

  const toggleParticipant = (id: string) => {
    setSelectedParticipantIds(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const currentEarnings = (elapsed / 1000 / 3600) * currentHourlyRate;
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || currency;

  const handleStart = () => {
    if (mode === 'personal' && personalRate === 0) {
      alert('Please set your hourly rate first');
      goToSettings();
      return;
    }
    if (mode === 'business' && participants.length === 0) {
      alert('Please add team members first');
      goToSettings();
      return;
    }
    if (mode === 'business' && selectedParticipantIds.length === 0) {
      alert('Please select at least one participant');
      return;
    }
    onStart(
      activityName || 'Untitled Activity', 
      selectedLabelId,
      mode === 'business' ? selectedParticipantIds : undefined
    );
  };

  const handleFinish = () => {
    // If no activity name was entered, prompt for one
    if (!activeSession?.activityName || activeSession.activityName === 'Untitled Activity') {
      const name = prompt('What were you working on?', '');
      if (name && name.trim()) {
        // Update the session name before finishing
        onFinish(name.trim());
      } else {
        onFinish();
      }
    } else {
      onFinish();
    }
    setActivityName('');
    setSelectedLabelId(null);
    setSelectedParticipantIds([]);
  };

  return (
    <div className="screen animate-fade-in">
      <header className="tracker-header">
        <button onClick={goToSettings} className="icon-button">
          <Icon name="settings" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="screen-title">Activity Tracker</h2>
          <button 
            onClick={isTracking ? undefined : goToModeSelection} 
            className={`mode-tag ${mode} ${!isTracking ? 'clickable' : ''}`}
            disabled={isTracking}
          >
            {mode === 'personal' ? 'Personal' : 'Business'} Mode
            {!isTracking && <Icon name="swap_horiz" className="mode-switch-icon" />}
          </button>
        </div>
        <button onClick={goToLog} className="icon-button">
          <Icon name="history" />
        </button>
      </header>

      <main className="tracker-content">
        {!isTracking && (
          <>
            <BouncingDots />
            <MorphingDots />
          </>
        )}
        <div className="tracker-display">
          <div className="timer-display">
            <Icon name="timer" />
            <span className="timer-value">{formatElapsedTime(elapsed)}</span>
          </div>
          
          <h1 className="earnings-display">
            {currencySymbol}{currentEarnings.toFixed(2)}
          </h1>
        </div>

        {!isTracking ? (
          <>
            <div className="activity-input-wrapper">
              <Icon name="edit_note" className="activity-input-icon" />
              <input 
                type="text" 
                className="activity-input" 
                placeholder="What are we tracking?"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
            </div>

            {/* Participant selector for Business mode */}
            {mode === 'business' && participants.length > 0 && (
              <div className="participant-selector">
                <p className="selector-label">Select Participants:</p>
                <div className="participant-chips">
                  {participants.map((participant) => (
                    <button
                      key={participant.id}
                      className={`participant-chip ${selectedParticipantIds.includes(participant.id) ? 'selected' : ''}`}
                      onClick={() => toggleParticipant(participant.id)}
                    >
                      <span className="participant-chip-avatar">
                        {participant.name.substring(0, 2).toUpperCase()}
                      </span>
                      <span className="participant-chip-name">{participant.name}</span>
                      <span className="participant-chip-rate">{formatAmount(participant.hourlyRate, currency)}/hr</span>
                      {selectedParticipantIds.includes(participant.id) && (
                        <Icon name="check_circle" className="participant-chip-check" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedParticipantIds.length > 0 && (
                  <p className="selected-count">
                    {selectedParticipantIds.length} selected • Total: {formatAmount(currentHourlyRate, currency)}/hr
                  </p>
                )}
              </div>
            )}

            {/* Label selector */}
            {labels.length > 0 && (
              <div className="label-selector">
                <button 
                  className={`label-option-btn ${selectedLabelId === null ? 'selected' : ''}`}
                  onClick={() => setSelectedLabelId(null)}
                >
                  None
                </button>
                {labels.map((label) => (
                  <button
                    key={label.id}
                    className={`label-option-btn ${selectedLabelId === label.id ? 'selected' : ''}`}
                    onClick={() => setSelectedLabelId(label.id)}
                    style={{ '--label-color': label.color } as React.CSSProperties}
                  >
                    <span className="label-dot" style={{ background: label.color }}></span>
                    {label.name}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="tracking-indicator">
            <p className="text-slate-500 font-medium text-lg">
              Tracking: <span className="text-slate-900 font-bold">{activeSession?.activityName || 'Untitled Activity'}</span>
            </p>
            {mode === 'business' && activeSession?.participantIds && activeSession.participantIds.length > 0 && (
              <p className="text-slate-400 text-sm mt-1">
                {activeSession.participantIds.length} participant{activeSession.participantIds.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        <button 
          onClick={isTracking ? handleFinish : handleStart}
          className={`tracker-btn ${isTracking ? 'finish' : 'start'}`}
        >
          <Icon name={isTracking ? 'stop_circle' : 'play_arrow'} />
          <span>{isTracking ? 'Finish Session' : 'Start Tracking'}</span>
        </button>

        {mode === 'business' && isTracking && participants.length > 0 && (
          <div className="participants-indicator">
            <p className="text-xs font-bold text-slate-400 uppercase mb-3">Active Participants</p>
            <div className="participants-avatars">
              {participants.slice(0, 4).map((m) => (
                <div key={m.id} className="participant-avatar" title={m.name}>
                  {m.name.substring(0,2).toUpperCase()}
                </div>
              ))}
              {participants.length > 4 && (
                <div className="participant-avatar more">+{participants.length - 4}</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Activity Log Screen ---
const ActivityLogScreen = ({ 
  activities, 
  labels, 
  currency, 
  onBack, 
  onDelete,
  onUpdateLabel
}: {
  activities: any[];
  labels: CustomLabel[];
  currency: string;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdateLabel: (activityId: string, labelId: string | null) => void;
}) => {
  const [filter, setFilter] = useState<'all' | 'business' | 'personal' | 'labels'>('all');
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  const filteredActivities = activities.filter((a) => {
    if (filter === 'all' || filter === 'labels') return true;
    return a.mode === filter;
  });

  const totalBusiness = activities
    .filter(a => a.mode === 'business')
    .reduce((acc, a) => acc + a.amount, 0);

  const totalPersonal = activities
    .filter(a => a.mode === 'personal')
    .reduce((acc, a) => acc + a.amount, 0);

  const getLabelById = (id: string | null) => labels.find(l => l.id === id);

  // Group by labels
  const labelGroups = activities.reduce((acc: Record<string, { amount: number; count: number }>, a) => {
    const key = a.labelId || 'unlabeled';
    if (!acc[key]) acc[key] = { amount: 0, count: 0 };
    acc[key].amount += a.amount;
    acc[key].count += 1;
    return acc;
  }, {});

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="screen animate-fade-in">
      <header className="log-header">
        <button onClick={onBack} className="icon-button">
          <Icon name="arrow_back" />
        </button>
        <h2 className="screen-title">Activity Log</h2>
        <div className="w-10"></div>
      </header>

      <main className="log-content no-scrollbar">
        {/* Tabs */}
        <div className="filter-tabs">
          {(['all', 'business', 'personal', 'labels'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              className={`filter-tab ${filter === tab ? 'active' : ''}`}
            >
              {tab === 'labels' ? 'By Label' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        {filter !== 'labels' && (
          <div className="summary-cards">
            <div className="summary-card business">
              <div className="summary-card-header">
                <Icon name="business_center" />
                <span>Business</span>
              </div>
              <p className="summary-amount">{formatAmount(totalBusiness, currency)}</p>
            </div>
            <div className="summary-card personal">
              <div className="summary-card-header">
                <Icon name="person" />
                <span>Personal</span>
              </div>
              <p className="summary-amount">{formatAmount(totalPersonal, currency)}</p>
            </div>
          </div>
        )}

        {/* Labels View */}
        {filter === 'labels' ? (
          <div className="space-y-3">
            {Object.entries(labelGroups).map(([key, data]) => {
              const label = key !== 'unlabeled' ? getLabelById(key) : null;
              return (
                <div key={key} className="log-entry">
                  <div className="log-entry-left">
                    <div className={`log-entry-icon ${label ? '' : 'unlabeled'}`} style={label ? { background: label.color + '20', color: label.color } : {}}>
                      <Icon name={label ? 'label' : 'label_off'} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${label ? 'text-slate-900' : 'text-slate-500 italic'}`}>
                        {label ? label.name : 'Unlabeled'}
                      </h4>
                      <p className="text-xs text-slate-500">{data.count} sessions</p>
                    </div>
                  </div>
                  <div className="log-entry-right">
                    <p className="font-bold text-slate-900">{formatAmount(data.amount, currency)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          filteredActivities.length === 0 ? (
            <div className="empty-state">
              <Icon name="history_toggle_off" />
              <p>No activity recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...filteredActivities].reverse().map((activity) => {
                const label = getLabelById(activity.labelId);
                const isEditing = editingActivityId === activity.id;
                return (
                  <div key={activity.id} className="log-entry">
                    <div className="log-entry-left">
                      <div className={`log-entry-icon ${activity.mode}`}>
                        <Icon name={activity.mode === 'business' ? 'work' : 'person'} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-slate-900 truncate">{activity.activityName}</h4>
                        <p className="text-xs text-slate-500">
                          {formatDate(activity.startTime)} • {formatDuration(activity.durationMinutes)}
                        </p>
                        {/* Participants display for business mode */}
                        {activity.mode === 'business' && activity.participantNames && activity.participantNames.length > 0 && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            <Icon name="group" className="inline-icon" /> {activity.participantNames.join(', ')}
                          </p>
                        )}
                        {/* Label Section */}
                        <div className="label-edit-section">
                          {isEditing ? (
                            <div className="label-edit-dropdown">
                              <button
                                className={`label-edit-option ${!activity.labelId ? 'selected' : ''}`}
                                onClick={() => {
                                  onUpdateLabel(activity.id, null);
                                  setEditingActivityId(null);
                                }}
                              >
                                No Label
                              </button>
                              {labels.map((l) => (
                                <button
                                  key={l.id}
                                  className={`label-edit-option ${activity.labelId === l.id ? 'selected' : ''}`}
                                  onClick={() => {
                                    onUpdateLabel(activity.id, l.id);
                                    setEditingActivityId(null);
                                  }}
                                >
                                  <span className="label-dot" style={{ background: l.color }}></span>
                                  {l.name}
                                </button>
                              ))}
                              <button 
                                className="label-edit-cancel"
                                onClick={() => setEditingActivityId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : label ? (
                            <span 
                              className="log-label clickable" 
                              style={{ background: label.color }}
                              onClick={() => setEditingActivityId(activity.id)}
                            >
                              {label.name}
                            </span>
                          ) : (
                            <button 
                              className="add-label-btn"
                              onClick={() => setEditingActivityId(activity.id)}
                            >
                              <Icon name="add" /> Add Label
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="log-entry-right">
                      <p className={`font-bold ${activity.mode === 'business' ? 'text-primary' : 'text-orange-500'}`}>
                        {activity.mode === 'business' ? '+' : ''}{formatAmount(activity.amount, currency)}
                      </p>
                      <button onClick={() => onDelete(activity.id)} className="delete-btn">
                        <Icon name="delete" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
};

// --- Main App ---
function App() {
  const {
    state,
    setMode,
    setCurrency,
    setPersonalRate,
    addParticipant,
    deleteParticipant,
    addLabel,
    deleteLabel,
    deleteActivity,
    updateActivityLabel,
    startSession,
    finishSession,
  } = useAppState();

  // Check if first visit
  const isFirstVisit = !localStorage.getItem('time-is-money-welcomed');
  const [view, setView] = useState<'welcome' | 'selection' | 'setup' | 'tracker' | 'log'>(
    isFirstVisit ? 'welcome' : 'selection'
  );

  const handleWelcomeComplete = () => {
    localStorage.setItem('time-is-money-welcomed', 'true');
    setView('selection');
  };

  // Handle initial load
  useEffect(() => {
    if (state.activeSession) {
      setView('tracker');
    }
  }, []);

  const handleModeSelect = (mode: AppMode) => {
    setMode(mode);
    if (mode === 'personal' && state.personalSettings.hourlyRate === 0) {
      setView('setup');
    } else if (mode === 'business' && state.participants.length === 0) {
      setView('setup');
    } else {
      setView('tracker');
    }
  };

  const handleStartTracking = (activityName: string, labelId: string | null, participantIds?: string[]) => {
    startSession(activityName, labelId, participantIds);
  };

  const handleFinishTracking = (activityName?: string) => {
    finishSession(activityName);
    setView('log');
  };

  if (view === 'welcome') {
    return <WelcomeScreen onContinue={handleWelcomeComplete} />;
  }

  if (view === 'selection') {
    return <ModeSelection onSelect={handleModeSelect} onShowWelcome={() => setView('welcome')} />;
  }

  if (view === 'setup') {
    return (
      <SetupScreen 
        mode={state.mode}
        currency={state.currency}
        personalRate={state.personalSettings.hourlyRate}
        participants={state.participants}
        labels={state.labels}
        onCurrencyChange={setCurrency}
        onPersonalRateChange={setPersonalRate}
        onAddParticipant={addParticipant}
        onRemoveParticipant={deleteParticipant}
        onAddLabel={addLabel}
        onRemoveLabel={deleteLabel}
        onContinue={() => setView('tracker')}
        onBack={() => setView('selection')}
      />
    );
  }

  if (view === 'tracker') {
    return (
      <TrackerScreen 
        mode={state.mode}
        currency={state.currency}
        personalRate={state.personalSettings.hourlyRate}
        participants={state.participants}
        labels={state.labels}
        activeSession={state.activeSession}
        onStart={handleStartTracking}
        onFinish={handleFinishTracking}
        goToLog={() => setView('log')}
        goToSettings={() => setView('setup')}
        goToModeSelection={() => setView('selection')}
      />
    );
  }

  if (view === 'log') {
    return (
      <ActivityLogScreen 
        activities={state.activities}
        labels={state.labels}
        currency={state.currency}
        onBack={() => setView('tracker')}
        onDelete={deleteActivity}
        onUpdateLabel={updateActivityLabel}
      />
    );
  }

  return null;
}

export default App;
