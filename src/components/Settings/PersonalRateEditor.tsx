import { useState, useEffect } from 'react';
import { CURRENCIES } from '../../types';
import './PersonalRateEditor.css';

interface PersonalRateEditorProps {
  rate: number;
  currency: string;
  onRateChange: (rate: number) => void;
}

export const PersonalRateEditor = ({
  rate,
  currency,
  onRateChange,
}: PersonalRateEditorProps) => {
  const [inputValue, setInputValue] = useState(rate.toString());

  useEffect(() => {
    setInputValue(rate.toString());
  }, [rate]);

  const handleBlur = () => {
    const newRate = parseFloat(inputValue) || 0;
    onRateChange(newRate);
  };

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || currency;

  return (
    <div className="personal-rate-editor">
      <div className="settings-section">
        <span className="settings-section-title">Your Hourly Rate</span>
        
        <div className="rate-input-wrapper">
          <span className="rate-currency">{currencySymbol}</span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            className="rate-input"
            placeholder="0"
            min="0"
            step="0.01"
          />
          <span className="rate-suffix">/ hour</span>
        </div>

        <p className="rate-hint">
          This rate will be used to calculate your earnings when you track time in Personal mode.
        </p>
      </div>
    </div>
  );
};

