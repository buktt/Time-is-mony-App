import { useState } from 'react';
import type { AppMode, Participant, CustomLabel } from '../../types';
import { CurrencyPicker } from './CurrencyPicker';
import { LabelManager } from './LabelManager';
import { PersonalRateEditor } from './PersonalRateEditor';
import { ParticipantManager } from './ParticipantManager';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AppMode;
  currency: string;
  personalRate: number;
  participants: Participant[];
  labels: CustomLabel[];
  onCurrencyChange: (currency: string) => void;
  onPersonalRateChange: (rate: number) => void;
  onAddParticipant: (name: string, rate: number) => void;
  onUpdateParticipant: (id: string, name: string, rate: number) => void;
  onDeleteParticipant: (id: string) => void;
  onAddLabel: (name: string, color: string) => void;
  onUpdateLabel: (id: string, name: string, color: string) => void;
  onDeleteLabel: (id: string) => void;
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  mode,
  currency,
  personalRate,
  participants,
  labels,
  onCurrencyChange,
  onPersonalRateChange,
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant,
  onAddLabel,
  onUpdateLabel,
  onDeleteLabel,
}: SettingsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'labels' | 'rates'>('general');

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`tab-btn ${activeTab === 'labels' ? 'active' : ''}`}
            onClick={() => setActiveTab('labels')}
          >
            Labels
          </button>
          <button
            className={`tab-btn ${activeTab === 'rates' ? 'active' : ''}`}
            onClick={() => setActiveTab('rates')}
          >
            {mode === 'personal' ? 'Rate' : 'Participants'}
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <CurrencyPicker
              currency={currency}
              onCurrencyChange={onCurrencyChange}
            />
          )}

          {activeTab === 'labels' && (
            <LabelManager
              labels={labels}
              onAddLabel={onAddLabel}
              onUpdateLabel={onUpdateLabel}
              onDeleteLabel={onDeleteLabel}
            />
          )}

          {activeTab === 'rates' && mode === 'personal' && (
            <PersonalRateEditor
              rate={personalRate}
              currency={currency}
              onRateChange={onPersonalRateChange}
            />
          )}

          {activeTab === 'rates' && mode === 'business' && (
            <ParticipantManager
              participants={participants}
              currency={currency}
              onAddParticipant={onAddParticipant}
              onUpdateParticipant={onUpdateParticipant}
              onDeleteParticipant={onDeleteParticipant}
            />
          )}
        </div>
      </div>
    </div>
  );
};
