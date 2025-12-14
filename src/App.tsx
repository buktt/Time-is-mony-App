import { useState, useEffect } from 'react';
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

// --- Mode Selection Screen ---
const ModeSelection = ({ onSelect }: { onSelect: (mode: AppMode) => void }) => {
  return (
    <div className="screen animate-fade-in">
      <div className="screen-header">
        <div className="w-10"></div>
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
            <p className="mode-card-desc">Track costs, hobbies & personal projects</p>
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
            <p className="mode-card-desc">Track earnings, billable hours & clients</p>
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
          <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Add Labels (Optional)</label>
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
  goToSettings
}: {
  mode: AppMode;
  currency: string;
  personalRate: number;
  participants: Participant[];
  labels: CustomLabel[];
  activeSession: { startTime: number; activityName: string; labelId: string | null; participantIds?: string[] } | null;
  onStart: (name: string, labelId: string | null, participantIds?: string[]) => void;
  onFinish: () => void;
  goToLog: () => void;
  goToSettings: () => void;
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
    onFinish();
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
          <span className={`mode-tag ${mode}`}>
            {mode === 'personal' ? 'Personal' : 'Business'} Mode
          </span>
        </div>
        <button onClick={goToLog} className="icon-button">
          <Icon name="history" />
        </button>
      </header>

      <main className="tracker-content">
        <div className="tracker-display">
          <div className="rate-badge">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wide mr-2">Rate</span>
            <span className="text-slate-900 text-sm font-bold">{formatAmount(currentHourlyRate, currency)}/hr</span>
          </div>
          
          <h1 className="earnings-display">
            {currencySymbol}{currentEarnings.toFixed(2)}
          </h1>
          
          <div className="timer-display">
            <Icon name="timer" />
            <span className="timer-value">{formatElapsedTime(elapsed)}</span>
          </div>
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

  const [view, setView] = useState<'selection' | 'setup' | 'tracker' | 'log'>('selection');

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

  const handleFinishTracking = () => {
    finishSession();
    setView('log');
  };

  if (view === 'selection') {
    return <ModeSelection onSelect={handleModeSelect} />;
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
